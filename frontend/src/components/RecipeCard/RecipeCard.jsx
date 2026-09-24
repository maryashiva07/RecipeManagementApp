import { Link } from "react-router-dom";
import "./RecipeCard.css";

const RecipeCard = ({
    recipe,
    onFavorite,
    isFavorite = false
}) => {

    if (!recipe) {
        return null;
    }

    // const imageUrl = recipe.image
    //     ? `http://localhost:5000/${recipe.image}`
    //     : null;

    const imageUrl = recipe.image
         ? `http://localhost:5000/${recipe.image.replace(/^\/+/, "")}`
         : null;

    return (
        <article className="recipe-card">

            <div className="recipe-image-wrapper">

                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={recipe.title}
                        className="recipe-image"
                    />
                ) : (
                    <div className="recipe-placeholder">
                        🍲
                    </div>
                )}

                {onFavorite && (
                    <button
                        className={`favorite-btn ${
                            isFavorite ? "active" : ""
                        }`}
                        onClick={() => onFavorite(recipe.id)}
                        aria-label="Favorite recipe"
                    >
                        {isFavorite ? "❤️" : "♡"}
                    </button>
                )}

            </div>


            <div className="recipe-content">

                <div className="recipe-category">
                    {recipe.category || "Recipe"}
                </div>

                <Link
                    to={`/recipes/${recipe.id}`}
                    className="recipe-title"
                >
                    {recipe.title}
                </Link>

                <p className="recipe-description">
                    {recipe.description
                        ? recipe.description.length > 100
                            ? `${recipe.description.substring(0, 100)}...`
                            : recipe.description
                        : "A delicious recipe waiting to be discovered."
                    }
                </p>


                <div className="recipe-meta">

                    <span>
                        ⏱️ {recipe.cookingTime || 0} min
                    </span>

                    <span>
                        👥 {recipe.servings || 0}
                    </span>

                    {recipe.difficulty && (
                        <span>
                            {recipe.difficulty}
                        </span>
                    )}

                </div>

            </div>

        </article>
    );
};

export default RecipeCard;