import { Outlet, Link, useLocation } from "react-router-dom";
import Logo from "../assets/images/logo-trans.png";
import { Box, Tabs, Tab } from "@mui/material";
import { useState, useEffect } from "react";

export default function PrivateNav() {
  const location = useLocation();

  const routes = ["/todo", "/supertips", "/dashboard", "/settings"];
  const currentIndex = routes.indexOf(location.pathname);

  const [value, setValue] = useState(currentIndex === -1 ? 0 : currentIndex);

  useEffect(() => {
    setValue(currentIndex === -1 ? 0 : currentIndex);
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-lightest)" }}
    >
      {/* Navbar */}
      <nav
        className="p-2 relative flex items-center"
        style={{ backgroundColor: "var(--color-darkest)" }}
      >
        {/* Logo absolutely positioned on the left */}
        {/* <Link to="/" className="absolute left-4">
          <img
            src={Logo}
            alt="LawnHero Logo"
            className="h-10 w-auto"
            style={{ maxWidth: "120px" }}
          />
        </Link> */}

        <Box sx={{ margin: "0 auto" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{
              style: { backgroundColor: "var(--color-medium)" },
            }}
          >
            {routes.map((path, idx) => (
              <Tab
                key={path}
                label={
                  path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)
                }
                component={Link}
                to={path}
                sx={{
                  color: "var(--color-head-light)",
                  minWidth: 60,
                  fontSize: { xs: "0.75rem", sm: "1rem" },
                  "&.Mui-selected": {
                    color: "var(--color-head)",
                    fontWeight: "bold",
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>
      </nav>

      {/* Page content */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
