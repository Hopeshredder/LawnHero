import { Link } from "react-router-dom";
import Logo from "../assets/images/logo-trans.png";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        backgroundColor: "var(--color-lightest)",
        color: "var(--color-lightest)",
      }}>
      <img
        src={Logo}
        alt="LawnHero Logo"
        className="h-48 w-auto mb-6 opacity-40 animate-pulse"
      />

      <h1
        className="text-5xl font-extrabold mb-4 text-center"
        style={{ color: "var(--color-medium)" }}>
        404 - Page Not Found
      </h1>

      <p
        className="mb-8 text-center max-w-md"
        style={{ color: "var(--color-light)" }}>
        Sorry, the page you are looking for does not exist. Go back to the
        homepage to continue exploring LawnHero.
      </p>

      <Link
        to="/"
        className="px-6 py-3 rounded-md font-semibold transition duration-200"
        style={{
          backgroundColor: "var(--color-medium)",
          color: "var(--color-lightest)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--color-dark)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--color-medium)")
        }>
        Go Back Home
      </Link>
    </div>
  );
}
