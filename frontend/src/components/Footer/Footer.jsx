import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {

    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">

            <div className="footer-container">

                <div className="footer-brand">

                    <Link to="/" className="footer-logo">
                        Recipe<span>Hub</span>
                    </Link>

                    <p>
                        Discover, create and share delicious recipes
                        with a community of food lovers.
                    </p>

                </div>


                <div className="footer-links">

                    <div className="footer-column">

                        <h3>Explore</h3>

                        <Link to="/">
                            Home
                        </Link>

                        <Link to="/recipes">
                            Recipes
                        </Link>

                        <Link to="/feed">
                            Community
                        </Link>

                    </div>


                    <div className="footer-column">

                        <h3>Account</h3>

                        <Link to="/profile">
                            Profile
                        </Link>

                        <Link to="/favorites">
                            Favorites
                        </Link>

                        <Link to="/collections">
                            Collections
                        </Link>

                    </div>

                </div>

            </div>


            <div className="footer-bottom">

                <p>
                    © {currentYear} RecipeHub. All rights reserved.
                </p>

            </div>

        </footer>
    );
};

export default Footer;