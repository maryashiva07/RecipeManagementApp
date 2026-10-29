// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// import RecipeCard from "../../components/RecipeCard/RecipeCard";
// import Loader from "../../components/Loader/Loader";

// import {
//   getMyProfile,
//   getAllUsers,
//   updateProfile,
//   getUserRecipes,
// } from "../../services/userService";

// import {
//   getFollowers,
//   getFollowing,
//   getFavorites,
//   followUser,
//   unfollowUser,
// } from "../../services/socialService";

// import "./Profile.css";

// const Profile = () => {
//   const [profile, setProfile] = useState(null);

//   const [recipes, setRecipes] = useState([]);

//   const [favorites, setFavorites] = useState([]);

//   const [followers, setFollowers] = useState([]);

//   const [following, setFollowing] = useState([]);

//   const [allUsers, setAllUsers] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const [saving, setSaving] = useState(false);

//   const [error, setError] = useState("");

//   const [success, setSuccess] = useState("");

//   const [isEditing, setIsEditing] = useState(false);

//   const [socialModal, setSocialModal] = useState(null);

//   const [followLoading, setFollowLoading] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     bio: "",
//     profileImage: null,
//   });

//   // Fetch profile data

//   const fetchProfileData = async () => {
//     try {
//       setLoading(true);

//       setError("");

//       const profileResponse = await getMyProfile();

//       const user = profileResponse.user || profileResponse;

//       setProfile(user);

//       setFormData({
//         name: user.name || "",
//         bio: user.bio || "",
//         profileImage: null,
//       });

//       // Get user's recipes

//       if (user.id) {
//         try {
//           const recipesResponse = await getUserRecipes(user.id);

//           setRecipes(recipesResponse.recipes || recipesResponse.data || []);
//         } catch (recipeError) {
//           console.error("User recipes error:", recipeError);

//           setRecipes([]);
//         }
//       }

//       // Get favorites

//       try {
//         const favoritesResponse = await getFavorites();

//         const favoriteData =
//           favoritesResponse.favorites || favoritesResponse.data || [];

//         setFavorites(favoriteData);
//       } catch (favoriteError) {
//         console.error("Favorites error:", favoriteError);

//         setFavorites([]);
//       }

//       // Get followers

//       try {
//         const followersResponse = await getFollowers(user.id);

//         setFollowers(
//           followersResponse.followers || followersResponse.data || [],
//         );
//       } catch (followersError) {
//         console.error("Followers error:", followersError);

//         setFollowers([]);
//       }

//       // Get following

//       try {
//         const followingResponse = await getFollowing(user.id);

//         setFollowing(
//           followingResponse.following || followingResponse.data || [],
//         );
//       } catch (followingError) {
//         console.error("Following error:", followingError);

//         setFollowing([]);
//       }

//       // Get all users

//       try {
//         const usersResponse = await getAllUsers();

//         setAllUsers(usersResponse.users || usersResponse.data || []);
//       } catch (usersError) {
//         console.error("All users error:", usersError);

//         setAllUsers([]);
//       }
//     } catch (err) {
//       console.error("Profile fetch error:", err);

//       setError(err.response?.data?.message || "Unable to load profile.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfileData();
//   }, []);

