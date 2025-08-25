import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-5xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-6">Sorry, the page you are looking for does not exist.</p>
      <Link
        to="/"
        className="text-blue-400 hover:text-blue-600 underline"
      >
        Go back to the landing page
      </Link>
    </div>
  );
}
