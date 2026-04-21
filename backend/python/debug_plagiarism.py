import subprocess
import json
import sys

input_data = {
    "file_urls": [
        "http://localhost:5000/uploads/test.pdf",
        "http://localhost:5000/uploads/test2.pdf"
    ],
    "threshold": 75
}

process = subprocess.Popen(
    [sys.executable, "check_plagiarism.py"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

stdout, stderr = process.communicate(input=json.dumps(input_data))
print("STDOUT:", stdout)
print("STDERR:", stderr)
print("RETURN CODE:", process.returncode)
