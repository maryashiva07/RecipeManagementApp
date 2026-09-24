// import { useEffect, useState } from "react";
// import SearchBar from "../../components/SearchBar/SearchBar";
// import RecipeCard from "../../components/RecipeCard/RecipeCard";
// import Loader from "../../components/Loader/Loader";
// import { getRecipes } from "../../services/recipeService";
// import { addFavorite, removeFavorite } from "../../services/socialService";
// import "./Home.css";

// const categories = [
//   "Indian",
//   "Breakfast",
//   "Desserts",
//   "Healthy",
//   "Italian",
//   "Quick Meals"
// ];

// const Home = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [page, setPage] = useState(1);
//   const [pagination, setPagination] = useState(null);

//   const [favoriteIds, setFavoriteIds] = useState([]);

//   const fetchRecipes = async (params = {}) => {
//     try {
//       setLoading(true);
//       setError("");

//       const data = await getRecipes({
//         page: params.page || 1,
//         limit: 12,
//         ...params
//       });

//       setRecipes(data.recipes || []);
//       setPagination(data.pagination || null);
//     } catch (error) {
//       console.error("Recipe fetch error:", error);

//       setError(
//         error.response?.data?.message ||
//         "Unable to load recipes."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRecipes();
//   }, []);

//   const handleSearch = (value) => {
//     setPage(1);

//     if (!value) {
//       fetchRecipes({ page: 1 });
//       return;
//     }

//     fetchRecipes({
//       search: value,
//       page: 1
//     });
//   };

//   const handleCategory = (category) => {
//     setPage(1);

//     fetchRecipes({
//       category,
//       page: 1
//     });
//   };

//   const handleFavorite = async (recipeId) => {
//     try {
//       if (favoriteIds.includes(recipeId)) {
//         await removeFavorite(recipeId);

//         setFavoriteIds((previous) =>
//           previous.filter((id) => id !== recipeId)
//         );
//       } else {
//         await addFavorite(recipeId);

//         setFavoriteIds((previous) => [
//           ...previous,
//           recipeId
//         ]);
//       }
//     } catch (error) {
//       console.error("Favorite error:", error);

//       setError(
//         error.response?.data?.message ||
//         "Unable to update favorite."
//       );
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);

//     fetchRecipes({
//       page: newPage
//     });

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth"
//     });
//   };

//   return (
//     <section className="home-page">

//       <div className="home-hero">
//         <div className="container">

//           <div className="hero-content">

//             <span className="hero-badge">
//               🍳 Discover • Cook • Share
//             </span>

//             <h1>
//               Delicious Recipes,
//               <br />
//               <span>Made for Everyone.</span>
//             </h1>

//             <p>
//               Discover delicious recipes, share your own creations,
//               and connect with food lovers around the world.
//             </p>

//             <SearchBar
//               onSearch={handleSearch}
//               placeholder="Search recipes, ingredients..."
//             />

//           </div>

//         </div>
//       </div>

//       <div className="container home-content">

//         <div className="categories-section">

//           <div className="section-title">
//             <h2>Explore Categories</h2>
//             <p>Find recipes based on your favorite cuisine.</p>
//           </div>

//           <div className="categories-list">

//             {categories.map((category) => (
//               <button
//                 key={category}
//                 type="button"
//                 onClick={() => handleCategory(category)}
//               >
//                 {category}
//               </button>
//             ))}

//           </div>

//         </div>

//         <div className="recipes-section">

//           <div className="section-title">
//             <h2>Latest Recipes</h2>

//             <p>
//               Explore recipes shared by our community.
//             </p>
//           </div>

//           {loading ? (
//             <Loader text="Loading recipes..." />
//           ) : error ? (
//             <div className="home-error">
//               {error}
//             </div>
//           ) : recipes.length === 0 ? (
//             <div className="home-empty">
//               <span>🍽️</span>
//               <h3>No recipes found</h3>
//               <p>
//                 Try another search or explore a different category.
//               </p>
//             </div>
//           ) : (
//             <>
//               <div className="recipes-grid">

//                 {recipes.map((recipe) => (
//                   <RecipeCard
//                     key={recipe.id}
//                     recipe={recipe}
//                     isFavorite={favoriteIds.includes(recipe.id)}
//                     onFavorite={handleFavorite}
//                   />
//                 ))}

//               </div>

//               {pagination?.totalPages > 1 && (
//                 <div className="pagination">

//                   <button
//                     type="button"
//                     disabled={page === 1}
//                     onClick={() =>
//                       handlePageChange(page - 1)
//                     }
//                   >
//                     Previous
//                   </button>

