import { useState } from "react";
import { Link } from "react-router-dom";
import "./RecipeCard.css";

// Backend URL from .env
const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
).replace(/\/+$/, "");

// Convert relative image paths into full URLs
const getImageUrl = (image) => {
  if (!image || typeof image !== "string") return null;

  const imagePath = image.trim();

  if (!imagePath) return null;

 
  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  return `${BACKEND_URL}/${imagePath.replace(/^\/+/, "")}`;
};

const RecipeCard = ({ recipe, onFavorite, isFavorite = false }) => {
  const [imageError, setImageError] = useState(false);

  if (!recipe) {
    return null;
  }

  const imageUrl = getImageUrl(recipe.image);

  return (
    <article className="recipe-card">
      <div className="recipe-image-wrapper">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={recipe.title || "Recipe"}
            className="recipe-image"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="recipe-placeholder">🍲</div>
        )}

        {onFavorite && (
          <button
            type="button"
            className={`favorite-btn ${isFavorite ? "active" : ""}`}
            onClick={() => onFavorite(recipe.id)}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            aria-pressed={isFavorite}
          >
            {isFavorite ? "❤️" : "♡"}
          </button>
        )}
      </div>

      <div className="recipe-content">
        <div className="recipe-category">{recipe.category || "Recipe"}</div>

        <Link to={`/recipes/${recipe.id}`} className="recipe-title">
          {recipe.title || "Untitled Recipe"}
        </Link>

        <p className="recipe-description">
          {recipe.description
            ? recipe.description.length > 100
              ? `${recipe.description.substring(0, 100)}...`
              : recipe.description
            : "A delicious recipe waiting to be discovered."}
        </p>

        <div className="recipe-meta">
          <span>⏱️ {recipe.cookingTime || 0} min</span>

          <span>👥 {recipe.servings || 0}</span>

          {recipe.difficulty && <span>{recipe.difficulty}</span>}
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;
