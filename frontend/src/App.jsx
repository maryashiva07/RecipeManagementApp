import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import RecipeDetails from "./pages/RecipeDetails/RecipeDetails";
import CreateRecipe from "./pages/CreateRecipe/CreateRecipe";
import EditRecipe from "./pages/EditRecipe/EditRecipe";
import Favorites from "./pages/Favorites/Favorites";
import Collections from "./pages/Collections/Collections";
import Feed from "./pages/Feed/Feed";
import Admin from "./pages/Admin/Admin";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import "./App.css";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(previous => !previous);
  };

  return (
    <BrowserRouter>
      <div className="app">

        <Navbar
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />

        <main className="main-content">

          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Home />} />

            <Route path="/recipes" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route
              path="/recipes/:id"
              element={<RecipeDetails />}
            />


            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>

              <Route
                path="/profile"
                element={<Profile />}
              />

              <Route
                path="/recipes/create"
                element={<CreateRecipe />}
              />

              <Route
                path="/recipes/edit/:id"
                element={<EditRecipe />}
              />

              <Route
                path="/favorites"
                element={<Favorites />}
              />

              <Route
                path="/collections"
                element={<Collections />}
              />

              <Route
                path="/feed"
                element={<Feed />}
              />

              <Route
                path="/admin"
                element={<Admin />}
              />

            </Route>

          </Routes>

        </main>

        <Footer />

      </div>
    </BrowserRouter>
  );
};

export default App;
