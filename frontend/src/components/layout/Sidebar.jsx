import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileSearch,
  FileCheck,
  BarChart2,
  HelpCircle,
  FileText,
  Settings,
  LogOut,
  User,
  BookOpen,
  MessageSquare,
  Brain,
} from "lucide-react";

const teacherNavItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/teacher/dashboard",
  },
  {
    id: "profile",
    label: "Profile",
    icon: <User size={20} />,
    path: "/teacher/profile",
  },
  {
    id: "plagiarism",
    label: "Plagiarism Check",
    icon: <FileSearch size={20} />,
    path: "/teacher/plagiarism",
  },
  {
    id: "evaluation",
    label: "Answer Evaluation",
    icon: <FileCheck size={20} />,
    path: "/teacher/evaluation",
  },
  {
    id: "feedback",
    label: "Feedback Analysis",
    icon: <BarChart2 size={20} />,
    path: "/teacher/feedback",
  },
  {
    id: "questions",
    label: "Question Generator",
    icon: <FileText size={20} />,
    path: "/teacher/questions",
  },
];

const studentNavItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/student/dashboard",
  },
  {
    id: "profile",
    label: "Profile",
    icon: <User size={20} />,
    path: "/student/profile",
  },
  {
    id: "assignments",
    label: "Assignments",
    icon: <BookOpen size={20} />,
    path: "/student/assignments",
  },
  {
    id: "feedback",
    label: "Feedback",
    icon: <MessageSquare size={20} />,
    path: "/student/feedback",
  },
  {
    id: "practice",
    label: "Practice",
    icon: <Brain size={20} />,
    path: "/student/practice",
  },
];

const bottomNavItems = [
  { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  { id: "help", label: "Help & Support", icon: <HelpCircle size={20} /> },
  { id: "logout", label: "Log Out", icon: <LogOut size={20} /> },
];

export default function Sidebar({ isOpen, onClose, userRole }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = userRole === "teacher" ? teacherNavItems : studentNavItems;

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-auto lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-center border-b">
            <h1 className="text-xl font-bold text-primary-600">
              SmartCheck AI
            </h1>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span
                  className={`mr-3 ${
                    location.pathname === item.path
                      ? "text-primary-600"
                      : "text-gray-500"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t">
            <div className="space-y-1">
              {bottomNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "logout") {
                      localStorage.removeItem("token"); // or sessionStorage, based on your implementation
                      navigate("/");
                    }
                  }}
                  className="w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                >
                  <span className="mr-3 text-gray-500">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
