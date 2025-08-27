import { useState } from "react";
import { loginUser } from "../Api";
import Logo from "../assets/images/logo-trans.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const user = await loginUser(email, password);
      console.log("Logged in user:", user);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          "Login failed"
      );
    } finally {
      console.log("Logging in:", { email, password });
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-start min-h-screen pt-0 px-4"
      style={{
        backgroundColor: "var(--color-lightest)",
        color: "var(--color-darkest)",
      }}
    >
      <img
        src={Logo}
        alt="LawnHero Logo"
        className="mx-auto mb-6 h-40 w-auto"
      />
      <h1
        className="text-5xl font-extrabold mb-8"
        style={{ color: "var(--color-medium)" }}
      >
        Login
      </h1>

      {error && <p className="mb-4 text-red-600 font-medium">{error}</p>}

      <div className="flex flex-col space-y-4 w-full max-w-sm">
        <div>
          <label
            htmlFor="email"
            className="block mb-1 font-medium"
            style={{ color: "var(--color-dark)" }}
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded border border-var(--color-medium) bg-var(--color-light) text-var(--color-darkest) focus:outline-none focus:ring-2 focus:ring-var(--color-medium)"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-1 font-medium"
            style={{ color: "var(--color-dark)" }}
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded border border-var(--color-medium) bg-var(--color-light) text-var(--color-darkest) focus:outline-none focus:ring-2 focus:ring-var(--color-medium)"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-3 mt-2 rounded font-semibold transition duration-200"
          style={{
            backgroundColor: "var(--color-medium)",
            color: "var(--color-lightest)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--color-dark)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--color-medium)")
          }
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
