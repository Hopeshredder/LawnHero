import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { logoutUser } from "../Api";
import { useState } from "react";

export default function Settings() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    setError("");
    try {
      await logoutUser();
      console.log("Logged out");
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          "Loout failed"
      );
    } finally {
      console.log("Logging out:");
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
