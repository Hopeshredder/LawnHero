import { Link } from "react-router-dom";
import Logo from "../assets/images/logo-trans.png";

export default function Landing() {
  return (
    <div
      className="min-h-screen flex flex-col justify-start items-center text-center px-4 pt-16"
      style={{
        backgroundColor: "var(--color-lightest)",
        color: "var(--color-darkest)",
      }}
    >
      <div>
        <img
          src={Logo}
          alt="LawnHero Logo"
          className="mx-auto mb-6 h-40 w-auto"
        />
        <h1
          className="text-5xl font-extrabold mb-6"
          style={{ color: "var(--color-medium)" }}
        >
          Welcome to LawnHero
        </h1>

        <p className="text-xl mb-8" style={{ color: "var(--color-dark)" }}>
          A website for lawn-owners who want a healthy yard but don’t know what
          their lawn actually needs, the LawnHero App is a smart landscaping
          assistant that helps homeowners monitor, track, and improve their
          lawn’s health with personalised, actionable guidance.
        </p>

        <Link
          to="/login"
          className="px-6 py-3 rounded-md transition duration-200"
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
          Get Started
        </Link>
      </div>
    </div>
  );
}
