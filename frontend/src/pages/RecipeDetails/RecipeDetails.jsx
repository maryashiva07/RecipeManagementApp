// import { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import Loader from "../../components/Loader/Loader";
// import Button from "../../components/Button/Button";
// import RecipeCard from "../../components/RecipeCard/RecipeCard";
// import "./RecipeDetails.css";

// const RecipeDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [recipe, setRecipe] = useState(null);
//   const [reviews, setReviews] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [reviewLoading, setReviewLoading] = useState(false);

//   const [error, setError] = useState("");
//   const [reviewError, setReviewError] = useState("");

//   const [isFavorite, setIsFavorite] = useState(false);

//   const [reviewForm, setReviewForm] = useState({
//     rating: 5,
//     comment: ""
//   });

//   useEffect(() => {
//     const fetchRecipe = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         /*
//           Later we will connect:

//           const data = await getRecipeById(id);

//           setRecipe(data.recipe);
//           setReviews(data.recipe.reviews || []);

//         */

//         console.log("Fetching recipe:", id);

//       } catch (error) {
//         console.error("Recipe details error:", error);

//         setError(
//           error.response?.data?.message ||
//           "Unable to load recipe."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecipe();
//   }, [id]);

//   const handleFavorite = async () => {
//     try {
//       /*
//         Later:

//         if (isFavorite) {
//           await removeFavorite(id);
//         } else {
//           await addFavorite(id);
//         }

//         setIsFavorite(previous => !previous);
//       */

//       setIsFavorite((previous) => !previous);

//     } catch (error) {
//       console.error("Favorite error:", error);
//     }
//   };

//   const handleReviewChange = (event) => {
//     const { name, value } = event.target;

//     setReviewForm((previous) => ({
//       ...previous,
//       [name]: value
//     }));
//   };

//   const handleReviewSubmit = async (event) => {
//     event.preventDefault();

//     setReviewError("");

//     if (!reviewForm.comment.trim()) {
//       setReviewError("Please write a review.");
//       return;
//     }

//     try {
//       setReviewLoading(true);

//       /*
//         Later:

//         const data = await createReview(id, {
//           rating: Number(reviewForm.rating),
//           comment: reviewForm.comment
//         });

//         setReviews(previous => [data.review, ...previous]);

//       */

//       console.log("Review:", {
//         recipeId: id,
//         rating: Number(reviewForm.rating),
//         comment: reviewForm.comment
//       });

//       setReviewForm({
//         rating: 5,
//         comment: ""
//       });

//     } catch (error) {
//       console.error("Review error:", error);

//       setReviewError(
//         error.response?.data?.message ||
//         "Unable to submit review."
//       );
//     } finally {
//       setReviewLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="recipe-details-loading">
//         <Loader text="Loading recipe..." />
//       </div>
//     );
//   }

//   if (error || !recipe) {
//     return (
//       <section className="recipe-details-page">
//         <div className="container">
//           <div className="recipe-details-error">
//             <div className="error-icon">😕</div>

//             <h2>
//               {error || "Recipe not found"}
//             </h2>

//             <p>
//               The recipe you are looking for may have been
//               removed or does not exist.
//             </p>

//             <Button onClick={() => navigate("/")}>
//               Back to Home
//             </Button>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   const imageUrl = recipe.image
//     ? `http://localhost:5000/${recipe.image}`
//     : null;

//   const averageRating = recipe.averageRating || 0;

//   return (
//     <section className="recipe-details-page">

//       <div className="container">

//         {/* Breadcrumb */}

//         <div className="recipe-breadcrumb">
//           <Link to="/">Home</Link>
//           <span>/</span>
//           <span>{recipe.title}</span>
//         </div>

//         {/* Main Recipe */}

//         <div className="recipe-main-card">

//           {/* Image */}

//           <div className="recipe-details-image-wrapper">

//             {imageUrl ? (
//               <img
//                 src={imageUrl}
//                 alt={recipe.title}
//                 className="recipe-details-image"
//               />
//             ) : (
//               <div className="recipe-details-image-placeholder">
//                 🍳
//               </div>
//             )}