//                   <span>
//                     Page {page} of {pagination.totalPages}
//                   </span>

//                   <button
//                     type="button"
//                     disabled={
//                       page === pagination.totalPages
//                     }
//                     onClick={() =>
//                       handlePageChange(page + 1)
//                     }
//                   >
//                     Next
//                   </button>

//                 </div>
//               )}
//             </>
//           )}

//         </div>

//       </div>

//     </section>
//   );
// };

// export default Home;








import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import Loader from "../../components/Loader/Loader";
import { getRecipes } from "../../services/recipeService";
import { addFavorite, removeFavorite } from "../../services/socialService";
import "./Home.css";

const categories = [
  "Indian",
  "Breakfast",
  "Desserts",
  "Healthy",
  "Italian",
  "Quick Meals"
];

// Online fallback images
const fallbackImages = [
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=800&q=80"
];

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [favoriteIds, setFavoriteIds] = useState([]);

  const fetchRecipes = async (params = {}) => {
    try {
      setLoading(true);
      setError("");

      const data = await getRecipes({
        page: params.page || 1,
        limit: 12,
        ...params
      });

      const recipesWithImages = (data.recipes || []).map(
        (recipe, index) => ({
          ...recipe,

          // Backend image available -> use it
          // Otherwise -> use online fallback image
          image:
            recipe.image ||
            fallbackImages[index % fallbackImages.length]
        })
      );

      setRecipes(recipesWithImages);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error("Recipe fetch error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to load recipes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSearch = (value) => {
    setPage(1);

    if (!value) {
      fetchRecipes({
        page: 1
      });
      return;
    }

    fetchRecipes({
      search: value,
      page: 1
    });
  };

  const handleCategory = (category) => {
    setPage(1);

    fetchRecipes({
      category,
      page: 1
    });
  };

  const handleFavorite = async (recipeId) => {
    try {
      if (favoriteIds.includes(recipeId)) {
        await removeFavorite(recipeId);

        setFavoriteIds((previous) =>
          previous.filter((id) => id !== recipeId)
        );
      } else {
        await addFavorite(recipeId);

        setFavoriteIds((previous) => [
          ...previous,
          recipeId
        ]);
      }
    } catch (error) {
      console.error("Favorite error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to update favorite."
      );
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);

    fetchRecipes({
      page: newPage
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <section className="home-page">

      {/* HERO */}
      <div className="home-hero">

        <div className="container">

          <div className="hero-content">

            <span className="hero-badge">
              🍳 Discover • Cook • Share
            </span>

            <h1>
              Delicious Recipes,
              <br />
              <span>Made for Everyone.</span>
            </h1>

            <p>
              Discover delicious recipes, share your own
              creations, and connect with food lovers around
              the world.
            </p>

            <SearchBar
              onSearch={handleSearch}
              placeholder="Search recipes, ingredients..."
            />

          </div>

        </div>

      </div>

      {/* CONTENT */}
      <div className="container home-content">

        {/* CATEGORIES */}
        <div className="categories-section">

          <div className="section-title">

            <h2>
              Explore Categories
            </h2>

            <p>
              Find recipes based on your favorite cuisine.
            </p>

          </div>

          <div className="categories-list">

            {categories.map((category) => (

              <button
                key={category}
                type="button"
                onClick={() => handleCategory(category)}
              >
                {category}
              </button>

            ))}

          </div>

        </div>

        {/* RECIPES */}
        <div className="recipes-section">

          <div className="section-title">

            <h2>
              Latest Recipes
            </h2>

            <p>
              Explore recipes shared by our community.
            </p>

          </div>

          {loading ? (

            <Loader text="Loading recipes..." />

          ) : error ? (

            <div className="home-error">
              {error}
            </div>

          ) : recipes.length === 0 ? (

            <div className="home-empty">

              <span>
                🍽️
              </span>

              <h3>
                No recipes found
              </h3>

              <p>
                Try another search or explore a different
                category.
              </p>

            </div>

          ) : (

            <>

              <div className="recipes-grid">

                {recipes.map((recipe) => (

                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={favoriteIds.includes(recipe.id)}
                    onFavorite={handleFavorite}
                  />

                ))}

              </div>

              {pagination?.totalPages > 1 && (

                <div className="pagination">

                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() =>
                      handlePageChange(page - 1)
                    }
                  >
                    ← Previous
                  </button>

                  <span>
                    Page {page} of {pagination.totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={
                      page === pagination.totalPages
                    }
                    onClick={() =>
                      handlePageChange(page + 1)
                    }
                  >
                    Next →
                  </button>

                </div>

              )}

            </>

          )}

        </div>

      </div>

    </section>
  );
};

export default Home;