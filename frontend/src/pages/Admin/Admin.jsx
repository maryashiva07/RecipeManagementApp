import { useEffect, useState } from "react";

import Loader from "../../components/Loader/Loader";
import Button from "../../components/Button/Button";

import {
  getAdminRecipes,
  banUser,
  approveUser,
  deleteUser,
  getAdminUsers,
  adminDeleteRecipe,
} from "../../services/socialService";

import "./Admin.css";

// Backend URL from .env
const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
).replace(/\/+$/, "");

// Convert relative image paths into full backend URLs
const getImageUrl = (image) => {
  if (!image || typeof image !== "string") return "";

  const imagePath = image.trim();

  if (!imagePath) return "";

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  return `${BACKEND_URL}/${imagePath.replace(/^\/+/, "")}`;
};

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const [activeTab, setActiveTab] = useState("users");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Track images that fail to load
  const [brokenImages, setBrokenImages] = useState({});

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersResponse, recipesResponse] = await Promise.all([
        getAdminUsers(),
        getAdminRecipes(),
      ]);

      setUsers(
        usersResponse?.users ||
          usersResponse?.data?.users ||
          usersResponse?.data ||
          [],
      );

      setRecipes(
        recipesResponse?.recipes ||
          recipesResponse?.data?.recipes ||
          recipesResponse?.data ||
          [],
      );
    } catch (error) {
      console.error("Admin data error:", error);

      setError(error.response?.data?.message || "Unable to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUserAction = async (action, userId) => {
    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      if (action === "ban") {
        await banUser(userId);

        setUsers((previous) =>
          previous.map((user) =>
            Number(user.id) === Number(userId)
              ? { ...user, status: "BANNED" }
              : user,
          ),
        );

        setSuccess("User banned successfully.");
      }

      if (action === "approve") {
        await approveUser(userId);

        setUsers((previous) =>
          previous.map((user) =>
            Number(user.id) === Number(userId)
              ? { ...user, status: "APPROVED" }
              : user,
          ),
        );

        setSuccess("User approved successfully.");
      }

      if (action === "delete") {
        const confirmed = window.confirm(
          "Are you sure you want to delete this user?",
        );

        if (!confirmed) return;

        await deleteUser(userId);

        setUsers((previous) =>
          previous.filter((user) => Number(user.id) !== Number(userId)),
        );

        setSuccess("User deleted successfully.");
      }
    } catch (error) {
      console.error("User action error:", error);

      setError(
        error.response?.data?.message || "Unable to perform this action.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this recipe?",
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await adminDeleteRecipe(recipeId);

      setRecipes((previous) =>
        previous.filter((recipe) => Number(recipe.id) !== Number(recipeId)),
      );

      setSuccess("Recipe removed successfully.");
    } catch (error) {
      console.error("Delete recipe error:", error);

      setError(error.response?.data?.message || "Unable to remove recipe.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleImageError = (imageKey) => {
    setBrokenImages((previous) => ({
      ...previous,
      [imageKey]: true,
    }));
  };

  if (loading) {
    return (
      <div className="admin-page">
        <Loader text="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* HEADER */}

        <div className="admin-header">
          <span className="admin-badge">Administration</span>

          <h1>Admin Dashboard</h1>

          <p>Manage users and moderate recipes from one place.</p>
        </div>

        {/* MESSAGES */}

        {error && (
          <div className="admin-message admin-error" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-message admin-success" role="status">
            {success}
          </div>
        )}

        {/* STATS */}

        <div className="admin-stats">
          <div className="admin-stat-card">
            <span className="stat-icon">👥</span>
            <div>
              <strong>{users.length}</strong>
              <span>Total Users</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <span className="stat-icon">🍲</span>
            <div>
              <strong>{recipes.length}</strong>
              <span>Total Recipes</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <span className="stat-icon">⏳</span>
            <div>
              <strong>
                {users.filter((user) => user.status === "PENDING").length}
              </strong>
              <span>Pending Users</span>
            </div>
          </div>
        </div>

        {/* TABS */}

        <div className="admin-tabs">
          <button
            type="button"
            className={activeTab === "users" ? "admin-tab active" : "admin-tab"}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>

          <button
            type="button"
            className={
              activeTab === "recipes" ? "admin-tab active" : "admin-tab"
            }
            onClick={() => setActiveTab("recipes")}
          >
            Recipes
          </button>
        </div>

        {/* USERS */}

        {activeTab === "users" && (
          <section className="admin-section">
            <div className="admin-section-header">
              <div>
                <h2>User Management</h2>
                <p>Manage account status and users.</p>
              </div>
            </div>

            {users.length === 0 ? (
              <div className="admin-empty">No users found.</div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => {
                      const imageKey = `user-${user.id}`;
                      const imageUrl = getImageUrl(user.profileImage);

                      return (
                        <tr key={user.id}>
                          <td>
                            <div className="admin-user">
                              <div className="admin-user-avatar">
                                {imageUrl && !brokenImages[imageKey] ? (
                                  <img
                                    src={imageUrl}
                                    alt={`${user.name || "User"} profile`}
                                    onError={() => handleImageError(imageKey)}
                                  />
                                ) : (
                                  (user.name || "U").charAt(0).toUpperCase()
                                )}
                              </div>

                              <strong>{user.name || "Unknown User"}</strong>
                            </div>
                          </td>

                          <td>{user.email || "N/A"}</td>

                          <td>
                            <span className="role-badge">
                              {user.role || "USER"}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`status-badge status-${String(
                                user.status || "",
                              ).toLowerCase()}`}
                            >
                              {user.status || "UNKNOWN"}
                            </span>
                          </td>

                          <td>
                            <div className="admin-actions">
                              {user.status === "PENDING" && (
                                <Button
                                  variant="outline"
                                  disabled={actionLoading}
                                  onClick={() =>
                                    handleUserAction("approve", user.id)
                                  }
                                >
                                  Approve
                                </Button>
                              )}

                              {user.status !== "BANNED" && (
                                <Button
                                  variant="danger"
                                  disabled={actionLoading}
                                  onClick={() =>
                                    handleUserAction("ban", user.id)
                                  }
                                >
                                  Ban
                                </Button>
                              )}

                              <Button
                                variant="danger"
                                disabled={actionLoading}
                                onClick={() =>
                                  handleUserAction("delete", user.id)
                                }
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* RECIPES */}

        {activeTab === "recipes" && (
          <section className="admin-section">
            <div className="admin-section-header">
              <div>
                <h2>Recipe Moderation</h2>
                <p>Review and remove recipes when required.</p>
              </div>
            </div>

            {recipes.length === 0 ? (
              <div className="admin-empty">No recipes found.</div>
            ) : (
              <div className="admin-recipes">
                {recipes.map((recipe) => {
                  const imageKey = `recipe-${recipe.id}`;
                  const imageUrl = getImageUrl(recipe.image);

                  return (
                    <div className="admin-recipe-card" key={recipe.id}>
                      {imageUrl && !brokenImages[imageKey] ? (
                        <img
                          src={imageUrl}
                          alt={recipe.title || "Recipe"}
                          onError={() => handleImageError(imageKey)}
                        />
                      ) : (
                        <div className="admin-recipe-placeholder">🍲</div>
                      )}

                      <div className="admin-recipe-info">
                        <h3>{recipe.title || "Untitled Recipe"}</h3>

                        <p>
                          {recipe.description || "No description available."}
                        </p>

                        <div className="admin-recipe-meta">
                          <span>{recipe.category || "Uncategorized"}</span>

                          <span>{recipe.difficulty || "N/A"}</span>
                        </div>
                      </div>

                      <Button
                        variant="danger"
                        disabled={actionLoading}
                        onClick={() => handleDeleteRecipe(recipe.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Admin;
