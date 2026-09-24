import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import RecipeCard from "../../components/RecipeCard/RecipeCard";
import Loader from "../../components/Loader/Loader";

import {
  getMyProfile,
  updateProfile,
  getUserRecipes,
  getMyFavorites
} from "../../services/userService";

// import {
//   getFollowers,
//   getFollowing
// } from "../../services/socialService";

import {
  getFollowers,
  getFollowing,
  getFavorites
} from "../../services/socialService";

import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profileImage: null
  });

  // -----------------------------------
  // Fetch profile data
  // -----------------------------------

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError("");

      const profileResponse = await getMyProfile();

      const user = profileResponse.user || profileResponse;

      setProfile(user);

      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        profileImage: null
      });

      // Get user's recipes
      if (user.id) {
        try {
          const recipesResponse = await getUserRecipes(user.id);

          setRecipes(
            recipesResponse.recipes ||
            recipesResponse.data ||
            []
          );
        } catch (recipeError) {
          console.error("User recipes error:", recipeError);
          setRecipes([]);
        }
      }

      // Get favorites
      try {
        const favoritesResponse = await getFavorites();

        const favoriteData =
          favoritesResponse.favorites ||
          favoritesResponse.data ||
          [];

        setFavorites(favoriteData);
      } catch (favoriteError) {
        console.error("Favorites error:", favoriteError);
        setFavorites([]);
      }

      // Followers
      try {
        const followersResponse = await getFollowers();

        setFollowers(
          followersResponse.followers ||
          followersResponse.data ||
          []
        );
      } catch (followersError) {
        console.error("Followers error:", followersError);
        setFollowers([]);
      }

      // Following
      try {
        const followingResponse = await getFollowing();

        setFollowing(
          followingResponse.following ||
          followingResponse.data ||
          []
        );
      } catch (followingError) {
        console.error("Following error:", followingError);
        setFollowing([]);
      }

    } catch (err) {
      console.error("Profile fetch error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // -----------------------------------
  // Input change
  // -----------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // -----------------------------------
  // Profile image
  // -----------------------------------

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setFormData((previous) => ({
      ...previous,
      profileImage: file
    }));
  };

  // -----------------------------------
  // Update profile
  // -----------------------------------

  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const data = new FormData();

      data.append("name", formData.name);
      data.append("bio", formData.bio);

      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }

      const response = await updateProfile(data);

      const updatedUser =
        response.user ||
        response.data ||
        response;

      setProfile((previous) => ({
        ...previous,
        ...updatedUser
      }));

      // Update localStorage user
      const oldUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const newUser = {
        ...oldUser,
        ...updatedUser
      };

      localStorage.setItem(
        "user",
        JSON.stringify(newUser)
      );

      setSuccess("Profile updated successfully.");
      setIsEditing(false);

      // Clear selected file
      setFormData((previous) => ({
        ...previous,
        profileImage: null
      }));

      // Refresh profile from backend
      await fetchProfileData();

    } catch (err) {
      console.error("Update profile error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------
  // Cancel editing
  // -----------------------------------

  const handleCancelEdit = () => {
    setFormData({
      name: profile?.name || "",
      bio: profile?.bio || "",
      profileImage: null
    });

    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  // -----------------------------------
  // Favorite recipe object
  // -----------------------------------

  const getFavoriteRecipe = (favorite) => {
    return (
      favorite.recipe ||
      favorite.Recipe ||
      favorite
    );
  };

  // -----------------------------------
  // Image URL
  // -----------------------------------

  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `http://localhost:5000/${image}`;
  };

  // -----------------------------------
  // Loading
  // -----------------------------------

  if (loading) {
    return (
      <div className="profile-page">
        <Loader text="Loading profile..." />
      </div>
    );
  }

  // -----------------------------------
  // Error
  // -----------------------------------

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="profile-error">
            <h2>Profile not available</h2>

            <p>
              {error || "Something went wrong while loading your profile."}
            </p>

            <button
              className="profile-retry-btn"
              onClick={fetchProfileData}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const profileImage = getImageUrl(
    profile.profileImage
  );

  return (
    <div className="profile-page">

      <div className="container">

        {/* -------------------------------- */}
        {/* Messages */}
        {/* -------------------------------- */}

        {error && (
          <div className="profile-alert profile-alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="profile-alert profile-alert-success">
            {success}
          </div>
        )}

        {/* -------------------------------- */}
        {/* Profile Header */}
        {/* -------------------------------- */}

        <section className="profile-header">

          <div className="profile-main">

            <div className="profile-avatar-wrapper">

              {profileImage ? (
                <img
                  src={profileImage}
                  alt={profile.name}
                  className="profile-avatar"
                />
              ) : (
                <div className="profile-avatar profile-avatar-placeholder">
                  {profile.name
                    ? profile.name.charAt(0).toUpperCase()
                    : "U"}
                </div>
              )}

            </div>

            <div className="profile-info">

              <h1>
                {profile.name || "User"}
              </h1>

              <p className="profile-email">
                {profile.email}
              </p>

              {profile.bio && (
                <p className="profile-bio">
                  {profile.bio}
                </p>
              )}

              <div className="profile-stats">

                <div className="profile-stat">
                  <strong>{recipes.length}</strong>
                  <span>Recipes</span>
                </div>

                <div className="profile-stat">
                  <strong>{followers.length}</strong>
                  <span>Followers</span>
                </div>

                <div className="profile-stat">
                  <strong>{following.length}</strong>
                  <span>Following</span>
                </div>

                <div className="profile-stat">
                  <strong>{favorites.length}</strong>
                  <span>Favorites</span>
                </div>

              </div>

            </div>

          </div>

          <button
            className="profile-edit-btn"
            onClick={() => {
              setIsEditing(true);
              setError("");
              setSuccess("");
            }}
          >
            Edit Profile
          </button>

        </section>

        {/* -------------------------------- */}
        {/* Edit Profile */}
        {/* -------------------------------- */}

        {isEditing && (
          <section className="profile-edit-section">

            <div className="section-heading">
              <div>
                <h2>Edit Profile</h2>
                <p>
                  Update your personal information.
                </p>
              </div>
            </div>

            <form
              className="profile-form"
              onSubmit={handleUpdateProfile}
            >

              <div className="profile-form-grid">

                <div className="form-group">

                  <label htmlFor="name">
                    Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="email">
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={profile.email || ""}
                    disabled
                  />

                  <small>
                    Email cannot be changed.
                  </small>

                </div>

              </div>

              <div className="form-group">

                <label htmlFor="bio">
                  Bio
                </label>

                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell something about yourself..."
                  rows="4"
                />

              </div>

              <div className="form-group">

                <label htmlFor="profileImage">
                  Profile Image
                </label>

                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {formData.profileImage && (
                  <small>
                    Selected: {formData.profileImage.name}
                  </small>
                )}

              </div>

              <div className="profile-form-actions">

                <button
                  type="submit"
                  className="profile-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

                <button
                  type="button"
                  className="profile-cancel-btn"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  Cancel
                </button>

              </div>

            </form>

          </section>
        )}

        {/* -------------------------------- */}
        {/* My Recipes */}
        {/* -------------------------------- */}

        <section className="profile-section">

          <div className="section-heading">

            <div>
              <h2>My Recipes</h2>

              <p>
                Recipes you have contributed.
              </p>
            </div>

            <Link
              to="/recipes/create"
              className="section-link"
            >
              + Create Recipe
            </Link>

          </div>

          {recipes.length === 0 ? (

            <div className="empty-section">

              <div className="empty-icon">
                🍳
              </div>

              <h3>No recipes yet</h3>

              <p>
                Start sharing your favorite recipes
                with the community.
              </p>

              <Link
                to="/recipes/create"
                className="profile-action-link"
              >
                Create Your First Recipe
              </Link>

            </div>

          ) : (

            <div className="profile-recipe-grid">

              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                />
              ))}

            </div>

          )}

        </section>

        {/* -------------------------------- */}
        {/* Favorites */}
        {/* -------------------------------- */}

        <section className="profile-section">

          <div className="section-heading">

            <div>
              <h2>Favorite Recipes</h2>

              <p>
                Recipes you have saved.
              </p>
            </div>

            <Link
              to="/favorites"
              className="section-link"
            >
              View All
            </Link>

          </div>

          {favorites.length === 0 ? (

            <div className="empty-section">

              <div className="empty-icon">
                ❤️
              </div>

              <h3>No favorites yet</h3>

              <p>
                Save recipes you love and find them here.
              </p>

              <Link
                to="/"
                className="profile-action-link"
              >
                Explore Recipes
              </Link>

            </div>

          ) : (

            <div className="profile-recipe-grid">

              {favorites
                .slice(0, 4)
                .map((favorite) => {

                  const recipe =
                    getFavoriteRecipe(favorite);

                  return (
                    <RecipeCard
                      key={
                        favorite.id ||
                        recipe.id
                      }
                      recipe={recipe}
                      isFavorite={true}
                    />
                  );
                })}

            </div>

          )}

        </section>

        {/* -------------------------------- */}
        {/* Social */}
        {/* -------------------------------- */}

        <section className="profile-social-section">

          <div className="social-card">

            <div className="social-card-icon">
              👥
            </div>

            <div>
              <strong>
                {followers.length}
              </strong>

              <span>
                Followers
              </span>
            </div>

          </div>

          <div className="social-card">

            <div className="social-card-icon">
              ➕
            </div>

            <div>
              <strong>
                {following.length}
              </strong>

              <span>
                Following
              </span>
            </div>

          </div>

        </section>

      </div>

    </div>
  );
};

export default Profile;