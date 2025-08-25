import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center text-center text-white px-4">
      <div>
        <h1 className="text-5xl font-extrabold mb-6">Welcome to LawnHero</h1>
        <p className="text-xl text-gray-300 mb-8">
          A Website for lawn-owners who want a healthy yard but don’t know what their lawn actually needs, the LawnHero App is a smart landscaping assistant that helps homeowners monitor, track, and improve their lawn’s health with personalised, actionable guidance. 
        </p>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