//             <button
//               type="button"
//               className={`details-favorite-button ${
//                 isFavorite ? "active" : ""
//               }`}
//               onClick={handleFavorite}
//               aria-label="Add to favorites"
//             >
//               {isFavorite ? "♥" : "♡"}
//             </button>

//           </div>

//           {/* Information */}

//           <div className="recipe-details-info">

//             <div className="recipe-details-category">
//               {recipe.category || "Recipe"}
//             </div>

//             <h1>
//               {recipe.title}
//             </h1>

//             <p className="recipe-details-description">
//               {recipe.description}
//             </p>

//             {/* Author */}

//             <div className="recipe-author">

//               <div className="author-avatar">
//                 {recipe.author?.name
//                   ?.charAt(0)
//                   ?.toUpperCase() || "U"}
//               </div>

//               <div>
//                 <span>Created by</span>

//                 <strong>
//                   {recipe.author?.name || "Unknown User"}
//                 </strong>
//               </div>

//             </div>

//             {/* Rating */}

//             <div className="recipe-rating">

//               <div className="stars">
//                 {"★".repeat(Math.round(averageRating))}
//                 {"☆".repeat(5 - Math.round(averageRating))}
//               </div>

//               <span>
//                 {Number(averageRating).toFixed(1)}
//               </span>

//               <span className="rating-count">
//                 ({reviews.length} reviews)
//               </span>

//             </div>

//             {/* Recipe Meta */}

//             <div className="recipe-meta">

//               <div className="meta-item">
//                 <span className="meta-icon">⏱️</span>

//                 <div>
//                   <small>Prep Time</small>
//                   <strong>
//                     {recipe.prepTime || 0} min
//                   </strong>
//                 </div>
//               </div>

//               <div className="meta-item">
//                 <span className="meta-icon">🔥</span>

//                 <div>
//                   <small>Cooking Time</small>
//                   <strong>
//                     {recipe.cookingTime || 0} min
//                   </strong>
//                 </div>
//               </div>

//               <div className="meta-item">
//                 <span className="meta-icon">🍽️</span>

//                 <div>
//                   <small>Servings</small>
//                   <strong>
//                     {recipe.servings || 1}
//                   </strong>
//                 </div>
//               </div>

//               <div className="meta-item">
//                 <span className="meta-icon">📊</span>

//                 <div>
//                   <small>Difficulty</small>
//                   <strong>
//                     {recipe.difficulty || "Easy"}
//                   </strong>
//                 </div>
//               </div>

//             </div>

//           </div>

//         </div>

//         {/* Recipe Content */}

//         <div className="recipe-content-layout">

//           <main>

//             {/* Ingredients */}

//             <div className="recipe-content-card">

//               <h2>
//                 Ingredients
//               </h2>

//               <div className="ingredients-list">

//                 {Array.isArray(recipe.ingredients) ? (
//                   recipe.ingredients.map((ingredient, index) => (
//                     <div
//                       className="ingredient-item"
//                       key={index}
//                     >
//                       <span className="ingredient-number">
//                         {index + 1}
//                       </span>

//                       <span>
//                         {ingredient}
//                       </span>
//                     </div>
//                   ))
//                 ) : (
//                   <p>
//                     {recipe.ingredients || "No ingredients available."}
//                   </p>
//                 )}

//               </div>

//             </div>

//             {/* Instructions */}

//             <div className="recipe-content-card">

//               <h2>
//                 Instructions
//               </h2>

//               <div className="instructions-list">

//                 {Array.isArray(recipe.instructions) ? (
//                   recipe.instructions.map((instruction, index) => (
//                     <div
//                       className="instruction-item"
//                       key={index}
//                     >
//                       <div className="instruction-number">
//                         {index + 1}
//                       </div>

//                       <p>
//                         {instruction}
//                       </p>
//                     </div>
//                   ))
//                 ) : (
//                   <p>
//                     {recipe.instructions || "No instructions available."}
//                   </p>
//                 )}

//               </div>

//             </div>

//           </main>

//           {/* Sidebar */}

