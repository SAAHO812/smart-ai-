import { useEffect, useState } from "react";
import { User, Mail, Phone, Book, Calendar, MapPin, Award } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";
export default function TeacherProfile() {
  const { user } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    joinDate: "",
    address: "",
    subjects: [],
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
        setData({
          ...response.data.profile,
          studentCount: response.data.studentCount
        });
      } catch (error) {
        console.log("Error loading profile");
        console.log(error);
      }
    }
    loadProfile();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Teacher Profile</h1>
        <p className="text-gray-600 mt-1">
          View and manage your professional information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Info */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                Professional Information
              </h2>
              {/* <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </button> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    defaultValue={data.name}
                  />
                ) : (
                  <div className="flex items-center">
                    <User size={18} className="text-gray-400 mr-2" />
                    <span>{data.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    className="form-input"
                    defaultValue={data.email}
                  />
                ) : (
                  <div className="flex items-center">
                    <Mail size={18} className="text-gray-400 mr-2" />
                    <span>{data.email}</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    className="form-input"
                    defaultValue={data.phoneNumber}
                  />
                ) : (
                  <div className="flex items-center">
                    <Phone size={18} className="text-gray-400 mr-2" />
                    <span>{data.phoneNumber}</span>
                  </div>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    defaultValue={data.department}
                  />
                ) : (
                  <div className="flex items-center">
                    <Book size={18} className="text-gray-400 mr-2" />
                    <span>{data.department}</span>
                  </div>
                )}
              </div>

              {/* Join Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Join Date
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    className="form-input"
                    defaultValue={data.joinDate}
                  />
                ) : (
                  <div className="flex items-center">
                    <Calendar size={18} className="text-gray-400 mr-2" />
                    <span>{new Date(data.joinDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    defaultValue={data.address}
                  />
                ) : (
                  <div className="flex items-center">
                    <MapPin size={18} className="text-gray-400 mr-2" />
                    <span>{data.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Education & Certifications */}
          {/* <div className="card p-6 mt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Education & Certifications
            </h2>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Education
              </h3>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="flex items-start">
                    <Award size={18} className="text-primary-500 mt-1 mr-2" />
                    <div>
                      <div className="font-medium">{edu.degree}</div>
                      <div className="text-sm text-gray-500">
                        {edu.institution} • {edu.year}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Certifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div> */}
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
            <p className="text-gray-500 text-sm">{data.department}</p>

            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-primary-600">{data.studentCount || 0}</div>
                  <div className="text-sm text-gray-500">No. of Students</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">24</div>
                  <div className="text-sm text-gray-500">Classes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div className="card p-6 mt-6">
            <h3 className="font-medium text-gray-900 mb-3">
              Teaching Subjects
            </h3>
            <div className="space-y-2">
              {data.subjects.map((subject, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                >
                  <span className="font-medium">{subject}</span>
                  <span className="text-sm text-gray-500">Advanced</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6 mt-6">
            <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="btn btn-primary w-full">
                Create Assignment
              </button>
              <button className="btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 w-full">
                View Submissions
              </button>
              <button className="btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 w-full">
                Generate Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
