import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./contexts/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={App} />
  </AuthProvider>
);
