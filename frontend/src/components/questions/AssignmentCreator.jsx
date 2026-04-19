import React, { useState, useEffect } from "react";
import axios from "axios";
import { UploadCloud } from "lucide-react";

export default function AssignmentCreator() {
  const [assignmentDetails, setAssignmentDetails] = useState({
    title: "",
    subject: "",
    dueDate: "",
    description: "",
    course: "",
    file: null,
  });

  const [availableSubjects, setAvailableSubjects] = useState([]);
  // Fetch subjects the teacher teaches
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/getSubjects`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAvailableSubjects(res.data.subjects || []);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setAssignmentDetails((prev) => ({
        ...prev,
        file: files[0],
      }));
    } else {
      setAssignmentDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Upload Assignment Handler
  const handleAssignmentUpload = async () => {
    if (
      !assignmentDetails.title ||
      !assignmentDetails.subject ||
      !assignmentDetails.file
    ) {
      alert("Please fill all required fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", assignmentDetails.title);
    formData.append("subject", assignmentDetails.subject);
    formData.append("dueDate", assignmentDetails.dueDate);
    formData.append("description", assignmentDetails.description);
    formData.append("file", assignmentDetails.file);
    formData.append("course", assignmentDetails.course);
    console.log(assignmentDetails.file);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/uploadAssignment`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Assignment uploaded successfully!");
      // Optional: Reset form after success
      setAssignmentDetails({
        title: "",
        subject: "",
        dueDate: "",
        description: "",
        course: "",
        file: null,
      });
    } catch (error) {
      console.error("Failed to upload assignment:", error);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Create New Assignment</h2>

      {/* Assignment Form */}
      <div className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Assignment Title</label>
          <input
            type="text"
            name="title"
            value={assignmentDetails.title}
            onChange={handleInputChange}
            className="form-input w-full"
            placeholder="Enter title"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Select Subject</label>
          <select
            name="subject"
            value={assignmentDetails.subject}
            onChange={handleInputChange}
            className="form-input w-full"
          >
            <option value="">Select a subject</option>
            {availableSubjects.map((subj, idx) => (
              <option key={idx} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Upload Assignment PDF
          </label>
          <input
            type="file"
            name="file"
            accept="application/pdf"
            onChange={handleInputChange}
            className="form-input w-full"
          />
          {assignmentDetails.file && (
            <p className="text-sm text-gray-500 mt-1">
              {assignmentDetails.file.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={assignmentDetails.dueDate}
              onChange={handleInputChange}
              className="form-input w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Course</label>
            <input
              type="text"
              name="course"
              value={assignmentDetails.course}
              onChange={handleInputChange}
              className="form-input w-full"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={assignmentDetails.description}
            onChange={handleInputChange}
            rows={4}
            className="form-input w-full"
            placeholder="Write description..."
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            onClick={handleAssignmentUpload}
            className="btn bg-blue-600 text-white hover:bg-blue-700 w-full flex items-center justify-center gap-2"
          >
            <UploadCloud size={18} />
            Upload Assignment
          </button>
        </div>
      </div>
    </div>
  );
}
