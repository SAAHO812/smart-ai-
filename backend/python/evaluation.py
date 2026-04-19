import sys
import json
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import os

nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))
hf_token = os.getenv("HUGGINGFACE_TOKEN")
model = SentenceTransformer("all-MiniLM-L6-v2", use_auth_token=hf_token)

def extract_keywords(text):
    tokens = word_tokenize(text.lower())
    keywords = [lemmatizer.lemmatize(w) for w in tokens if w.isalnum() and w not in stop_words]
    return set(keywords)

def generate_detailed_feedback(student_text, reference_text, score, topic):
    ref_keywords = extract_keywords(reference_text)
    stud_keywords = extract_keywords(student_text)

    matched = ref_keywords & stud_keywords
    missing = ref_keywords - stud_keywords
    extra = stud_keywords - ref_keywords

    feedback_points = []

    # Strength-based feedback
    if score >= 4.5:
        feedback_points.append("✅ Excellent understanding of the topic.")
    elif score >= 3.0:
        feedback_points.append("✅ Good attempt. You captured several important points.")
    elif score > 0:
        feedback_points.append("⚠️ The answer is partially correct but misses key areas.")
    else:
        feedback_points.append("❌ The answer does not address the expected concepts.")

    # Keyword analysis
    if matched:
        feedback_points.append(f"✔️ Correctly mentioned: {', '.join(sorted(matched)[:5])}.")
    if missing:
        feedback_points.append(f"❌ Missing key concepts: {', '.join(sorted(missing)[:5])}.")
    if extra:
        feedback_points.append(f"📝 Contains irrelevant information: {', '.join(sorted(extra)[:3])}.")

    # Suggestion
    feedback_points.append("📌 Focus more on concepts like: " + ', '.join(sorted(ref_keywords)[:3]) + ".")

    return feedback_points


def preprocess(text):
    try:
        tokens = word_tokenize(text.lower())
        words = [lemmatizer.lemmatize(w) for w in tokens if w.isalnum() and w not in stop_words]
        return " ".join(words)
    except Exception as e:
        print(f"⚠️ Preprocessing error: {str(e)}", file=sys.stderr)
        return ""

def evaluate(student_file, answer_key):
    try:
        with open(student_file, encoding="utf-8") as sf, open(answer_key, encoding="utf-8") as ak:
            student_text = sf.read()
            reference_text = ak.read()

        question_pattern = r'''
            (?<!\#)                     # Negative lookbehind for #
            \n                          # New line
            (?=                         # Lookahead for question markers
                (?:Q\.?\s*\d+\b)        # Q1, Q.1, Q 1
                |(?:Question\s+\d+\b)   # Question 1
                |(?:^\d+[\.\)]\s)       # 1., 1)
                |(?:^\[\d+\]\s)         # [1]
            )
        '''

        # Split and filter blocks for both student and reference
        def process_blocks(text):
            raw_blocks = re.split(question_pattern, text, 
                                flags=re.VERBOSE|re.IGNORECASE|re.MULTILINE)
            question_block_re = re.compile(
                r'^\s*(Q\.?|Question|\d+[.)]|\[\d+\])', 
                re.IGNORECASE | re.MULTILINE
            )
            return [b.strip() for b in raw_blocks 
                   if b.strip() and question_block_re.search(b)]

        student_blocks = process_blocks(student_text)
        reference_blocks = process_blocks(reference_text)
        # Answer extraction function
        def extract_answers(blocks):
            answers = []
            answer_pattern = re.compile(
                r'(?i)(?:answer|ans|solution)[\s:\-]*((?:.(?!\b(?:Q|Question)\b))*.+)',
                re.DOTALL
            )
            for block in blocks:
                match = answer_pattern.search(block)
                if match:
                    answer = match.group(1).strip()
                    answer = '\n'.join([p.strip() for p in answer.split('\n') if p.strip()])
                    answers.append(answer)
                else:
                    answers.append("")  # Mark missing answers
            return answers

        student_answers = extract_answers(student_blocks)
        reference_answers = extract_answers(reference_blocks)

        results = []
        # Process based on reference answer length
        for idx in range(1, len(reference_answers) + 1):
            try:
                stud = student_answers[idx-1] if idx <= len(student_answers) else ""
                ref = reference_answers[idx-1]
            except IndexError:
                stud = ""
                ref = ""

            clean_stud = preprocess(stud)
            clean_ref = preprocess(ref)

            if not clean_stud or not clean_ref:
                score = 0.0
                similarity = 0.0
                topic = "Missing Answer" if not clean_stud else "Error"
            else:
                try:
                    emb_stud = model.encode(clean_stud)
                    emb_ref = model.encode(clean_ref)
                    raw_score = cosine_similarity([emb_stud], [emb_ref])[0][0]
                    score = float(raw_score)
                    similarity = round(score * 100, 2)
                    score = round(min(score * 5, 5.0), 2)
                    keywords = set(clean_ref.split()) - stop_words
                    topic = ", ".join(sorted(keywords)[:3]) or "General"
                except Exception as e:
                    print(f"Scoring error for Q{idx}: {str(e)}", file=sys.stderr)
                    score = 0.0
                    similarity = 0.0
                    topic = "Scoring Error"

                feedback = generate_detailed_feedback(clean_stud, clean_ref, score, topic)

                results.append({
                    "question": idx,
                    "score": score,
                    "similarity": similarity,
                    "topic": topic,
                    "student_answer": stud,
                    "reference_answer": ref,
                    "feedback": feedback
                })


        # Handle question count mismatch
        if len(student_answers) != len(reference_answers):
            print(f"Question mismatch: Student {len(student_answers)} vs Reference {len(reference_answers)}", 
                  file=sys.stderr)

        print(json.dumps(results))

    except Exception as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        sys.exit(1)

def main():
    try:
        input_data = json.load(sys.stdin)
        student_file = input_data["student_file"]
        answer_key = input_data["answer_key"]
        evaluate(student_file, answer_key)
    except Exception as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()