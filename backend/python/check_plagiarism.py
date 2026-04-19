import sys
import json
import requests
from io import BytesIO
from PyPDF2 import PdfReader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import string
import nltk
import os

try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('tokenizers/punkt_tab')
    nltk.data.find('corpora/stopwords')
except LookupError:
    print("Downloading required NLTK data files...", file=sys.stderr)
    try:
        nltk.download('punkt')
        nltk.download('punkt_tab')
        nltk.download('stopwords')
    except Exception as e:
        print(f"Failed to download NLTK data: {str(e)}", file=sys.stderr)
        sys.exit(1)

nltk_data_path = os.path.join(os.path.expanduser('~'), 'nltk_data')
nltk.data.path.append(nltk_data_path)

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

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

def preprocess_text(text: str) -> str:
    """Enhanced text preprocessing"""
    text = text.lower().translate(str.maketrans('', '', string.punctuation))
    stopwords_set = set(['the', 'and', 'is', 'in', 'it', 'to', 'of', 'for'])
    words = [word for word in text.split() if word not in stopwords_set]
    return re.sub(r'\d+', '', ' '.join(words)).strip()

def extract_text(pdf_path):
    try:
        with open(pdf_path, 'rb') as f:
            reader = PdfReader(f)
            text = " ".join([page.extract_text() or "" for page in reader.pages])
            print(f"Raw text from {pdf_path}: {text[:200]}...")
            return clean_text(text)
    except Exception as e:
        print(f"Error processing {pdf_path}: {str(e)}", file=sys.stderr)
        return ""

def clean_text(text):
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s]', '', text)
    return text.strip()

def tokenize(text):
    try:
        tokens = word_tokenize(text)
        return [token for token in tokens if len(token) > 2]
    except Exception as e:
        print(f"Tokenization error: {str(e)}", file=sys.stderr)
        return [word for word in text.split() if len(word) > 2]

def calculate_similarity(texts):
    try:
        vectorizer = TfidfVectorizer(
            tokenizer=tokenize,
            stop_words=stopwords.words('english'),
            token_pattern=None 
        )
        tfidf_matrix = vectorizer.fit_transform(texts)
        return cosine_similarity(tfidf_matrix)
    except Exception as e:
        print(f"Similarity calculation error: {str(e)}", file=sys.stderr)
        raise

def check_plagiarism_from_urls(file_urls, threshold=75):
    try:
        texts = []
        for url in file_urls:
            try:
                response = requests.get(url, timeout=10)
                response.raise_for_status()
                raw_text = extract_text_from_pdf(response.content)
                processed_text = preprocess_text(raw_text)
                
                if not processed_text:
                    raise Exception(f"No meaningful text from {url}")
                texts.append(processed_text)
                
            except requests.exceptions.RequestException as e:
                raise Exception(f"Failed to download {url}: {str(e)}")

        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(texts)
        
        threshold_decimal = threshold / 100
        results = []
        
        for i in range(len(texts)):
            for j in range(i + 1, len(texts)):
                similarity = cosine_similarity(
                    tfidf_matrix[i:i+1], 
                    tfidf_matrix[j:j+1]
                )[0][0]
                
                results.append({
                    "file1_index": i,
                    "file2_index": j,
                    "similarity_score": round(float(similarity), 4),  
                    "is_plagiarised": bool(similarity >= threshold_decimal)
                })
        
        return {"results": results}

    except Exception as e:
        raise Exception(f"Internal error: {str(e)}")

def main():
    try:
        input_data = json.load(sys.stdin)
        if 'file_urls' in input_data:
            file_urls = input_data['file_urls']
            threshold = input_data.get('threshold', 75)
            result = check_plagiarism_from_urls(file_urls, threshold)
            print(json.dumps(result))
            return
        
        files = input_data['files']
        threshold = input_data.get('threshold', 75)
        
        print(f"Received files: {files}", file=sys.stderr)
        print("NLTK data path:", nltk.data.path, file=sys.stderr)
        
        texts = []
        valid_indices = []
        
        for i, file_path in enumerate(files):
            text = extract_text(file_path)
            if text and len(text) > 100:
                texts.append(text)
                valid_indices.append(i)
        
        if len(texts) < 2:
            print(json.dumps([]))
            return
        
        similarity_matrix = calculate_similarity(texts)
        results = []
        
        for i in range(len(texts)):
            for j in range(i+1, len(texts)):
                similarity = similarity_matrix[i][j] * 100
                if similarity >= threshold:
                    results.append({
                        'index1': valid_indices[i],
                        'index2': valid_indices[j],
                        'similarity': round(similarity, 2)
                    })
        print(json.dumps(results))
        
    except Exception as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()