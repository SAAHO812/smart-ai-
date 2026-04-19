import { useEffect, useState } from "react";
import { User, Mail, Phone, Book, Calendar, MapPin } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";

export default function StudentProfile() {
  const { user } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    grade: "",
    dateOfBirth: "",
    address: "",
    subjects: [],
    achievements: [],
    averageScore: 0,
    totalAssignments: 0,
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/getProfile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setData(response.data.profile);
      } catch (error) {
        console.log("Error loading student profile");
        console.error(error);
      }
    }
    loadProfile();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
        <p className="text-gray-600 mt-1">
          View and manage your profile information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Info */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                Personal Information
              </h2>
              {/* Optional Editing */}
              {/* <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="flex items-center">
                  <User size={18} className="text-gray-400 mr-2" />
                  <span>{data.name}</span>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="flex items-center">
                  <Mail size={18} className="text-gray-400 mr-2" />
                  <span>{data.email}</span>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="flex items-center">
                  <Phone size={18} className="text-gray-400 mr-2" />
                  <span>{data.phoneNumber}</span>
                </div>
              </div>

              {/* Grade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <div className="flex items-center">
                  <Book size={18} className="text-gray-400 mr-2" />
                  <span>{data.department}</span>
                </div>
              </div>

              {/* DOB */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <div className="flex items-center">
                  <Calendar size={18} className="text-gray-400 mr-2" />
                  <span>{data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : '-'}</span>
                </div>
              </div> */}

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="flex items-center">
                  <MapPin size={18} className="text-gray-400 mr-2" />
                  <span>{data.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="card p-6 mt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Academic Information
            </h2>

            {/* Subjects */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Enrolled Subjects
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.subjects?.map((subject, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Achievements
              </h3>
              <ul className="space-y-2">
                {data.achievements?.map((achievement, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Profile Summary */}
          <div className="card p-6 text-center">
            <div className="mb-4">
              <img
                src={user?.avatar || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto"
              />
            </div>
            <h3 className="font-medium text-lg">{data.name}</h3>
            <p className="text-gray-500 text-sm">{data.grade}</p>

            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-primary-600">
                    {data.averageScore}%
                  </div>
                  <div className="text-sm text-gray-500">Average Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">
                    {data.totalAssignments}
                  </div>
                  <div className="text-sm text-gray-500">Assignments</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6 mt-6">
            <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="btn btn-primary w-full">
                View Assignments
              </button>
              <button className="btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 w-full">
                Check Feedback
              </button>
              <button className="btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 w-full">
                Practice Questions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
