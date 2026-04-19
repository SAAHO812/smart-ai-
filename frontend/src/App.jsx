import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import TeacherDashboard from "./pages/teacher/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";
import TeacherProfile from "./pages/teacher/Profile";
import StudentProfile from "./pages/student/Profile";
import PlagiarismCheck from "./pages/teacher/PlagiarismCheck";
import AnswerEvaluation from "./pages/teacher/AnswerEvaluation";
import FeedbackAnalysis from "./pages/teacher/FeedbackAnalysis";
import Assignments from "./pages/student/Assignments";
import StudentFeedback from "./pages/student/Feedback";
import Practice from "./pages/student/Practice";
import { AppProvider } from "./context/AppContext";
import QuestionGeneration from "./pages/teacher/QuestionGeneration";
import LoginPage from "./pages/LoginPage";

function App() {
  const [userRole] = useState("teacher");

  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <LoginPage/>
            }
          />

          {/* Teacher Routes */}
          <Route path="/teacher" element={<Layout userRole="teacher" />}>
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="profile" element={<TeacherProfile />} />
            <Route path="plagiarism" element={<PlagiarismCheck />} />
            <Route path="evaluation" element={<AnswerEvaluation />} />
            <Route path="feedback" element={<FeedbackAnalysis />} />
            <Route path="questions" element={<QuestionGeneration />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={<Layout userRole="student" />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="feedback" element={<StudentFeedback />} />
            <Route path="practice" element={<Practice />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
