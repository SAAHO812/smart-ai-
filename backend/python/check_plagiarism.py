import sys
import json
import requests
import re
import string
import os
from io import BytesIO
from PyPDF2 import PdfReader
from docx import Document
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")

def extract_text_from_pdf(pdf_content: bytes) -> str:
    try:
        text = ""
        with BytesIO(pdf_content) as pdf_file:
            reader = PdfReader(pdf_file)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text.encode("utf-8", errors="replace").decode("utf-8") + "\n"
        return text.strip()
    except Exception as e:
        raise Exception(f"PDF processing failed: {str(e)}")

def extract_text_from_docx(docx_content: bytes) -> str:
    try:
        doc = Document(BytesIO(docx_content))
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        raise Exception(f"DOCX processing failed: {str(e)}")

def preprocess_text(text: str) -> str:
    text = text.lower().translate(str.maketrans('', '', string.punctuation))
    stopwords_set = {'the', 'and', 'is', 'in', 'it', 'to', 'of', 'for', 'a', 'an'}
    words = [word for word in text.split() if word not in stopwords_set]
    return re.sub(r'\d+', '', ' '.join(words)).strip()

def check_plagiarism_from_urls(file_urls, threshold=75):
    texts = []
    for url in file_urls:
        try:
            response = requests.get(url, timeout=15)
            response.raise_for_status()
            content = response.content
            
            # Identify file type from URL extension
            ext = os.path.splitext(url.split('?')[0])[1].lower()
            
            if ext == '.pdf':
                raw_text = extract_text_from_pdf(content)
            elif ext == '.docx':
                raw_text = extract_text_from_docx(content)
            elif ext in ['.txt', '.md']:
                raw_text = content.decode('utf-8', errors='replace')
            else:
                # Fallback: try PDF first, then text
                try:
                    raw_text = extract_text_from_pdf(content)
                except:
                    raw_text = content.decode('utf-8', errors='replace')
            
            processed_text = preprocess_text(raw_text)
            if not processed_text:
                raise Exception(f"No meaningful text extracted from {url}")
            texts.append(processed_text)
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to download {url}: {str(e)}")

    # Use SentenceTransformer embeddings for semantic similarity
    embeddings = model.encode(texts)
    threshold_decimal = threshold / 100
    results = []

    for i in range(len(texts)):
        for j in range(i + 1, len(texts)):
            similarity = cosine_similarity([embeddings[i]], [embeddings[j]])[0][0]
            results.append({
                "file1_index": i,
                "file2_index": j,
                "similarity_score": round(float(similarity), 4),
                "is_plagiarised": bool(similarity >= threshold_decimal)
            })

    return {"results": results}

def main():
    try:
        input_data = json.load(sys.stdin)
        file_urls = input_data.get('file_urls', [])
        threshold = input_data.get('threshold', 75)

        if not file_urls:
            print(json.dumps({"error": "No file URLs provided"}))
            return

        result = check_plagiarism_from_urls(file_urls, threshold)
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()