import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";

// PrivateRoute component to protect routes
function PrivateRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/analytics/:id" element={<Analytics />} />
        <Route path="/login" element={<Login />} />
        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