//   // Input change

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     setFormData((previous) => ({
//       ...previous,
//       [name]: value,
//     }));
//   };

//   // Profile image

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];

//     if (!file) {
//       return;
//     }

//     setFormData((previous) => ({
//       ...previous,
//       profileImage: file,
//     }));
//   };

//   // Update profile

//   const handleUpdateProfile = async (event) => {
//     event.preventDefault();

//     try {
//       setSaving(true);

//       setError("");

//       setSuccess("");

//       const data = new FormData();

//       data.append("name", formData.name);

//       data.append("bio", formData.bio);

//       if (formData.profileImage) {
//         data.append("profileImage", formData.profileImage);
//       }

//       const response = await updateProfile(data);

//       const updatedUser = response.user || response.data || response;

//       setProfile((previous) => ({
//         ...previous,
//         ...updatedUser,
//       }));

//       // Update localStorage user

//       const oldUser = JSON.parse(localStorage.getItem("user") || "{}");

//       const newUser = {
//         ...oldUser,
//         ...updatedUser,
//       };

//       localStorage.setItem("user", JSON.stringify(newUser));

//       setSuccess("Profile updated successfully.");

//       setIsEditing(false);

//       setFormData((previous) => ({
//         ...previous,
//         profileImage: null,
//       }));

//       await fetchProfileData();
//     } catch (err) {
//       console.error("Update profile error:", err);

//       setError(err.response?.data?.message || "Unable to update profile.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Cancel editing

//   const handleCancelEdit = () => {
//     setFormData({
//       name: profile?.name || "",
//       bio: profile?.bio || "",
//       profileImage: null,
//     });

//     setIsEditing(false);

//     setError("");

//     setSuccess("");
//   };

//   // Get favorite recipe

//   const getFavoriteRecipe = (favorite) => {
//     return favorite.recipe || favorite.Recipe || favorite;
//   };

//   // Profile image URL

//   const getImageUrl = (image) => {
//     if (!image) {
//       return null;
//     }

//     if (image.startsWith("http")) {
//       return image;
//     }

//     return `http://localhost:5000/${image.replace(/^\/+/, "")}`;
//   };

//   // Open social modal

//   const handleSocialModal = (type) => {
//     setSocialModal(type);

//     setError("");
//   };

//   // Close social modal

//   const closeSocialModal = () => {
//     setSocialModal(null);
//   };

//   // Get actual user from follower object

//   const getSocialUser = (item, type) => {
//     if (type === "followers") {
//       return item.follower || item.user || item;
//     }

//     // Following modal now contains
//     // all users

//     return item;
//   };

//   // Check if user is already following

//   const checkIsFollowing = (userId) => {
//     return following.some((item) => {
//       const followedUser = item.following || item.user || item;

//       return Number(followedUser?.id) === Number(userId);
//     });
//   };

//   // Follow / unfollow user

//   const handleFollowToggle = async (userId, isFollowing) => {
//     try {
//       setFollowLoading(userId);

//       setError("");

//       if (isFollowing) {
//         await unfollowUser(userId);
//       } else {
//         await followUser(userId);
//       }

//       // Refresh following

//       const followingResponse = await getFollowing(profile.id);

//       const updatedFollowing =
//         followingResponse.following || followingResponse.data || [];

//       setFollowing(updatedFollowing);

//       // Refresh followers

//       const followersResponse = await getFollowers(profile.id);

//       setFollowers(followersResponse.followers || followersResponse.data || []);
//     } catch (followError) {
//       console.error("Follow/unfollow error:", followError);

//       setError(
//         followError.response?.data?.message ||
//           "Unable to update follow status.",
//       );
//     } finally {
//       setFollowLoading(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="profile-page">
//         <Loader text="Loading profile..." />
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="profile-page">
//         <div className="container">
//           <div className="profile-error">
//             <h2>Profile not available</h2>

//             <p>{error || "Something went wrong while loading your profile."}</p>

//             <button className="profile-retry-btn" onClick={fetchProfileData}>
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const profileImage = getImageUrl(profile.profileImage);

//   // Followers show only actual followers.
//   //
//   // Following shows all other users so
//   // user can discover and follow them.

//   const socialUsers =
//     socialModal === "followers"
//       ? followers
//       : allUsers.filter((user) => Number(user.id) !== Number(profile.id));

//   return (
//     <div className="profile-page">
//       <div className="container">
//         {/* Messages */}

//         {error && (
//           <div className="profile-alert profile-alert-error">{error}</div>
//         )}

//         {success && (
//           <div className="profile-alert profile-alert-success">{success}</div>
//         )}

//         {/* Profile Header */}

//         <section className="profile-header">
//           <div className="profile-main">
//             <div className="profile-avatar-wrapper">
//               {profileImage ? (
//                 <img
//                   src={profileImage}
//                   alt={profile.name}
//                   className="profile-avatar"
//                   onError={(event) => {
//                     event.currentTarget.style.display = "none";

//                     if (event.currentTarget.nextElementSibling) {
//                       event.currentTarget.nextElementSibling.style.display =
//                         "flex";
//                     }
//                   }}
//                 />
//               ) : null}

//               <div
//                 className="profile-avatar profile-avatar-placeholder"
//                 style={{
//                   display: profileImage ? "none" : "flex",
//                 }}
//               >
//                 {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
//               </div>
//             </div>

//             <div className="profile-info">
//               <h1>{profile.name || "User"}</h1>

//               <p className="profile-email">{profile.email}</p>

//               {profile.bio && <p className="profile-bio">{profile.bio}</p>}

//               <div className="profile-stats">
//                 <div className="profile-stat">
//                   <strong>{recipes.length}</strong>

//                   <span>Recipes</span>
//                 </div>

//                 <div
//                   className="profile-stat profile-stat-clickable"
//                   onClick={() => handleSocialModal("followers")}
//                 >
//                   <strong>{followers.length}</strong>

//                   <span>Followers</span>
//                 </div>

//                 <div
//                   className="profile-stat profile-stat-clickable"
//                   onClick={() => handleSocialModal("following")}
//                 >
//                   <strong>{following.length}</strong>

//                   <span>Following</span>
//                 </div>

//                 <div className="profile-stat">
//                   <strong>{favorites.length}</strong>

//                   <span>Favorites</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <button
//             className="profile-edit-btn"
//             onClick={() => {
//               setIsEditing(true);

//               setError("");

//               setSuccess("");
//             }}
//           >
//             Edit Profile
//           </button>
//         </section>

//         {/* Edit Profile */}

//         {isEditing && (
//           <section className="profile-edit-section">
//             <div className="section-heading">
//               <div>
//                 <h2>Edit Profile</h2>

//                 <p>Update your personal information.</p>
//               </div>
//             </div>

//             <form className="profile-form" onSubmit={handleUpdateProfile}>
//               <div className="profile-form-grid">
//                 <div className="form-group">
//                   <label htmlFor="name">Name</label>

//                   <input
//                     id="name"
//                     name="name"
//                     type="text"
//                     value={formData.name}
//                     onChange={handleChange}
//                     placeholder="Enter your name"
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="email">Email</label>

//                   <input
//                     id="email"
//                     type="email"
//                     value={profile.email || ""}
//                     disabled
//                   />

//                   <small>Email cannot be changed.</small>
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label htmlFor="bio">Bio</label>

//                 <textarea
//                   id="bio"
//                   name="bio"
//                   value={formData.bio}
//                   onChange={handleChange}
//                   placeholder="Tell something about yourself..."
//                   rows="4"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="profileImage">Profile Image</label>

//                 <input
//                   id="profileImage"
//                   name="profileImage"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                 />

//                 {formData.profileImage && (
//                   <small>Selected: {formData.profileImage.name}</small>
//                 )}
//               </div>

//               <div className="profile-form-actions">
//                 <button
//                   type="submit"
//                   className="profile-save-btn"
//                   disabled={saving}
//                 >
//                   {saving ? "Saving..." : "Save Changes"}
//                 </button>

//                 <button
//                   type="button"
//                   className="profile-cancel-btn"
//                   onClick={handleCancelEdit}
//                   disabled={saving}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </section>
//         )}

//         {/* My Recipes */}

//         <section className="profile-section">
//           <div className="section-heading">
//             <div>
//               <h2>My Recipes</h2>

//               <p>Recipes you have contributed.</p>
//             </div>

//             <Link to="/recipes/create" className="section-link">
//               + Create Recipe
//             </Link>
//           </div>

//           {recipes.length === 0 ? (
//             <div className="empty-section">
//               <div className="empty-icon">🍳</div>

//               <h3>No recipes yet</h3>

//               <p>Start sharing your favorite recipes with the community.</p>

//               <Link to="/recipes/create" className="profile-action-link">
//                 Create Your First Recipe
//               </Link>
//             </div>
//           ) : (
//             <div className="profile-recipe-grid">
//               {recipes.map((recipe) => (
//                 <RecipeCard key={recipe.id} recipe={recipe} />
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Favorites */}

//         <section className="profile-section">
//           <div className="section-heading">
//             <div>
//               <h2>Favorite Recipes</h2>

//               <p>Recipes you have saved.</p>
//             </div>

//             <Link to="/favorites" className="section-link">
//               View All
//             </Link>
//           </div>

//           {favorites.length === 0 ? (
//             <div className="empty-section">
//               <div className="empty-icon">❤️</div>

//               <h3>No favorites yet</h3>

//               <p>Save recipes you love and find them here.</p>

//               <Link to="/" className="profile-action-link">
//                 Explore Recipes
//               </Link>
//             </div>
//           ) : (
//             <div className="profile-recipe-grid">
//               {favorites.slice(0, 4).map((favorite) => {
//                 const recipe = getFavoriteRecipe(favorite);

//                 return (
//                   <RecipeCard
//                     key={favorite.id || recipe.id}
//                     recipe={recipe}
//                     isFavorite={true}
//                   />
//                 );
//               })}
//             </div>
//           )}
//         </section>

//         {/* Social */}

//         <section className="profile-social-section">
//           <div
//             className="social-card social-card-clickable"
//             onClick={() => handleSocialModal("followers")}
//           >
//             <div className="social-card-icon">👥</div>

//             <div>
//               <strong>{followers.length}</strong>

//               <span>Followers</span>
//             </div>
//           </div>

//           <div
//             className="social-card social-card-clickable"
//             onClick={() => handleSocialModal("following")}
//           >
//             <div className="social-card-icon">➕</div>

//             <div>
//               <strong>{following.length}</strong>

//               <span>Following</span>
//             </div>
//           </div>
//         </section>

//         {/* Followers / Following Modal */}

//         {socialModal && (
//           <div className="social-modal-overlay" onClick={closeSocialModal}>
//             <div
//               className="social-modal"
//               onClick={(event) => event.stopPropagation()}
//             >
//               <div className="social-modal-header">
//                 <h2>
//                   {socialModal === "followers" ? "Followers" : "Following"}
//                 </h2>

//                 <button
//                   className="social-modal-close"
//                   onClick={closeSocialModal}
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="social-modal-body">
//                 {socialUsers.length === 0 ? (
//                   <div className="social-empty">
//                     <div>👥</div>

//                     <p>
//                       {socialModal === "followers"
//                         ? "No followers yet."
//                         : "No other users found."}
//                     </p>
//                   </div>
//                 ) : (
//                   socialUsers.map((item) => {
//                     const socialUser = getSocialUser(item, socialModal);

//                     if (!socialUser) {
//                       return null;
//                     }

//                     const isFollowing = checkIsFollowing(socialUser.id);

//                     const userImage = getImageUrl(socialUser.profileImage);

//                     return (
//                       <div className="social-user-item" key={socialUser.id}>
//                         <div className="social-user-info">
//                           <div className="social-user-avatar">
//                             {userImage ? (
//                               <img
//                                 src={userImage}
//                                 alt={socialUser.name}
//                                 onError={(event) => {
//                                   event.currentTarget.style.display = "none";

//                                   if (event.currentTarget.nextElementSibling) {
//                                     event.currentTarget.nextElementSibling.style.display =
//                                       "flex";
//                                   }
//                                 }}
//                               />
//                             ) : null}

//                             <span
//                               style={{
//                                 display: userImage ? "none" : "flex",
//                               }}
//                             >
//                               {socialUser.name
//                                 ? socialUser.name.charAt(0).toUpperCase()
//                                 : "U"}
//                             </span>
//                           </div>

//                           <div className="social-user-details">
//                             <strong>{socialUser.name}</strong>

//                             {socialUser.bio && <p>{socialUser.bio}</p>}
//                           </div>
//                         </div>

//                         {Number(socialUser.id) !== Number(profile.id) && (
//                           <button
//                             className={
//                               isFollowing
//                                 ? "social-follow-btn following"
//                                 : "social-follow-btn"
//                             }
//                             disabled={followLoading === socialUser.id}
//                             onClick={() =>
//                               handleFollowToggle(socialUser.id, isFollowing)
//                             }
//                           >
//                             {followLoading === socialUser.id
//                               ? "..."
//                               : isFollowing
//                                 ? "Following"
//                                 : "Follow"}
//                           </button>
//                         )}
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;





import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import RecipeCard from "../../components/RecipeCard/RecipeCard";
import Loader from "../../components/Loader/Loader";

import {
  getMyProfile,
  getAllUsers,
  updateProfile,
  getUserRecipes,
} from "../../services/userService";

import {
  getFollowers,
  getFollowing,
  getFavorites,
  followUser,
  unfollowUser,
} from "../../services/socialService";

import "./Profile.css";

// Backend URL from .env
const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [socialModal, setSocialModal] = useState(null);
  const [followLoading, setFollowLoading] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profileImage: null,
  });

  // Convert relative image paths into backend URLs
  const getImageUrl = (image) => {
    if (!image || typeof image !== "string") {
      return null;
    }

    // Already an absolute URL
    if (/^https?:\/\//i.test(image)) {
      return image;
    }

    // Handle paths such as:
    // uploads/profiles/image.jpg
    // /uploads/profiles/image.jpg
    return `${BACKEND_URL}/${image.replace(/^\/+/, "")}`;
  };

  // Fetch profile and related data
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
        profileImage: null,
      });

      // Get user's recipes
      if (user.id) {
        try {
          const recipesResponse = await getUserRecipes(user.id);

          setRecipes(recipesResponse.recipes || recipesResponse.data || []);
        } catch (recipeError) {
          console.error("User recipes error:", recipeError);
          setRecipes([]);
        }
      }

      // Get favorites
      try {
        const favoritesResponse = await getFavorites();

        setFavorites(
          favoritesResponse.favorites || favoritesResponse.data || [],
        );
      } catch (favoriteError) {
        console.error("Favorites error:", favoriteError);
        setFavorites([]);
      }

      // Get followers
      try {
        const followersResponse = await getFollowers(user.id);

        setFollowers(
          followersResponse.followers || followersResponse.data || [],
        );
      } catch (followersError) {
        console.error("Followers error:", followersError);
        setFollowers([]);
      }

      // Get following
      try {
        const followingResponse = await getFollowing(user.id);

        setFollowing(
          followingResponse.following || followingResponse.data || [],
        );
      } catch (followingError) {
        console.error("Following error:", followingError);
        setFollowing([]);
      }

      // Get all users
      try {
        const usersResponse = await getAllUsers();

        setAllUsers(usersResponse.users || usersResponse.data || []);
      } catch (usersError) {
        console.error("All users error:", usersError);
        setAllUsers([]);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);

      setError(err.response?.data?.message || "Unable to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Input change
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Profile image selection
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    setError("");

    setFormData((previous) => ({
      ...previous,
      profileImage: file,
    }));
  };

  // Update profile
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
        response.user || response.data?.user || response.data || response;

      setProfile((previous) => ({
        ...previous,
        ...updatedUser,
      }));

      // Update localStorage user
      try {
        const oldUser = JSON.parse(localStorage.getItem("user") || "{}");

        const newUser = {
          ...oldUser,
          ...updatedUser,
        };

        localStorage.setItem("user", JSON.stringify(newUser));
      } catch (storageError) {
        console.error("Local storage update error:", storageError);
      }

      setSuccess("Profile updated successfully.");
      setIsEditing(false);

      setFormData((previous) => ({
        ...previous,
        profileImage: null,
      }));

      // Refresh profile data from backend
      await fetchProfileData();
    } catch (err) {
      console.error("Update profile error:", err);

      setError(err.response?.data?.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setFormData({
      name: profile?.name || "",
      bio: profile?.bio || "",
      profileImage: null,
    });

    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  // Get favorite recipe
  const getFavoriteRecipe = (favorite) => {
    return favorite.recipe || favorite.Recipe || favorite;
  };

  // Open social modal
  const handleSocialModal = (type) => {
    setSocialModal(type);
    setError("");
  };

  // Close social modal
  const closeSocialModal = () => {
    setSocialModal(null);
  };

  // Get actual user from follower object
  const getSocialUser = (item, type) => {
    if (type === "followers") {
      return item.follower || item.user || item;
    }

    return item;
  };

  // Check whether user is already following
  const checkIsFollowing = (userId) => {
    return following.some((item) => {
      const followedUser = item.following || item.user || item;

      return Number(followedUser?.id) === Number(userId);
    });
  };

  // Follow / unfollow user
  const handleFollowToggle = async (userId, isFollowing) => {
    try {
      setFollowLoading(userId);
      setError("");

      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }

      // Refresh following
      const followingResponse = await getFollowing(profile.id);

      setFollowing(followingResponse.following || followingResponse.data || []);

      // Refresh followers
      const followersResponse = await getFollowers(profile.id);

      setFollowers(followersResponse.followers || followersResponse.data || []);
    } catch (followError) {
      console.error("Follow/unfollow error:", followError);

      setError(
        followError.response?.data?.message ||
          "Unable to update follow status.",
      );
    } finally {
      setFollowLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Loader text="Loading profile..." />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="profile-error">
            <h2>Profile not available</h2>

            <p>{error || "Something went wrong while loading your profile."}</p>

            <button className="profile-retry-btn" onClick={fetchProfileData}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const profileImage = getImageUrl(profile.profileImage);

  // Followers shows actual followers.
  // Following modal lists other users for discovery.
  const socialUsers =
    socialModal === "followers"
      ? followers
      : allUsers.filter((user) => Number(user.id) !== Number(profile.id));

  return (
    <div className="profile-page">
      <div className="container">
        {/* Messages */}
        {error && (
          <div className="profile-alert profile-alert-error">{error}</div>
        )}

        {success && (
          <div className="profile-alert profile-alert-success">{success}</div>
        )}

        {/* Profile Header */}
        <section className="profile-header">
          <div className="profile-main">
            <div className="profile-avatar-wrapper">
              {profileImage && (
                <img
                  src={profileImage}
                  alt={profile.name || "Profile"}
                  className="profile-avatar"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";

                    const placeholder = event.currentTarget.nextElementSibling;

                    if (placeholder) {
                      placeholder.style.display = "flex";
                    }
                  }}
                />
              )}

              <div
                className="profile-avatar profile-avatar-placeholder"
                style={{
                  display: profileImage ? "none" : "flex",
                }}
              >
                {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
              </div>
            </div>

            <div className="profile-info">
              <h1>{profile.name || "User"}</h1>

              <p className="profile-email">{profile.email}</p>

              {profile.bio && <p className="profile-bio">{profile.bio}</p>}

              <div className="profile-stats">
                <div className="profile-stat">
                  <strong>{recipes.length}</strong>
                  <span>Recipes</span>
                </div>

                <div
                  className="profile-stat profile-stat-clickable"
                  onClick={() => handleSocialModal("followers")}
                >
                  <strong>{followers.length}</strong>
                  <span>Followers</span>
                </div>

                <div
                  className="profile-stat profile-stat-clickable"
                  onClick={() => handleSocialModal("following")}
                >
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

        {/* Edit Profile */}
        {isEditing && (
          <section className="profile-edit-section">
            <div className="section-heading">
              <div>
                <h2>Edit Profile</h2>
                <p>Update your personal information.</p>
              </div>
            </div>

            <form className="profile-form" onSubmit={handleUpdateProfile}>
              <div className="profile-form-grid">
                <div className="form-group">
                  <label htmlFor="name">Name</label>

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
                  <label htmlFor="email">Email</label>

                  <input
                    id="email"
                    type="email"
                    value={profile.email || ""}
                    disabled
                  />

                  <small>Email cannot be changed.</small>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>

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
                <label htmlFor="profileImage">Profile Image</label>

                <input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {formData.profileImage && (
                  <small>Selected: {formData.profileImage.name}</small>
                )}
              </div>

              <div className="profile-form-actions">
                <button
                  type="submit"
                  className="profile-save-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
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

        {/* My Recipes */}
        <section className="profile-section">
          <div className="section-heading">
            <div>
              <h2>My Recipes</h2>
              <p>Recipes you have contributed.</p>
            </div>

            <Link to="/recipes/create" className="section-link">
              + Create Recipe
            </Link>
          </div>

          {recipes.length === 0 ? (
            <div className="empty-section">
              <div className="empty-icon">🍳</div>

              <h3>No recipes yet</h3>

              <p>Start sharing your favorite recipes with the community.</p>

              <Link to="/recipes/create" className="profile-action-link">
                Create Your First Recipe
              </Link>
            </div>
          ) : (
            <div className="profile-recipe-grid">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </section>

        {/* Favorites */}
        <section className="profile-section">
          <div className="section-heading">
            <div>
              <h2>Favorite Recipes</h2>
              <p>Recipes you have saved.</p>
            </div>

            <Link to="/favorites" className="section-link">
              View All
            </Link>
          </div>

          {favorites.length === 0 ? (
            <div className="empty-section">
              <div className="empty-icon">❤️</div>

              <h3>No favorites yet</h3>

              <p>Save recipes you love and find them here.</p>

              <Link to="/" className="profile-action-link">
                Explore Recipes
              </Link>
            </div>
          ) : (
            <div className="profile-recipe-grid">
              {favorites.slice(0, 4).map((favorite) => {
                const recipe = getFavoriteRecipe(favorite);

                return (
                  <RecipeCard
                    key={favorite.id || recipe.id}
                    recipe={recipe}
                    isFavorite={true}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* Social */}
        <section className="profile-social-section">
          <div
            className="social-card social-card-clickable"
            onClick={() => handleSocialModal("followers")}
          >
            <div className="social-card-icon">👥</div>

            <div>
              <strong>{followers.length}</strong>
              <span>Followers</span>
            </div>
          </div>

          <div
            className="social-card social-card-clickable"
            onClick={() => handleSocialModal("following")}
          >
            <div className="social-card-icon">➕</div>

            <div>
              <strong>{following.length}</strong>
              <span>Following</span>
            </div>
          </div>
        </section>

        {/* Followers / Following Modal */}
        {socialModal && (
          <div className="social-modal-overlay" onClick={closeSocialModal}>
            <div
              className="social-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="social-modal-header">
                <h2>
                  {socialModal === "followers" ? "Followers" : "Following"}
                </h2>

                <button
                  className="social-modal-close"
                  onClick={closeSocialModal}
                >
                  ×
                </button>
              </div>

              <div className="social-modal-body">
                {socialUsers.length === 0 ? (
                  <div className="social-empty">
                    <div>👥</div>

                    <p>
                      {socialModal === "followers"
                        ? "No followers yet."
                        : "No other users found."}
                    </p>
                  </div>
                ) : (
                  socialUsers.map((item) => {
                    const socialUser = getSocialUser(item, socialModal);

                    if (!socialUser) {
                      return null;
                    }

                    const isFollowing = checkIsFollowing(socialUser.id);

                    // Profile images also use VITE_BACKEND_URL
                    const userImage = getImageUrl(socialUser.profileImage);

                    return (
                      <div className="social-user-item" key={socialUser.id}>
                        <div className="social-user-info">
                          <div className="social-user-avatar">
                            {userImage && (
                              <img
                                src={userImage}
                                alt={socialUser.name || "User"}
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";

                                  const placeholder =
                                    event.currentTarget.nextElementSibling;

                                  if (placeholder) {
                                    placeholder.style.display = "flex";
                                  }
                                }}
                              />
                            )}

                            <span
                              style={{
                                display: userImage ? "none" : "flex",
                              }}
                            >
                              {socialUser.name
                                ? socialUser.name.charAt(0).toUpperCase()
                                : "U"}
                            </span>
                          </div>

                          <div className="social-user-details">
                            <strong>{socialUser.name || "User"}</strong>

                            {socialUser.bio && <p>{socialUser.bio}</p>}
                          </div>
                        </div>

                        {Number(socialUser.id) !== Number(profile.id) && (
                          <button
                            className={
                              isFollowing
                                ? "social-follow-btn following"
                                : "social-follow-btn"
                            }
                            disabled={followLoading === socialUser.id}
                            onClick={() =>
                              handleFollowToggle(socialUser.id, isFollowing)
                            }
                          >
                            {followLoading === socialUser.id
                              ? "..."
                              : isFollowing
                                ? "Following"
                                : "Follow"}
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
