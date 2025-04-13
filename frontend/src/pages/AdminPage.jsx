import React, { useState, useEffect } from "react";
import { FiUsers, FiFlag, FiSearch, FiMenu, FiX, FiAlertTriangle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL

const AdminPage = () => {
  const [activeModule, setActiveModule] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAuthorization = async () => {
      try {
        const response = await fetch(`${API_URL}/user/currentuser`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          return;
        }

        const userData = await response.json();
        const role = userData.role;

        if (role === "admin" || role === "developer") {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkUserAuthorization();
  }, []);

  const handleModuleSelect = (module) => {
    setActiveModule(module);
    
    switch(module) {
      case "users":
        navigate("/acp/users");
        break;
      case "reports":
        navigate("/acp/reports");
        break;
      case "search":
        navigate("/forum/search");
        break;
      default:
        break;
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md max-w-md">
          <h2 className="text-lg font-medium mb-2">Error</h2>
          <p>{error}</p>
          <p className="mt-2">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md max-w-md text-center">
          <FiAlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="mb-4">You are not authorized to access this page.</p>
          <button 
            onClick={() => navigate("/")} 
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Go Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {/* Mobile menu button */}
          <div className="md:hidden mb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
            <button 
              onClick={toggleMobileMenu} 
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? 
                <FiX className="h-6 w-6" /> : 
                <FiMenu className="h-6 w-6" />
              }
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className={`${
              isMobileMenuOpen ? "block" : "hidden"
            } md:block md:w-64 bg-white shadow rounded-lg p-4`}>
              <nav className="space-y-2">
                <button
                  onClick={() => handleModuleSelect("users")}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-md ${
                    activeModule === "users"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FiUsers className="mr-3 h-5 w-5" />
                  <span className="font-medium">Manage Users</span>
                </button>

                <button
                  onClick={() => handleModuleSelect("reports")}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-md ${
                    activeModule === "reports"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FiFlag className="mr-3 h-5 w-5" />
                  <span className="font-medium">Manage Reports</span>
                </button>

                <button
                  onClick={() => handleModuleSelect("search")}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-md ${
                    activeModule === "search"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FiSearch className="mr-3 h-5 w-5" />
                  <span className="font-medium">Advanced Search</span>
                </button>
              </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 bg-white shadow rounded-lg p-6">
              {!activeModule && (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-4">Welcome to Admin Control Panel</h2>
                  <p className="text-gray-500 mb-6">Select a module from the sidebar to get started</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div 
                      onClick={() => handleModuleSelect("users")}
                      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex justify-center mb-4">
                        <FiUsers className="h-10 w-10 text-indigo-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Manage Users</h3>
                      <p className="text-gray-500 text-sm">View and manage user accounts, ban or unban users</p>
                    </div>
                    
                    <div 
                      onClick={() => handleModuleSelect("reports")}
                      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex justify-center mb-4">
                        <FiFlag className="h-10 w-10 text-red-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Manage Reports</h3>
                      <p className="text-gray-500 text-sm">Review and handle user reports and complaints</p>
                    </div>
                    
                    <div 
                      onClick={() => handleModuleSelect("search")}
                      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex justify-center mb-4">
                        <FiSearch className="h-10 w-10 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Search</h3>
                      <p className="text-gray-500 text-sm">Use powerful search tools to find specific information</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeModule === "users" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Users</h2>
                  <p className="text-gray-500 mb-4">Loading user management module...</p>
                </div>
              )}
              
              {activeModule === "reports" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Reports</h2>
                  <p className="text-gray-500 mb-4">Loading reports management module...</p>
                </div>
              )}
              
              {activeModule === "search" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Advanced Search</h2>
                  <p className="text-gray-500 mb-4">Loading search module...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;