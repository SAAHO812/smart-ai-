import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, field_validator,Field
from fastapi.responses import HTMLResponse
from typing import List
import subprocess
import tempfile
import os
import json
from pdfminer.high_level import extract_text
import shutil

app = FastAPI(title="Academic Analytics API")

class ResultItem(BaseModel):
    score: float = Field(..., ge=0, le=5)
    topic: str
    student_answer: str
    reference_answer: str

class SubmissionItem(BaseModel):
    student_name: str
    results: List[ResultItem]

class PerformanceReportRequest(BaseModel):
    submissions: List[SubmissionItem]

class EvaluationRequest(BaseModel):
    file_urls: List[str]
    answer_key: str

class AIContentRequest(BaseModel):
    file_urls: List[str]

class PlagiarismCheckRequest(BaseModel):
    file_urls: List[str]
    threshold: float = 75
    @field_validator("threshold")
    def validate_threshold(cls, value):
        if not (0 <= value <= 100):
            raise ValueError("Threshold must be between 0 and 100.")
        return value

@app.post("/checkPlagiarism")
async def check_plagiarism_endpoint(request_data: PlagiarismCheckRequest):
    try:
        input_data = {
            "file_urls": request_data.file_urls,
            "threshold": request_data.threshold
        }
        
        process = subprocess.Popen(
            ["python", "check_plagiarism.py"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        stdout, stderr = process.communicate(input=json.dumps(input_data))
        
        if process.returncode != 0:
            error_msg = stderr.strip() if stderr else "Unknown error occurred"
            raise HTTPException(500, f"Plagiarism check failed: {error_msg}")
        
        try:
            result = json.loads(stdout)
            return result
        except json.JSONDecodeError:
            raise HTTPException(500, "Invalid response from plagiarism checker")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Internal error: {str(e)}")

@app.post("/evaluate")
async def evaluate_submissions(request: EvaluationRequest):
    try:
        temp_dir = tempfile.mkdtemp()
        student_text_path = os.path.join(temp_dir, "student_answers.txt")
        answer_key_path = os.path.join(temp_dir, "answer_key.txt")

        all_student_answers = []
        for url in request.file_urls:
            response = requests.get(url, stream=True)
            response.raise_for_status()

            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_pdf:
                for chunk in response.iter_content(chunk_size=8192):
                    temp_pdf.write(chunk)

            text = extract_text(temp_pdf.name)
            answers = [line.strip() for line in text.strip().splitlines() if line.strip()]
            all_student_answers.append(answers)
            os.unlink(temp_pdf.name)

        with open(student_text_path, "w",encoding="utf-8") as f:
            for line in all_student_answers[0]:
                f.write(line + "\n")

        response = requests.get(request.answer_key, stream=True)
        response.raise_for_status()

        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_pdf:
            for chunk in response.iter_content(chunk_size=8192):
                temp_pdf.write(chunk)

        answer_key_text = extract_text(temp_pdf.name)
        os.unlink(temp_pdf.name)

        with open(answer_key_path, "w", encoding="utf-8") as f:
            for line in answer_key_text.strip().splitlines():
                if line.strip():
                    f.write(line.strip() + "\n")

        result = subprocess.run(
            ["python", "evaluation.py"],
            input=json.dumps({
                "student_file": student_text_path,
                "answer_key": answer_key_path
            }),
            capture_output=True,
            text=True,
            encoding="utf-8",
            env={**os.environ, "PYTHONUTF8": "1"} 
        )

        shutil.rmtree(temp_dir)

        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=result.stderr)

        return {"results": json.loads(result.stdout)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generatePerformanceReport", response_class=HTMLResponse)
async def generate_performance_report(request_data: PerformanceReportRequest):
    try:
        submissions_data = [sub.dict() for sub in request_data.submissions]
        input_data = {
            "submissions": submissions_data
        }
        process = subprocess.Popen(
            ["python", "allStudentPerformanceReport.py"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8"
        )
        
        stdout, stderr = process.communicate(input=json.dumps(input_data))
        
        if process.returncode != 0:
            error_msg = stderr.strip() if stderr else "Unknown error occurred"
            raise HTTPException(500, f"Performance report generation failed: {error_msg}")
        
        return HTMLResponse(
            content=stdout, 
            headers={"Content-Type": "text/html; charset=utf-8"}
        )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Internal error: {str(e)}")

@app.post("/detectAI")
async def detect_ai_content_endpoint(request_data: AIContentRequest):
    try:
        input_data = {
            "file_urls": request_data.file_urls
        }
        
        process = subprocess.Popen(
            ["python", "ai_detector.py"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        stdout, stderr = process.communicate(input=json.dumps(input_data))
        
        if process.returncode != 0:
            error_msg = stderr.strip() if stderr else "Unknown error occurred"
            raise HTTPException(500, f"AI detection failed: {error_msg}")
        
        try:
            result = json.loads(stdout)
            return result
        except json.JSONDecodeError:
            raise HTTPException(500, "Invalid response from AI detector")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Internal error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)