//           <aside className="recipe-sidebar">

//             <div className="sidebar-card">

//               <h3>
//                 Recipe Information
//               </h3>

//               <div className="sidebar-info">

//                 <div>
//                   <span>Category</span>
//                   <strong>
//                     {recipe.category || "N/A"}
//                   </strong>
//                 </div>

//                 <div>
//                   <span>Dietary Type</span>
//                   <strong>
//                     {recipe.dietaryType || "N/A"}
//                   </strong>
//                 </div>

//                 <div>
//                   <span>Difficulty</span>
//                   <strong>
//                     {recipe.difficulty || "Easy"}
//                   </strong>
//                 </div>

//                 <div>
//                   <span>Total Time</span>
//                   <strong>
//                     {(Number(recipe.prepTime) || 0) +
//                       (Number(recipe.cookingTime) || 0)}{" "}
//                     min
//                   </strong>
//                 </div>

//               </div>

//             </div>

//           </aside>

//         </div>

//         {/* Reviews */}

//         <section className="reviews-section">

//           <div className="reviews-header">

//             <div>
//               <h2>
//                 Reviews & Ratings
//               </h2>

//               <p>
//                 See what people think about this recipe.
//               </p>
//             </div>

//             <div className="big-rating">
//               <strong>
//                 {Number(averageRating).toFixed(1)}
//               </strong>

//               <span>
//                 {"★".repeat(Math.round(averageRating))}
//               </span>
//             </div>

//           </div>

//           {/* Review Form */}

//           <div className="review-form-card">

//             <h3>
//               Write a Review
//             </h3>

//             {reviewError && (
//               <div className="review-error">
//                 {reviewError}
//               </div>
//             )}

//             <form onSubmit={handleReviewSubmit}>

//               <div className="review-rating-input">

//                 <label htmlFor="rating">
//                   Rating
//                 </label>

//                 <select
//                   id="rating"
//                   name="rating"
//                   value={reviewForm.rating}
//                   onChange={handleReviewChange}
//                 >
//                   <option value="5">★★★★★ - 5</option>
//                   <option value="4">★★★★☆ - 4</option>
//                   <option value="3">★★★☆☆ - 3</option>
//                   <option value="2">★★☆☆☆ - 2</option>
//                   <option value="1">★☆☆☆☆ - 1</option>
//                 </select>

//               </div>

//               <div className="review-comment-input">

//                 <label htmlFor="comment">
//                   Your Review
//                 </label>

//                 <textarea
//                   id="comment"
//                   name="comment"
//                   rows="4"
//                   placeholder="Share your experience with this recipe..."
//                   value={reviewForm.comment}
//                   onChange={handleReviewChange}
//                 />

//               </div>

//               <Button
//                 type="submit"
//                 loading={reviewLoading}
//                 disabled={reviewLoading}
//               >
//                 Submit Review
//               </Button>

//             </form>

//           </div>

//           {/* Review List */}

//           <div className="reviews-list">

//             {reviews.length === 0 ? (
//               <div className="no-reviews">
//                 <span>💬</span>

//                 <h3>
//                   No reviews yet
//                 </h3>

//                 <p>
//                   Be the first person to review this recipe.
//                 </p>
//               </div>
//             ) : (
//               reviews.map((review) => (
//                 <div
//                   className="review-card"
//                   key={review.id}
//                 >

//                   <div className="review-user">

//                     <div className="review-avatar">
//                       {review.reviewer?.name
//                         ?.charAt(0)
//                         ?.toUpperCase() || "U"}
//                     </div>

//                     <div>
//                       <strong>
//                         {review.reviewer?.name || "User"}
//                       </strong>

//                       <div className="review-stars">
//                         {"★".repeat(review.rating)}
//                         {"☆".repeat(5 - review.rating)}
//                       </div>
//                     </div>

//                   </div>

//                   <p>
//                     {review.comment}
//                   </p>

//                 </div>
//               ))
//             )}

//           </div>

//         </section>

//       </div>

//     </section>
//   );
// };

// export default RecipeDetails;








import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Loader from "../../components/Loader/Loader";

