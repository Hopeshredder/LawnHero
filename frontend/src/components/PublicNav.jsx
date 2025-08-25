import { Outlet, Link } from "react-router-dom";

// PublicLayout is a layout wrapper for pages accessible without authentication, providdes nav bar functionality
export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Navbar */}
      <nav className="bg-blue-800 text-white p-4 flex justify-center space-x-4">
        <Link to="/" className="hover:text-gray-300">Home </Link>
        <Link to="/login" className="hover:text-gray-300">Login </Link>
        <Link to="/register" className="hover:text-gray-300">Register</Link>
      </nav>

      {/* Page content */}
      <main className="p-0">
        <Outlet />
      </main>

      {/* Optional Footer */}
      {/* <footer className="text-center mt-10 text-gray-500">
        &copy; {new Date().getFullYear()} LawnHero
      </footer> */}
    </div>
  );
}