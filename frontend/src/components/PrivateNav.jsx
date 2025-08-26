import { Outlet, Link, useLocation } from "react-router-dom";
import Logo from "../assets/images/logo.png";

// PrivateNav is a layout wrapper for pages accessible WITH authentication, provides nav bar functionality
export default function PrivateNav() {
  const location = useLocation();

  const isTodo = location.pathname === "/todo";
  const isSuperTips = location.pathname === "/supertips";
  const isDashboard = location.pathname === "/dashboard";
  const isSettings = location.pathname === "/settings";

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
          {!isTodo && (
            <Link
              to="/todo"
              className="px-3 py-1 rounded-md transition duration-200"
              style={{ color: "var(--color-lightest)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-medium)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-lightest)")
              }
            >
              Todo
            </Link>
          )}

          {!isSuperTips && (
            <Link
              to="/supertips"
              className="px-3 py-1 rounded-md transition duration-200"
              style={{ color: "var(--color-lightest)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-medium)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-lightest)")
              }
            >
              Super Tips
            </Link>
          )}

          {!isDashboard && (
            <Link
              to="/dashboard"
              className="px-3 py-1 rounded-md transition duration-200"
              style={{ color: "var(--color-lightest)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-medium)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-lightest)")
              }
            >
              Dashboard
            </Link>
          )}

          {!isSettings && (
            <Link
              to="/settings"
              className="px-3 py-1 rounded-md transition duration-200"
              style={{ color: "var(--color-lightest)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-medium)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-lightest)")
              }
            >
              Settings
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