import {
  getRecipeById,
  deleteRecipe
} from "../../services/recipeService";

import {
  addFavorite,
  removeFavorite,
  createReview,
  getRecipeReviews,
  followUser,
  unfollowUser
} from "../../services/socialService";

import "./RecipeDetails.css";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [averageRating, setAverageRating] = useState(0);

  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [error, setError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [success, setSuccess] = useState("");

  const [isFavorite, setIsFavorite] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ""
  });

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const token = localStorage.getItem("token");

  // =========================================
  // Fetch recipe
  // =========================================

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getRecipeById(id);

      setRecipe(response.recipe || response.data || response);

    } catch (err) {
      console.error("Recipe details error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load recipe."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // Fetch reviews
  // =========================================

  const fetchReviews = async () => {
    try {
      const response = await getRecipeReviews(id);

      setReviews(
        response.reviews ||
        response.data ||
        []
      );

      setAverageRating(
        Number(response.averageRating || 0)
      );

    } catch (err) {
      console.error("Reviews error:", err);

      setReviews([]);
      setAverageRating(0);
    }
  };

  useEffect(() => {
    fetchRecipe();
    fetchReviews();
  }, [id]);

  // =========================================
  // Parse ingredients / instructions
  // =========================================

  const parseData = (value) => {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    try {
      const parsed = JSON.parse(value);

      return Array.isArray(parsed)
        ? parsed
        : [parsed];
    } catch {
      return String(value)
        .split("\n")
        .map(item => item.trim())
        .filter(Boolean);
    }
  };

  const ingredients = parseData(recipe?.ingredients);
  const instructions = parseData(recipe?.instructions);

  // =========================================
  // Image URL
  // =========================================

  // const getImageUrl = (image) => {
  //   if (!image) {
  //     return null;
  //   }

  //   if (image.startsWith("http")) {
  //     return image;
  //   }

  //   return `http://localhost:5000/${image}`;
  // };

  const getImageUrl = image => {
    if (!image) return null;

    if (image.startsWith("http")) {
        return image;
    }

    return `http://localhost:5000/${image.replace(/^\/+/, "")}`;
};

  // =========================================
  // Favorite
  // =========================================

  const handleFavorite = async () => {
    if (!token) {
      navigate("/login", {
        state: {
          from: `/recipes/${id}`
        }
      });

      return;
    }

    try {
      setFavoriteLoading(true);
      setError("");
      setSuccess("");

      if (isFavorite) {
        await removeFavorite(id);

        setIsFavorite(false);
        setSuccess("Recipe removed from favorites.");
      } else {
        await addFavorite(id);

        setIsFavorite(true);
        setSuccess("Recipe added to favorites.");
      }

    } catch (err) {
      console.error("Favorite error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to update favorite."
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  // =========================================
  // Follow author
  // =========================================

  const handleFollow = async () => {
    if (!token) {
      navigate("/login", {
        state: {
          from: `/recipes/${id}`
        }
      });

      return;
    }

    if (!recipe?.author?.id) {
      return;
    }

    try {
      setFollowLoading(true);
      setError("");
      setSuccess("");

      if (isFollowing) {
        await unfollowUser(recipe.author.id);

        setIsFollowing(false);
        setSuccess("You unfollowed this user.");
      } else {
        await followUser(recipe.author.id);

        setIsFollowing(true);
        setSuccess("You are now following this user.");
      }

    } catch (err) {
      console.error("Follow error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to update follow status."
      );
    } finally {
      setFollowLoading(false);
    }
  };

  // =========================================
  // Review input
  // =========================================

  const handleReviewChange = (event) => {
    const { name, value } = event.target;

    setReviewForm(previous => ({
      ...previous,
      [name]: value
    }));
  };

  // =========================================
  // Submit review
  // =========================================

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      navigate("/login", {
        state: {
          from: `/recipes/${id}`
        }
      });

      return;
    }

    try {
      setReviewLoading(true);
      setReviewError("");
      setSuccess("");

      if (
        Number(reviewForm.rating) < 1 ||
        Number(reviewForm.rating) > 5
      ) {
        setReviewError(
          "Rating must be between 1 and 5."
        );

        return;
      }

      if (!reviewForm.comment.trim()) {
        setReviewError(
          "Please write a review."
        );

        return;
      }

      await createReview(id, {
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment.trim()
      });

      setReviewForm({
        rating: 5,
        comment: ""
      });

      setSuccess("Review added successfully.");

      await fetchReviews();

    } catch (err) {
      console.error("Create review error:", err);

      setReviewError(
        err.response?.data?.message ||
        "Unable to add review."
      );
    } finally {
      setReviewLoading(false);
    }
  };

  // =========================================
  // Delete recipe
  // =========================================

  const handleDeleteRecipe = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this recipe?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(true);
      setError("");

      await deleteRecipe(id);

      navigate("/profile");

    } catch (err) {
      console.error("Delete recipe error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to delete recipe."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // =========================================
  // Ownership
  // =========================================

  const isOwner =
    currentUser &&
    recipe &&
    Number(currentUser.id) === Number(recipe.UserId || recipe.userId);

  // =========================================
  // Loading
  // =========================================

  if (loading) {
    return (
      <div className="recipe-details-page">
        <Loader text="Loading recipe..." />
      </div>
    );
  }

  // =========================================
  // Error
  // =========================================

  if (!recipe) {
    return (
      <div className="recipe-details-page">
        <div className="container">
          <div className="recipe-details-error">
            <h2>Recipe not found</h2>

            <p>
              {error || "This recipe may have been removed."}
            </p>

            <Link
              to="/"
              className="back-home-btn"
            >
              Back to Recipes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(recipe.image);

  const author =
    recipe.author ||
    recipe.User ||
    recipe.user;

  const authorImage = getImageUrl(
    author?.profileImage
  );

  return (
    <div className="recipe-details-page">

      <div className="container">

        {/* ================================= */}
        {/* Alerts */}
        {/* ================================= */}

        {error && (
          <div className="recipe-alert recipe-alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="recipe-alert recipe-alert-success">
            {success}
          </div>
        )}

        {/* ================================= */}
        {/* Recipe Hero */}
        {/* ================================= */}

        <section className="recipe-detail-card">

          <div className="recipe-detail-image-wrapper">

            {imageUrl ? (
              <img
                src={imageUrl}
                alt={recipe.title}
                className="recipe-detail-image"
              />
            ) : (
              <div className="recipe-detail-image-placeholder">
                🍲
              </div>
            )}

          </div>

          <div className="recipe-detail-content">

            <div className="recipe-detail-top">

              <div className="recipe-badges">

                {recipe.category && (
                  <span className="recipe-category">
                    {recipe.category}
                  </span>
                )}

                {recipe.difficulty && (
                  <span className="recipe-difficulty">
                    {recipe.difficulty}
                  </span>
                )}

                {recipe.dietaryType && (
                  <span className="recipe-dietary">
                    {recipe.dietaryType}
                  </span>
                )}

              </div>

              <button
                className={`favorite-detail-btn ${
                  isFavorite ? "active" : ""
                }`}
                onClick={handleFavorite}
                disabled={favoriteLoading}
              >
                {favoriteLoading
                  ? "..."
                  : isFavorite
                    ? "❤️ Saved"
                    : "♡ Save"}
              </button>

            </div>

            <h1>
              {recipe.title}
            </h1>

            {recipe.description && (
              <p className="recipe-description">
                {recipe.description}
              </p>
            )}

            {/* Recipe Stats */}

            <div className="recipe-stats">

              <div className="recipe-stat">
                <span>⏱️</span>

                <div>
                  <strong>
                    {recipe.prepTime || 0}
                  </strong>

                  <small>
                    Prep Time
                  </small>
                </div>
              </div>

              <div className="recipe-stat">
                <span>🔥</span>

                <div>
                  <strong>
                    {recipe.cookingTime || 0}
                  </strong>

                  <small>
                    Cooking Time
                  </small>
                </div>
              </div>

              <div className="recipe-stat">
                <span>🍽️</span>

                <div>
                  <strong>
                    {recipe.servings || 0}
                  </strong>

                  <small>
                    Servings
                  </small>
                </div>
              </div>

              <div className="recipe-stat">
                <span>⭐</span>

                <div>
                  <strong>
                    {averageRating
                      ? averageRating.toFixed(1)
                      : "0.0"}
                  </strong>

                  <small>
                    Rating
                  </small>
                </div>
              </div>

            </div>

            {/* Author */}

            {author && (
              <div className="recipe-author">

                <Link
                  to={`/users/${author.id}`}
                  className="author-profile"
                >

                  {authorImage ? (
                    <img
                      src={authorImage}
                      alt={author.name}
                    />
                  ) : (
                    <div className="author-placeholder">
                      {author.name
                        ? author.name
                            .charAt(0)
                            .toUpperCase()
                        : "U"}
                    </div>
                  )}

                  <div>
                    <small>
                      Recipe by
                    </small>

                    <strong>
                      {author.name}
                    </strong>
                  </div>

                </Link>

                {token &&
                  currentUser &&
                  Number(currentUser.id) !==
                    Number(author.id) && (
                    <button
                      className={`follow-btn ${
                        isFollowing
                          ? "following"
                          : ""
                      }`}
                      onClick={handleFollow}
                      disabled={followLoading}
                    >
                      {followLoading
                        ? "..."
                        : isFollowing
                          ? "Following"
                          : "Follow"}
                    </button>
                  )}

              </div>
            )}

            {/* Owner actions */}

            {isOwner && (
              <div className="owner-actions">

                <Link
                  to={`/recipes/edit/${recipe.id}`}
                  className="edit-recipe-btn"
                >
                  Edit Recipe
                </Link>

                <button
                  className="delete-recipe-btn"
                  onClick={handleDeleteRecipe}
                  disabled={deleteLoading}
                >
                  {deleteLoading
                    ? "Deleting..."
                    : "Delete Recipe"}
                </button>

              </div>
            )}

          </div>

        </section>

        {/* ================================= */}
        {/* Recipe Body */}
        {/* ================================= */}

        <section className="recipe-body">

          {/* Ingredients */}

          <div className="recipe-info-section">

            <div className="section-title">

              <span className="section-title-icon">
                🥕
              </span>

              <div>
                <h2>
                  Ingredients
                </h2>

                <p>
                  Everything you need for this recipe
                </p>
              </div>

            </div>

            {ingredients.length > 0 ? (

              <ul className="ingredients-list">

                {ingredients.map((ingredient, index) => {

                  const text =
                    typeof ingredient === "object"
                      ? ingredient.name ||
                        ingredient.ingredient ||
                        JSON.stringify(ingredient)
                      : ingredient;

                  return (
                    <li key={index}>
                      <span className="ingredient-check">
                        ✓
                      </span>

                      <span>
                        {text}
                      </span>
                    </li>
                  );
                })}

              </ul>

            ) : (
              <p className="empty-recipe-data">
                No ingredients available.
              </p>
            )}

          </div>

          {/* Instructions */}

          <div className="recipe-info-section">

            <div className="section-title">

              <span className="section-title-icon">
                👨‍🍳
              </span>

              <div>
                <h2>
                  Instructions
                </h2>

                <p>
                  Follow these steps to prepare the recipe
                </p>
              </div>

            </div>

            {instructions.length > 0 ? (

              <div className="instructions-list">

                {instructions.map((instruction, index) => {

                  const text =
                    typeof instruction === "object"
                      ? instruction.step ||
                        instruction.instruction ||
                        JSON.stringify(instruction)
                      : instruction;

                  return (
                    <div
                      className="instruction-item"
                      key={index}
                    >

                      <div className="instruction-number">
                        {index + 1}
                      </div>

                      <p>
                        {text}
                      </p>

                    </div>
                  );
                })}

              </div>

            ) : (
              <p className="empty-recipe-data">
                No instructions available.
              </p>
            )}

          </div>

        </section>

        {/* ================================= */}
        {/* Reviews */}
        {/* ================================= */}

        <section className="reviews-section">

          <div className="section-title">

            <span className="section-title-icon">
              ⭐
            </span>

            <div>
              <h2>
                Reviews & Ratings
              </h2>

              <p>
                {reviews.length} review
                {reviews.length !== 1 ? "s" : ""}
              </p>
            </div>

          </div>

          {/* Review Summary */}

          <div className="review-summary">

            <div className="average-rating">

              <strong>
                {averageRating
                  ? averageRating.toFixed(1)
                  : "0.0"}
              </strong>

              <div className="stars">
                {"★".repeat(
                  Math.round(averageRating)
                )}
                {"☆".repeat(
                  5 - Math.round(averageRating)
                )}
              </div>

              <span>
                Average Rating
              </span>

            </div>

            <div className="rating-count">
              Based on {reviews.length} review
              {reviews.length !== 1 ? "s" : ""}
            </div>

          </div>

          {/* Add Review */}

          {token && (
            <form
              className="review-form"
              onSubmit={handleReviewSubmit}
            >

              <h3>
                Write a Review
              </h3>

              {reviewError && (
                <div className="review-error">
                  {reviewError}
                </div>
              )}

              <div className="review-rating-input">

                <label>
                  Rating
                </label>

                <select
                  name="rating"
                  value={reviewForm.rating}
                  onChange={handleReviewChange}
                >
                  <option value="5">
                    ⭐⭐⭐⭐⭐ 5 - Excellent
                  </option>

                  <option value="4">
                    ⭐⭐⭐⭐ 4 - Good
                  </option>

                  <option value="3">
                    ⭐⭐⭐ 3 - Average
                  </option>

                  <option value="2">
                    ⭐⭐ 2 - Poor
                  </option>

                  <option value="1">
                    ⭐ 1 - Very Poor
                  </option>
                </select>

              </div>

              <div className="review-comment-input">

                <label>
                  Comment
                </label>

                <textarea
                  name="comment"
                  value={reviewForm.comment}
                  onChange={handleReviewChange}
                  placeholder="Share your experience with this recipe..."
                  rows="4"
                />

              </div>

              <button
                type="submit"
                className="submit-review-btn"
                disabled={reviewLoading}
              >
                {reviewLoading
                  ? "Submitting..."
                  : "Submit Review"}
              </button>

            </form>
          )}

          {!token && (
            <div className="login-review-message">

              <p>
                Login to leave a review.
              </p>

              <Link to="/login">
                Login
              </Link>

            </div>
          )}

          {/* Reviews List */}

          <div className="reviews-list">

            {reviews.length === 0 ? (

              <div className="no-reviews">
                <span>💬</span>

                <h3>
                  No reviews yet
                </h3>

                <p>
                  Be the first person to review this recipe.
                </p>
              </div>

            ) : (

              reviews.map((review) => {

                const reviewer =
                  review.reviewer ||
                  review.User ||
                  review.user;

                return (
                  <article
                    className="review-card"
                    key={review.id}
                  >

                    <div className="review-header">

                      <div className="reviewer-info">

                        <div className="reviewer-avatar">

                          {reviewer?.profileImage ? (
                            <img
                              src={getImageUrl(
                                reviewer.profileImage
                              )}
                              alt={reviewer.name}
                            />
                          ) : (
                            reviewer?.name
                              ?.charAt(0)
                              .toUpperCase() || "U"
                          )}

                        </div>

                        <div>

                          <strong>
                            {reviewer?.name ||
                              "User"}
                          </strong>

                          <span>
                            {review.createdAt
                              ? new Date(
                                  review.createdAt
                                ).toLocaleDateString()
                              : ""}
                          </span>

                        </div>

                      </div>

                      <div className="review-stars">
                        {"★".repeat(
                          Number(review.rating) || 0
                        )}

                        {"☆".repeat(
                          5 -
                            (Number(review.rating) || 0)
                        )}
                      </div>

                    </div>

                    <p className="review-comment">
                      {review.comment}
                    </p>

                  </article>
                );
              })

            )}

          </div>

        </section>

      </div>

    </div>
  );
};

export default RecipeDetails;

