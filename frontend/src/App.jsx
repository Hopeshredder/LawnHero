import { createBrowserRouter } from "react-router-dom";

import "./App.css";
import PublicRoute from "./components/PublicRoute";
import PublicNav from "./components/PublicNav";
import NotFound from "./pages/NotFoundPage";
import Landing from "./pages/LandingPage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";

import ProtectedRoute from "./components/ProtectedRoute";
import PrivateNav from "./components/PrivateNav";
import Todo from "./pages/TodoPage";
import SuperTips from "./pages/SuperTipsPage";
import Dashboard from "./pages/DashboardPage";
import Settings from "./pages/SettingsPage";

const router = createBrowserRouter([
  // Public routes (no auth required)
  {
    path: "/",
    element: <PublicRoute />,
    children: [
      {
        element: <PublicNav />,
        children: [
          { index: true, element: <Landing /> },
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
        ],
      },
    ],
  },

  // Private routes (auth required)
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <PrivateNav />,
        children: [
          { path: "todo", element: <Todo /> },
          { path: "supertips", element: <SuperTips /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "settings", element: <Settings /> },
        ],
      },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

export default router;
