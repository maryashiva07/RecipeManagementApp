import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMenuOpen(false);

    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          Recipe<span>Hub</span>
        </Link>

        {/* Desktop / Mobile Navigation */}
        <div className={`nav-menu ${menuOpen ? "active" : ""}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <NavLink
            to="/recipes"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={closeMenu}
          >
            Recipes
          </NavLink>

          {isLoggedIn && (
            <>
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                onClick={closeMenu}
              >
                Favorites
              </NavLink>

              <NavLink
                to="/collections"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                onClick={closeMenu}
              >
                Collections
              </NavLink>

              <NavLink
                to="/feed"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                onClick={closeMenu}
              >
                Feed
              </NavLink>

              <NavLink
                to="/recipes/create"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link create-link active"
                    : "nav-link create-link"
                }
                onClick={closeMenu}
              >
                + Create Recipe
              </NavLink>
            </>
          )}

          {/* Mobile auth section */}
          <div className="mobile-auth">
            {isLoggedIn ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  onClick={closeMenu}
                >
                  Profile
                </NavLink>

                {user?.role === "ADMIN" && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    onClick={closeMenu}
                  >
                    Admin
                  </NavLink>
                )}

                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  onClick={closeMenu}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? "register-btn active" : "register-btn"
                  }
                  onClick={closeMenu}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="navbar-actions">
          {/* Theme Toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          {/* Desktop Profile / Auth */}
          <div className="desktop-auth">
            {isLoggedIn ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive ? "profile-btn active" : "profile-btn"
                  }
                >
                  👤
                </NavLink>

                {user?.role === "ADMIN" && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      isActive ? "admin-btn active" : "admin-btn"
                    }
                  >
                    Admin
                  </NavLink>
                )}

                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? "login-btn active" : "login-btn"
                  }
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? "register-btn active" : "register-btn"
                  }
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`hamburger ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
