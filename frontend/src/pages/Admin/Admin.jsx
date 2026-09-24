import { useEffect, useState } from "react";

import Loader from "../../components/Loader/Loader";
// import Button from "../../components/Button/Button";

import Button from "../../components/Button/Button";

// import {
//   getAdminUsers,
//   banUser,
//   approveUser,
//   deleteUser,
//   getAdminRecipes,
//   deleteAdminRecipe
// } from "../../services/socialService";

import {getAdminRecipes, banUser, approveUser, deleteUser, getAdminUsers, adminDeleteRecipe} from "../../services/socialService";

import "./Admin.css";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const [activeTab, setActiveTab] = useState("users");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersResponse, recipesResponse] =
        await Promise.all([
          getAdminUsers(),
          getAdminRecipes()
        ]);

      setUsers(
        usersResponse.users ||
          usersResponse.data ||
          []
      );

      setRecipes(
        recipesResponse.recipes ||
          recipesResponse.data ||
          []
      );
    } catch (error) {
      console.error("Admin data error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load admin data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUserAction = async (
    action,
    userId
  ) => {
    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      if (action === "ban") {
        await banUser(userId);

        setUsers(previous =>
          previous.map(user =>
            Number(user.id) === Number(userId)
              ? {
                  ...user,
                  status: "BANNED"
                }
              : user
          )
        );

        setSuccess("User banned successfully.");
      }

      if (action === "approve") {
        await approveUser(userId);

        setUsers(previous =>
          previous.map(user =>
            Number(user.id) === Number(userId)
              ? {
                  ...user,
                  status: "APPROVED"
                }
              : user
          )
        );

        setSuccess("User approved successfully.");
      }

      if (action === "delete") {
        const confirmed = window.confirm(
          "Are you sure you want to delete this user?"
        );

        if (!confirmed) return;

        await deleteUser(userId);

        setUsers(previous =>
          previous.filter(
            user =>
              Number(user.id) !== Number(userId)
          )
        );

        setSuccess("User deleted successfully.");
      }
    } catch (error) {
      console.error("User action error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to perform this action."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRecipe = async recipeId => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this recipe?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await adminDeleteRecipe(recipeId);

      setRecipes(previous =>
        previous.filter(
          recipe =>
            Number(recipe.id) !== Number(recipeId)
        )
      );

      setSuccess("Recipe removed successfully.");
    } catch (error) {
      console.error("Delete recipe error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to remove recipe."
      );
    } finally {
      setActionLoading(false);
    }
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
          <span className="admin-badge">
            Administration
          </span>

          <h1>Admin Dashboard</h1>

          <p>
            Manage users and moderate recipes from
            one place.
          </p>
        </div>

        {/* MESSAGE */}

        {error && (
          <div className="admin-message admin-error">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-message admin-success">
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
                {
                  users.filter(
                    user =>
                      user.status === "PENDING"
                  ).length
                }
              </strong>
              <span>Pending Users</span>
            </div>
          </div>

        </div>

        {/* TABS */}

        <div className="admin-tabs">

          <button
            type="button"
            className={
              activeTab === "users"
                ? "admin-tab active"
                : "admin-tab"
            }
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>

          <button
            type="button"
            className={
              activeTab === "recipes"
                ? "admin-tab active"
                : "admin-tab"
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
                <p>
                  Manage account status and users.
                </p>
              </div>
            </div>

            {users.length === 0 ? (
              <div className="admin-empty">
                No users found.
              </div>
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

                    {users.map(user => (
                      <tr key={user.id}>

                        <td>
                          <div className="admin-user">

                            <div className="admin-user-avatar">
                              {user.profileImage ? (
                                <img
                                  src={
                                    user.profileImage.startsWith(
                                      "http"
                                    )
                                      ? user.profileImage
                                      : `http://localhost:5000/${user.profileImage}`
                                  }
                                  alt={user.name}
                                />
                              ) : (
                                (
                                  user.name || "U"
                                )
                                  .charAt(0)
                                  .toUpperCase()
                              )}
                            </div>

                            <strong>
                              {user.name}
                            </strong>

                          </div>
                        </td>

                        <td>
                          {user.email}
                        </td>

                        <td>
                          <span className="role-badge">
                            {user.role}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`status-badge status-${String(
                              user.status || ""
                            ).toLowerCase()}`}
                          >
                            {user.status}
                          </span>
                        </td>

                        <td>
                          <div className="admin-actions">

                            {user.status ===
                              "PENDING" && (
                              <Button
                                variant="outline"
                                disabled={
                                  actionLoading
                                }
                                onClick={() =>
                                  handleUserAction(
                                    "approve",
                                    user.id
                                  )
                                }
                              >
                                Approve
                              </Button>
                            )}

                            {user.status !==
                              "BANNED" && (
                              <Button
                                variant="danger"
                                disabled={
                                  actionLoading
                                }
                                onClick={() =>
                                  handleUserAction(
                                    "ban",
                                    user.id
                                  )
                                }
                              >
                                Ban
                              </Button>
                            )}

                            <Button
                              variant="danger"
                              disabled={
                                actionLoading
                              }
                              onClick={() =>
                                handleUserAction(
                                  "delete",
                                  user.id
                                )
                              }
                            >
                              Delete
                            </Button>

                          </div>
                        </td>

                      </tr>
                    ))}

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
                <p>
                  Review and remove recipes when
                  required.
                </p>
              </div>
            </div>

            {recipes.length === 0 ? (
              <div className="admin-empty">
                No recipes found.
              </div>
            ) : (
              <div className="admin-recipes">

                {recipes.map(recipe => (
                  <div
                    className="admin-recipe-card"
                    key={recipe.id}
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
                      <div className="admin-recipe-placeholder">
                        🍲
                      </div>
                    )}

                    <div className="admin-recipe-info">

                      <h3>{recipe.title}</h3>

                      <p>
                        {recipe.description ||
                          "No description available."}
                      </p>

                      <div className="admin-recipe-meta">
                        <span>
                          {recipe.category ||
                            "Uncategorized"}
                        </span>

                        <span>
                          {recipe.difficulty ||
                            "N/A"}
                        </span>
                      </div>

                    </div>

                    <Button
                      variant="danger"
                      disabled={actionLoading}
                      onClick={() =>
                        handleDeleteRecipe(
                          recipe.id
                        )
                      }
                    >
                      Remove
                    </Button>

                  </div>
                ))}

              </div>
            )}

          </section>
        )}

      </div>
    </div>
  );
};

export default Admin;