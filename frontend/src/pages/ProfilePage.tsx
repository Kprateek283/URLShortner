import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate} from "react-router-dom";

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setUserInfo(response.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Error fetching user info.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [token, navigate]);

  const handleLogout = () => {
    // Clear JWT token and redirect to login
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">Profile</h1>
          <div className="space-x-4">
            <button 
              onClick={() => navigate("/home")} 
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => navigate("/dashboard")} 
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Loading/Error States */}
        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        {error && (
          <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* User Info Card */}
        {userInfo && (
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{userInfo.name}</h2>
                  <p className="text-gray-600">{userInfo.email}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Total URLs</h3>
                  <p className="text-3xl font-bold text-blue-600">{userInfo.urlCount}</p>
                </div>
                {/* Add more stats cards here as needed */}
              </div>

              {/* Account Actions */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Actions</h3>
                <div className="space-y-4">
                  <button
                    onClick={handleLogout}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3zm11 4.414l-4.293 4.293a1 1 0 0 1-1.414 0L4 7.414 5.414 6l3.293 3.293L12 6l2 1.414z" clipRule="evenodd" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
