import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { logoutUser, getUserInfo } from "../Api";
import { useState, useEffect } from "react";

export default function Settings() {
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const data = await getUserInfo();
        setUserInfo(data);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            JSON.stringify(err.response?.data) ||
            "Failed to load user information"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    setError("");
    try {
      await logoutUser();
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          "Logout failed"
      );
    }
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 min-h-screen py-8">
      <h1 className="text-2xl font-bold text-center mb-8">Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 border">
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

            {loading ? (
              <div className="text-center text-gray-500">
                Loading user information...
              </div>
            ) : userInfo ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b" id='emailDiv'>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="text-gray-900">{userInfo.email}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b" id='accountTypeDiv'>
                  <span className="font-medium text-gray-700">
                    Account Type:
                  </span>
                  <span className="text-gray-900">
                    {userInfo.is_super ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                        Administrator
                      </span>
                    ) : (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        User
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                No user information available
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Button
              onClick={handleLogout}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#a14525",
                "&:hover": { backgroundColor: "#c65b3b" },
                py: 1.5,
              }}>
              LOGOUT
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <p className="text-gray-500">Lawn Care Ratios</p>
            <div>
              <ul>
                <li>Twice</li>
                <li>Thrice</li>
                <li>Four times</li>
                <li>Five times</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
