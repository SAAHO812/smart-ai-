import sys
import json
import re
import requests
from io import BytesIO
from pdfminer.high_level import extract_text as pdfminer_extract

def extract_text_from_pdf(pdf_content: bytes) -> str:
    try:
        with BytesIO(pdf_content) as f:
            text = pdfminer_extract(f)
        return text.strip() if text else ""
    except Exception as e:
        raise Exception(f"PDF processing failed: {str(e)}")


def compute_ai_score(text: str) -> float:
    """
    Heuristic-based AI content score (0.0 - 1.0).
    AI-generated text tends to:
      - Have longer average sentence length
      - Use more formal/complex vocabulary
      - Have lower lexical diversity (repetitive words)
      - Very few typos / contractions
      - Highly uniform sentence structure
    """
    if not text or len(text.strip()) < 50:
        return 0.0

    score = 0.0

    # 1. Sentence length analysis (AI text tends to be verbose)
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 5]
    if sentences:
        avg_sentence_len = sum(len(s.split()) for s in sentences) / len(sentences)
        if avg_sentence_len > 25:
            score += 0.30
        elif avg_sentence_len > 18:
            score += 0.15
        elif avg_sentence_len < 10:
            score -= 0.10

    # 2. Contraction usage — humans use contractions, AI often avoids them
    contractions = re.findall(r"\b(it's|don't|can't|won't|I'm|I've|we're|they're|isn't|aren't|didn't|couldn't|shouldn't|wouldn't|you're|you've|that's|there's|he's|she's)\b", text, re.IGNORECASE)
    contraction_ratio = len(contractions) / max(len(text.split()), 1)
    if contraction_ratio < 0.005:
        score += 0.20  # Very few contractions → AI-like
    elif contraction_ratio > 0.02:
        score -= 0.10  # Lots of contractions → Human-like

    # 3. Lexical diversity — AI tends to reuse a core formal vocabulary
    words = re.findall(r'\b[a-zA-Z]{4,}\b', text.lower())
    if words:
        unique_ratio = len(set(words)) / len(words)
        if unique_ratio < 0.45:
            score += 0.20
        elif unique_ratio > 0.65:
            score -= 0.10

    # 4. Formal AI marker phrases
    ai_phrases = [
        "it is worth noting", "it is important to note", "in conclusion",
        "furthermore", "moreover", "additionally", "it is essential",
        "in summary", "to summarize", "this essay", "in this context",
        "plays a crucial role", "a fundamental aspect", "as a result",
        "this demonstrates", "it can be observed", "significantly contributes",
        "in order to", "it should be noted", "one must consider",
        "as mentioned above", "a wide range of", "the aforementioned",
        "a comprehensive", "an extensive", "various aspects of"
    ]
    ai_phrase_count = sum(1 for phrase in ai_phrases if phrase in text.lower())
    score += min(ai_phrase_count * 0.04, 0.25)

    # 5. Passive voice — AI uses it heavily
    passive_patterns = re.findall(r'\b(is|are|was|were|be|been|being)\s+\w+ed\b', text, re.IGNORECASE)
    passive_ratio = len(passive_patterns) / max(len(sentences), 1)
    if passive_ratio > 1.5:
        score += 0.10
    elif passive_ratio > 0.8:
        score += 0.05

    # 6. First-person personal — humans use "I", "my", "we" more
    first_person = re.findall(r'\b(I|my|mine|me|we|our|us)\b', text)
    first_person_ratio = len(first_person) / max(len(text.split()), 1)
    if first_person_ratio > 0.04:
        score -= 0.15  # Highly personal → human
    elif first_person_ratio < 0.005:
        score += 0.10  # Almost no first person → AI-like

    # Clamp between 0 and 1
    return round(max(0.0, min(1.0, score)), 4)


def detect_ai_content(file_urls):
    results = []
    for url in file_urls:
        try:
            response = requests.get(url, timeout=15)
            response.raise_for_status()
            text = extract_text_from_pdf(response.content)

            if not text:
                results.append({"url": url, "ai_score": 0.0, "label": "Unknown", "error": "No text found"})
                continue

            ai_score = compute_ai_score(text)
            label = "Likely AI" if ai_score >= 0.5 else "Likely Human"

            results.append({
                "url": url,
                "ai_score": ai_score,
                "label": label
            })

        except Exception as e:
            results.append({"url": url, "ai_score": 0.0, "error": str(e)})

    return {"results": results}


def main():
    try:
        input_data = json.load(sys.stdin)
        file_urls = input_data.get('file_urls', [])

        if not file_urls:
            print(json.dumps({"error": "No file URLs provided"}))
            return

        result = detect_ai_content(file_urls)
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)


if __name__ == "__main__":
    main()
