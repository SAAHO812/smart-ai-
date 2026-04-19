# 📚 Smart Check AI – Assignment Automation System

Smart Check AI is a full-stack web application that automates assignment workflows in academic settings. Designed to reduce manual workload, the system enables teachers to generate questions, detect plagiarism, evaluate submissions, and deliver personalized feedback — all through AI.

Developed as a Minor Project for B.Tech (Computer Science and Engineering) at Maulana Azad National Institute of Technology, Bhopal (2024–25).

---

## 🚀 Features

- 🔐 **Role-Based Authentication**: Secure login system for teachers and students.
- 📝 **Assignment Creation**: Teachers can auto-generate questions using fine-tuned LLaMA 2 model.
- 📥 **Student Submission**: Upload assignments in PDF format.
- 🔍 **Plagiarism Detection**: TF-IDF + Cosine Similarity-based engine to detect overlaps.
- 🤖 **Automated Evaluation**: AI model compares student answers with reference using semantic similarity (S-BERT).
- 📊 **Feedback & Analytics**: Performance reports, weak-topic analysis, and evaluation stats.
- 💬 **Practice Module**: Students can generate topic-wise, difficulty-specific practice questions.

---

## 🛠️ Tech Stack

**Frontend**
- React.js
- Tailwind CSS

**Backend**
- Node.js
- Express.js
- JWT Authentication

**AI/ML Microservices**
- Python
- Flask APIs
- LLaMA 2 (Fine-tuned)
- Sentence-BERT
- TF-IDF & Cosine Similarity
- NLP (NLTK, Scikit-learn)

**Database**
- MongoDB (NoSQL)

---

## 🧠 AI Capabilities

| Feature               | AI Technique Used                         |
|----------------------|--------------------------------------------|
| Question Generation  | Fine-tuned LLaMA 2 using LoRA & QLoRA     |
| Plagiarism Detection | TF-IDF + Cosine Similarity                |
| Answer Evaluation    | Sentence-BERT semantic embeddings         |

---

## 📸 Screenshots

> ![Login Page](screenshots/login.png)
> ![Question Generator](screenshots/generator.png)
> ![Evaluation Report](screenshots/evaluation.png)
> ![Student Dashboard](screenshots/student_profile.png)

*(Add images in a `/screenshots` folder in your repo.)*

---

## 📂 Project Structure

smart-check-ai/
├── client/ # React frontend
├── server/ # Node.js backend
├── ml-services/ # Flask-based ML APIs
├── evaluation.py # CLI for offline evaluation
├── checkPlagiarism.py # CLI for plagiarism detection
└── README.md


---
## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Prajjwal888/smart-check-ai.git
cd smart-check-ai
```

2. Setup Backend

cd server
npm install
npm run dev

3. Setup Frontend

cd ../client
npm install
npm start

4. Run ML Services

cd ../ml-services
pip install -r requirements.txt
python app.py


⚠️ For LLaMA 2 fine-tuning, use Colab with 24GB GPU or deploy on HuggingFace.

🧪 Evaluation CLI (Optional)

Run offline evaluation:
python evaluation.py --student_file student.pdf --answer_key answer.pdf


🧭 Future Scope

Handwritten answer evaluation (OCR)

Multilingual support (regional languages)

Adaptive learning paths based on feedback

AI-generated quizzes by syllabus

Academic integrity tools (AI-content detection)

