import { createBrowserRouter } from "react-router-dom";

import './App.css';
import PublicNav from './components/PublicNav';
import NotFound from './pages/NotFoundPage';
import Landing from './pages/LandingPage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';

import PrivateNav from './components/PrivateNav';
import Todo from './pages/TodoPage';
import SuperTips from './pages/SuperTipsPage';
import Dashboard from './pages/DashboardPage';
import Settings from './pages/SettingsPage';

const router = createBrowserRouter([
  // Public routes (no login required)
  {
    path: "/",
    element: <PublicNav />,
    children: [
      { index: true, element: <Landing /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },

  // Private routes (login required) NEED TO ADD AUTH WRAPPER
  {
    path: "/",
    element: <PrivateNav />,
    children: [
      { path: "todo", element: <Todo /> }, 
      { path: "supertips", element: <SuperTips /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "settings", element: <Settings /> },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

export default router;