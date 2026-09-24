import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
                <Link
                    to="/"
                    className="navbar-logo"
                    onClick={closeMenu}
                >
                    Recipe<span>Hub</span>
                </Link>


                {/* Desktop / Mobile Navigation */}
                <div className={`nav-menu ${menuOpen ? "active" : ""}`}>

                    <Link
                        to="/"
                        className="nav-link"
                        onClick={closeMenu}
                    >
                        Home
                    </Link>

                    <Link
                        to="/recipes"
                        className="nav-link"
                        onClick={closeMenu}
                    >
                        Recipes
                    </Link>

                    {isLoggedIn && (
                        <>
                            <Link
                                to="/favorites"
                                className="nav-link"
                                onClick={closeMenu}
                            >
                                Favorites
                            </Link>

                            <Link
                                to="/collections"
                                className="nav-link"
                                onClick={closeMenu}
                            >
                                Collections
                            </Link>

                            <Link
                                to="/feed"
                                className="nav-link"
                                onClick={closeMenu}
                            >
                                Feed
                            </Link>

                            <Link
                                to="/recipes/create"
                                className="nav-link create-link"
                                onClick={closeMenu}
                            >
                                + Create Recipe
                            </Link>
                        </>
                    )}

                    {/* Mobile auth section */}
                    <div className="mobile-auth">

                        {isLoggedIn ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="nav-link"
                                    onClick={closeMenu}
                                >
                                    Profile
                                </Link>

                                {user?.role === "ADMIN" && (
                                    <Link
                                        to="/admin"
                                        className="nav-link"
                                        onClick={closeMenu}
                                    >
                                        Admin
                                    </Link>
                                )}

                                <button
                                    className="logout-btn"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="nav-link"
                                    onClick={closeMenu}
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="register-btn"
                                    onClick={closeMenu}
                                >
                                    Register
                                </Link>
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
                                <Link
                                    to="/profile"
                                    className="profile-btn"
                                >
                                    👤
                                </Link>

                                {user?.role === "ADMIN" && (
                                    <Link
                                        to="/admin"
                                        className="admin-btn"
                                    >
                                        Admin
                                    </Link>
                                )}

                                <button
                                    className="logout-btn"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="login-btn"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="register-btn"
                                >
                                    Register
                                </Link>
                            </>
                        )}

                    </div>


                    {/* Hamburger */}
                    <button
                        className="hamburger"
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