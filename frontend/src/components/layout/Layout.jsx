import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, X, Bell, Sun, Moon, Search, User } from "lucide-react";
import Sidebar from "./Sidebar";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";
export default function Layout({ userRole }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { notifications, isDarkMode, toggleDarkMode } = useAppContext();
  const [user, setUser] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    async function loadData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/getProfile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(response.data.profile);
        console.log(response.data.profile);
      } catch (error) {
        console.log(error);
      }
    }
    loadData();
  }, []);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button
                onClick={toggleSidebar}
                className="px-2 rounded-md text-gray-500 lg:hidden focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-semibold text-primary-600">
                  SmartCheck AI
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSearch}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <Search size={20} />
              </button>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <div className="relative">
                <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <Bell size={20} />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center space-x-2">
                {user ? (
                  <button
                    onClick={() => navigate(`/${user.role}/profile`)}
                    className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2"
                  >
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={user.avatar}
                      alt={user.name}
                    />
                    <span className="hidden md:block text-sm font-medium">
                      {user.name}
                    </span>
                  </button>
                ) : (
                  <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                    <User size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-25 flex items-start justify-center pt-16 px-4 animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-4 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Search</h3>
              <button onClick={toggleSearch} className="text-gray-500">
                <X size={20} />
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder={`Search ${
                  user.role === "teacher"
                    ? "students, assignments..."
                    : "assignments, feedback..."
                }`}
                className="form-input pl-10"
                autoFocus
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userRole={userRole}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
