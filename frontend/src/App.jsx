import './App.css'
import { createBrowserRouter } from "react-router-dom";
import NotFound from './pages/NotFoundPage';
import Landing from './pages/LandingPage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import PublicNav from './components/PublicNav';

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

  { path: "*", element: <NotFound /> },
]);

export default router;