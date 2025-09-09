import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { logoutUser, getUserInfo, updateUserInfo } from "../Api";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Settings() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const data = await getUserInfo();
        setUserInfo(data);
        setNewEmail(data.email);
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
      await logout();
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          "Logout failed"
      );
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword) {
      setError("Current password is required");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    const hasEmailChange = newEmail && newEmail !== userInfo?.email;
    const hasPasswordChange = newPassword && newPassword.length > 0;

    if (!hasEmailChange && !hasPasswordChange) {
      setError("No changes to update");
      return;
    }

    setIsUpdating(true);

    try {
      const payload = { current_password: currentPassword };

      if (hasEmailChange) {
        payload.new_email = newEmail;
      }

      if (hasPasswordChange) {
        payload.new_password = newPassword;
      }

      const response = await updateUserInfo(payload);

      if (response.email) {
        setUserInfo({
          email: response.email,
          is_super: response.is_super,
        });
        setSuccess("Profile updated successfully!");

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        (err.response?.data
          ? JSON.stringify(err.response.data)
          : "Update failed");
      setError(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-24 min-h-screen pt-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Settings</h1>
      <div className="flex justify-center w-full">
        <div className="space-y-6 max-w-lg w-full">
          <div className="bg-white rounded-lg shadow-md p-6 border">
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

            {loading ? (
              <div className="text-center text-gray-500">
                Loading user information...
              </div>
            ) : userInfo ? (
              <div className="space-y-3">
                <div
                  className="flex justify-between items-center py-2 border-b"
                  id="emailDiv"
                >
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="text-gray-900">{userInfo.email}</span>
                </div>
                <div
                  className="flex justify-between items-center py-2 border-b"
                  id="accountTypeDiv"
                >
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

          <div className="bg-white rounded-lg shadow-md p-6 border">
            <h2 className="text-lg font-semibold mb-4">Update Profile</h2>

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            {error && !success && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Leave blank to keep current password"
                />
              </div>

              {newPassword && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleLogout}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#a14525",
                "&:hover": { backgroundColor: "#c65b3b" },
                py: 1.5,
              }}
            >
              LOGOUT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
