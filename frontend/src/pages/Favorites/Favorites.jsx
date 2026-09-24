import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import RecipeCard from "../../components/RecipeCard/RecipeCard";
import Loader from "../../components/Loader/Loader";

import {
  getFavorites,
  removeFavorite
} from "../../services/socialService";

import "./Favorites.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getFavorites();

      setFavorites(
        response.favorites ||
          response.data ||
          []
      );
    } catch (error) {
      console.error("Favorites fetch error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load your favorite recipes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const getFavoriteRecipe = favorite => {
    return (
      favorite.recipe ||
      favorite.Recipe ||
      favorite
    );
  };

  const handleRemoveFavorite = async recipeId => {
    try {
      await removeFavorite(recipeId);

      setFavorites(previous =>
        previous.filter(favorite => {
          const recipe = getFavoriteRecipe(favorite);

          return Number(recipe.id) !== Number(recipeId);
        })
      );
    } catch (error) {
      console.error("Remove favorite error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to remove recipe from favorites."
      );
    }
  };

  if (loading) {
    return (
      <div className="favorites-page">
        <Loader text="Loading favorites..." />
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-container">

        <div className="favorites-header">
          <div>
            <span className="favorites-badge">
              Your Saved Recipes
            </span>

            <h1>Favorite Recipes</h1>

            <p>
              Keep your favorite recipes in one place
              and access them whenever you want.
            </p>
          </div>

          <div className="favorites-count">
            <strong>{favorites.length}</strong>
            <span>Saved</span>
          </div>
        </div>

        {error && (
          <div className="favorites-error">
            {error}
          </div>
        )}

        {favorites.length === 0 ? (
          <div className="favorites-empty">

            <div className="empty-icon">♡</div>

            <h2>No Favorite Recipes</h2>

            <p>
              You haven't saved any recipes yet.
              Explore recipes and add your favorites here.
            </p>

            <Link
              to="/"
              className="browse-recipes-btn"
            >
              Browse Recipes
            </Link>

          </div>
        ) : (
          <div className="favorites-grid">

            {favorites.map((favorite, index) => {
              const recipe = getFavoriteRecipe(favorite);

              if (!recipe?.id) return null;

              return (
                <RecipeCard
                  key={favorite.id || recipe.id || index}
                  recipe={recipe}
                  isFavorite={true}
                  onFavorite={handleRemoveFavorite}
                />
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default Favorites;