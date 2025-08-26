import "./App.css";

import { useState } from "react";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    try {
      const user = await registerUser(email, password, name);
      console.log("Registered user:", user);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          "Registration failed"
      );
    } finally {
      console.log("Registering:", { email, password, name });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#DAD7CD] text-[#344E41]">
      <h1 className="text-[#3A5A40] text-2xl mb-4">Register</h1>
      <div className="mb-4 w-64">
        <label htmlFor="email" className="block mb-1 text-[#588157]">
          Email
        </label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-[#A3B18A] bg-[#A3B18A] text-[#344E41]"
        />
      </div>
      <div className="mb-4 w-64">
        <label htmlFor="password" className="block mb-1 text-[#588157]">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-[#A3B18A] bg-[#A3B18A] text-[#344E41]"
        />
      </div>
      <div>
        <label htmlFor="name">Full Name</label>
        <input
          type="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-[#A3B18A] bg-[#A3B18A] text-[#344E41]"
        />
      </div>
      <button
        onClick={handleRegister}
        className="px-4 py-2 bg-[#3A5A40] text-[#DAD7CD] cursor-pointer">
        Register
      </button>
    </div>
  );
};

export default App;
