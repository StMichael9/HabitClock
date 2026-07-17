import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";

import Login from "../pages/Login";
import SignUp from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Habits from "../pages/Habits";
import Sessions from "../pages/Sessions";
import Goals from "../pages/Goals";

import ProtectedRoute from "../auth/ProtectedRoute";
import useAuth from "../auth/useAuth";
import Navbar from "../Components/Navbar";

function ProtectedLayout() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="app-shell">
        <Navbar user={user} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
