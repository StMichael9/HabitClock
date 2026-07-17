import { NavLink } from "react-router-dom";
import useAuth from "../auth/useAuth";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/habits", label: "Habits" },
  { to: "/sessions", label: "Sessions" },
  { to: "/goals", label: "Goals" },
];

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo">HabitClock</span>
        <p className="navbar__tagline">
          Track habits, sessions, and progress in one place.
        </p>
      </div>

      <nav className="navbar__links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `navbar__link${isActive ? " navbar__link--active" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="navbar__actions">
        <span className="navbar__user">{user?.username}</span>
        <button className="navbar__logout" onClick={logout} type="button">
          Logout
        </button>
      </div>
    </header>
  );
}
