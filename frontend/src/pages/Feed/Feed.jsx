import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Loader from "../../components/Loader/Loader";

import { getFeed } from "../../services/socialService";

import "./Feed.css";

const Feed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFeed = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getFeed();

      setActivities(
        response.activities ||
          response.data ||
          []
      );
    } catch (error) {
      console.error("Feed fetch error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load your feed."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const getActivityText = activity => {
    switch (activity.type) {
      case "RECIPE_CREATED":
      case "recipe_created":
      case "CREATE_RECIPE":
        return "created a new recipe";

      case "REVIEW_CREATED":
      case "review_created":
      case "CREATE_REVIEW":
        return "reviewed a recipe";

      case "RECIPE_UPDATED":
      case "recipe_updated":
        return "updated a recipe";

      default:
        return "performed an activity";
    }
  };

  const getActivityRecipe = activity => {
    return (
      activity.recipe ||
      activity.Recipe ||
      activity.recipeData ||
      null
    );
  };

  const getActivityUser = activity => {
    return (
      activity.user ||
      activity.User ||
      null
    );
  };

  const formatDate = date => {
    if (!date) return "";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }
    );
  };

  if (loading) {
    return (
      <div className="feed-page">
        <Loader text="Loading your feed..." />
      </div>
    );
  }

  return (
    <div className="feed-page">
      <div className="feed-container">

        <div className="feed-header">
          <span className="feed-badge">
            Community Activity
          </span>

          <h1>Your Feed</h1>

          <p>
            See the latest recipe activity from people
            you follow.
          </p>
        </div>

        {error && (
          <div className="feed-error">
            {error}
          </div>
        )}

        {activities.length === 0 ? (
          <div className="feed-empty">

            <div className="feed-empty-icon">
              📰
            </div>

            <h2>Your Feed is Empty</h2>

            <p>
              Follow other food creators to see their
              latest recipe activities here.
            </p>

          </div>
        ) : (
          <div className="feed-list">

            {activities.map((activity, index) => {
              const user = getActivityUser(activity);
              const recipe = getActivityRecipe(activity);

              return (
                <article
                  className="activity-card"
                  key={activity.id || index}
                >

                  <div className="activity-avatar">
                    {user?.profileImage ? (
                      <img
                        src={
                          user.profileImage.startsWith("http")
                            ? user.profileImage
                            : `http://localhost:5000/${user.profileImage}`
                        }
                        alt={user.name || "User"}
                      />
                    ) : (
                      <span>
                        {(user?.name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="activity-content">

                    <div className="activity-text">
                      <strong>
                        {user?.name || "Someone"}
                      </strong>{" "}
                      {getActivityText(activity)}
                    </div>

                    <div className="activity-date">
                      {formatDate(
                        activity.createdAt
                      )}
                    </div>

                    {recipe && (
                      <Link
                        to={`/recipes/${recipe.id}`}
                        className="activity-recipe"
                      >

                        {recipe.image ? (
                          <img
                            src={
                              recipe.image.startsWith("http")
                                ? recipe.image
                                : `http://localhost:5000/${recipe.image}`
                            }
                            alt={recipe.title}
                          />
                        ) : (
                          <div className="activity-recipe-placeholder">
                            🍲
                          </div>
                        )}

                        <div>
                          <h3>{recipe.title}</h3>

                          {recipe.description && (
                            <p>
                              {recipe.description}
                            </p>
                          )}
                        </div>

                      </Link>
                    )}

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default Feed;