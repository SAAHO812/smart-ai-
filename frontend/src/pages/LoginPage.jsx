import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(import.meta.env.VITE_BACKEND_URL);
    // You can add validation or authentication here
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          email: email,
          password,
          role,
        }
      );

      const { token } = res.data;
      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);

      if (role === "student") {
        navigate("/student/profile");
      } else {
        navigate("/teacher/profile");
      }
    } catch (err) {
      alert("Invalid ID or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f0f4ff] to-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 20h9"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-center text-2xl font-semibold mb-1">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Please sign in to your account
        </p>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            className={`w-1/2 py-3 border rounded-lg text-sm font-medium ${
              role === "student"
                ? "bg-blue-50 border-blue-500 text-blue-600"
                : "bg-white border-gray-300 text-gray-600"
            }`}
            onClick={() => setRole("student")}
          >
            <div className="flex flex-col items-center">
              🎓
              <span>Student</span>
            </div>
          </button>
          <button
            className={`w-1/2 py-3 border rounded-lg text-sm font-medium ${
              role === "teacher"
                ? "bg-blue-50 border-blue-500 text-blue-600"
                : "bg-white border-gray-300 text-gray-600"
            }`}
            onClick={() => setRole("teacher")}
          >
            <div className="flex flex-col items-center">
              🧑‍🏫
              <span>Teacher</span>
            </div>
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded size-4" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign in
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>

        <footer className="text-center text-xs text-gray-400 mt-6">
          © 2025 EduHub. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
