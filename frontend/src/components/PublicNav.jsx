import { Outlet, Link, useLocation } from "react-router-dom";
import Logo from "../assets/images/logo.png";

// PublicLayout is a layout wrapper for pages accessible without authentication, providdes nav bar functionality
export default function PublicLayout() {
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--color-lightest)",
        color: "var(--color-darkest)",
      }}
    >
      {/* Navbar */}
      <nav
        className="p-4 flex items-center justify-center space-x-4"
        style={{ backgroundColor: "var(--color-darkest)" }}
      >
        {/* Logo on the left */}
        <div className="mr-6">
          <Link to="/">
            <img src={Logo} alt="LawnHero Logo" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Navbar links */}
        <div className="flex space-x-4">
          {!isHome && (
            <Link
              to="/"
              className="px-3 py-1 rounded-md transition duration-200"
              style={{ color: "var(--color-lightest)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-medium)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-lightest)")
              }
            >
              Home
            </Link>
          )}

          {!isLogin && (
            <Link
              to="/login"
              className="px-3 py-1 rounded-md transition duration-200"
              style={{ color: "var(--color-lightest)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-medium)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-lightest)")
              }
            >
              Login
            </Link>
          )}

          {!isRegister && (
            <Link
              to="/register"
              className="px-3 py-1 rounded-md transition duration-200"
              style={{ color: "var(--color-lightest)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-medium)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-lightest)")
              }
            >
              Register
            </Link>
          )}
        </div>
      </nav>

      {/* Page content */}
      <main className="p-0">
        <Outlet />
      </main>

      {/* Optional Footer */}
      {/* <footer className="text-center mt-10" style={{ color: "var(--color-dark)" }}>
        &copy; {new Date().getFullYear()} LawnHero
      </footer> */}
    </div>
  );
}
