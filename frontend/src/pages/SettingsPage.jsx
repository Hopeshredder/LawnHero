import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { logoutUser } from "../Api";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Settings() {
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { logout } = useAuth();

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

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 flex flex-col items-center justify-center">
      <Button
        onClick={handleLogout}
        variant="contained"
        sx={{
          backgroundColor: "#a14525",
          "&:hover": { backgroundColor: "#c65b3b" },
        }}
      >
        LOGOUT
      </Button>
      <h1>
        SETTINGS PAGE Pull profile info have a form where you can update info
        and send it to backend to persist
      </h1>
    </div>
  );
}
