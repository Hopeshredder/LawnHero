import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: "var(--color-darkest)", color: "var(--color-lightest)" }}
    >
      <h1
        className="text-5xl font-bold mb-4"
        style={{ color: "var(--color-medium)" }}
      >
        404 - Page Not Found
      </h1>

      <p
        className="mb-6"
        style={{ color: "var(--color-light)" }}
      >
        Sorry, the page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="underline px-2 py-1 transition duration-200"
        style={{ color: "var(--color-light)", textDecorationColor: "var(--color-light)" }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--color-medium)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--color-light)"}
      >
        Go back to the home page
      </Link>
    </div>
  );
}
