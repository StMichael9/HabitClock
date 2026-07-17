import { NavLink } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo">HabitClock</span>
        <p className="navbar__tagline">Track habits without the clutter.</p>
      </div>

      <nav className="navbar__links" aria-label="Public navigation">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `navbar__link${isActive ? " navbar__link--active" : ""}`
          }
          end
        >
          Login
        </NavLink>
        <NavLink
          to="/signup"
          className={({ isActive }) =>
            `navbar__link${isActive ? " navbar__link--active" : ""}`
          }
        >
          Sign Up
        </NavLink>
      </nav>
    </header>
  );
}
