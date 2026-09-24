import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createRecipe } from "../../services/recipeService";

import "./CreateRecipe.css";

const CreateRecipe = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prepTime: "",
    cookingTime: "",
    servings: "",
    difficulty: "Easy",
    category: "",
    dietaryType: ""
  });

  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================
  // Normal input change
  // =========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // =========================================
  // Ingredient change
  // =========================================

  const handleIngredientChange = (index, value) => {
    setIngredients((previous) => {
      const updated = [...previous];

      updated[index] = value;

      return updated;
    });
  };

  // =========================================
  // Add ingredient
  // =========================================

  const addIngredient = () => {
    setIngredients((previous) => [
      ...previous,
      ""
    ]);
  };

  // =========================================
  // Remove ingredient
  // =========================================

  const removeIngredient = (index) => {
    if (ingredients.length === 1) {
      return;
    }

    setIngredients((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  // =========================================
  // Instruction change
  // =========================================

  const handleInstructionChange = (index, value) => {
    setInstructions((previous) => {
      const updated = [...previous];

      updated[index] = value;

      return updated;
    });
  };

  // =========================================
  // Add instruction
  // =========================================

  const addInstruction = () => {
    setInstructions((previous) => [
      ...previous,
      ""
    ]);
  };

  // =========================================
  // Remove instruction
  // =========================================

  const removeInstruction = (index) => {
    if (instructions.length === 1) {
      return;
    }

    setInstructions((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  // =========================================
  // Image change
  // =========================================

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setImage(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setError("");
    setImage(file);
  };

  // =========================================
  // Submit
  // =========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // -------------------------------
      // Basic validation
      // -------------------------------

      if (!formData.title.trim()) {
        setError("Recipe title is required.");
        return;
      }

      if (!formData.description.trim()) {
        setError("Recipe description is required.");
        return;
      }

      const validIngredients = ingredients
        .map((item) => item.trim())
        .filter(Boolean);

      if (validIngredients.length === 0) {
        setError("Please add at least one ingredient.");
        return;
      }

      const validInstructions = instructions
        .map((item) => item.trim())
        .filter(Boolean);

      if (validInstructions.length === 0) {
        setError("Please add at least one instruction.");
        return;
      }

      // -------------------------------
      // Create FormData
      // -------------------------------

      const data = new FormData();

      data.append(
        "title",
        formData.title.trim()
      );

      data.append(
        "description",
        formData.description.trim()
      );

      data.append(
        "prepTime",
        formData.prepTime
      );

      data.append(
        "cookingTime",
        formData.cookingTime
      );

      data.append(
        "servings",
        formData.servings
      );

      data.append(
        "difficulty",
        formData.difficulty
      );

      data.append(
        "category",
        formData.category.trim()
      );

      data.append(
        "dietaryType",
        formData.dietaryType
      );

      // Backend parses these JSON strings
      data.append(
        "ingredients",
        JSON.stringify(validIngredients)
      );

      data.append(
        "instructions",
        JSON.stringify(validInstructions)
      );

      if (image) {
        data.append("image", image);
      }

      // -------------------------------
      // API call
      // -------------------------------

      const response = await createRecipe(data);

      setSuccess("Recipe created successfully.");

      const createdRecipe =
        response.recipe ||
        response.data ||
        response;

      // -------------------------------
      // Redirect to recipe details
      // -------------------------------

      if (createdRecipe?.id) {
        navigate(`/recipes/${createdRecipe.id}`);
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error("Create recipe error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to create recipe."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-recipe-page">

      <div className="container">

        {/* ================================= */}
        {/* Header */}
        {/* ================================= */}

        <div className="create-recipe-header">

          <div>
            <span className="create-recipe-badge">
              🍳 Recipe Creator
            </span>

            <h1>
              Create a New Recipe
            </h1>

            <p>
              Share your favorite recipe with the RecipeHub community.
            </p>
          </div>

        </div>

        {/* ================================= */}
        {/* Alerts */}
        {/* ================================= */}

        {error && (
          <div className="create-alert create-alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="create-alert create-alert-success">
            {success}
          </div>
        )}

        {/* ================================= */}
        {/* Form */}
        {/* ================================= */}

        <form
          className="create-recipe-form"
          onSubmit={handleSubmit}
        >

          {/* ================================= */}
          {/* Basic Information */}
          {/* ================================= */}

          <section className="create-form-section">

            <div className="create-section-title">

              <span>
                01
              </span>

              <div>
                <h2>
                  Basic Information
                </h2>

                <p>
                  Tell us about your recipe.
                </p>
              </div>

            </div>

            <div className="form-group">

              <label htmlFor="title">
                Recipe Title *
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Creamy Butter Chicken"
                required
              />

            </div>

            <div className="form-group">

              <label htmlFor="description">
                Description *
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your recipe..."
                rows="5"
                required
              />

            </div>

          </section>

          {/* ================================= */}
          {/* Recipe Details */}
          {/* ================================= */}

          <section className="create-form-section">

            <div className="create-section-title">

              <span>
                02
              </span>

              <div>
                <h2>
                  Recipe Details
                </h2>

                <p>
                  Add cooking information and category.
                </p>
              </div>

            </div>

            <div className="recipe-details-grid">

              <div className="form-group">

                <label htmlFor="prepTime">
                  Prep Time
                </label>

                <input
                  id="prepTime"
                  name="prepTime"
                  type="number"
                  min="0"
                  value={formData.prepTime}
                  onChange={handleChange}
                  placeholder="15"
                />

                <small>
                  Minutes
                </small>

              </div>

              <div className="form-group">

                <label htmlFor="cookingTime">
                  Cooking Time
                </label>

                <input
                  id="cookingTime"
                  name="cookingTime"
                  type="number"
                  min="0"
                  value={formData.cookingTime}
                  onChange={handleChange}
                  placeholder="30"
                />

                <small>
                  Minutes
                </small>

              </div>

              <div className="form-group">

                <label htmlFor="servings">
                  Servings
                </label>

                <input
                  id="servings"
                  name="servings"
                  type="number"
                  min="1"
                  value={formData.servings}
                  onChange={handleChange}
                  placeholder="4"
                />

                <small>
                  People
                </small>

              </div>

              <div className="form-group">

                <label htmlFor="difficulty">
                  Difficulty
                </label>

                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                >
                  <option value="Easy">
                    Easy
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="Hard">
                    Hard
                  </option>
                </select>

              </div>

              <div className="form-group">

                <label htmlFor="category">
                  Category
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Indian"
                />

              </div>

              <div className="form-group">

                <label htmlFor="dietaryType">
                  Dietary Type
                </label>

                <select
                  id="dietaryType"
                  name="dietaryType"
                  value={formData.dietaryType}
                  onChange={handleChange}
                >

                  <option value="">
                    Select type
                  </option>

                  <option value="VEGETARIAN">
                    Vegetarian
                  </option>

                  <option value="VEGAN">
                    Vegan
                  </option>

                  <option value="GLUTEN_FREE">
                    Gluten-Free
                  </option>

                  <option value="NON_VEGETARIAN">
                    Non-Vegetarian
                  </option>

                </select>

              </div>

            </div>

          </section>

          {/* ================================= */}
          {/* Ingredients */}
          {/* ================================= */}

          <section className="create-form-section">

            <div className="create-section-title">

              <span>
                03
              </span>

              <div>
                <h2>
                  Ingredients
                </h2>

                <p>
                  List all ingredients required.
                </p>
              </div>

            </div>

            <div className="dynamic-list">

              {ingredients.map((ingredient, index) => (

                <div
                  className="dynamic-input-row"
                  key={index}
                >

                  <div className="dynamic-number">
                    {index + 1}
                  </div>

                  <input
                    type="text"
                    value={ingredient}
                    onChange={(event) =>
                      handleIngredientChange(
                        index,
                        event.target.value
                      )
                    }
                    placeholder={`Ingredient ${index + 1}`}
                  />

                  <button
                    type="button"
                    className="remove-item-btn"
                    onClick={() =>
                      removeIngredient(index)
                    }
                    disabled={ingredients.length === 1}
                    title="Remove ingredient"
                  >
                    ×
                  </button>

                </div>

              ))}

            </div>

            <button
              type="button"
              className="add-item-btn"
              onClick={addIngredient}
            >
              + Add Ingredient
            </button>

          </section>

          {/* ================================= */}
          {/* Instructions */}
          {/* ================================= */}

          <section className="create-form-section">

            <div className="create-section-title">

              <span>
                04
              </span>

              <div>
                <h2>
                  Instructions
                </h2>

                <p>
                  Explain how to prepare the recipe step by step.
                </p>
              </div>

            </div>

            <div className="dynamic-list">

              {instructions.map((instruction, index) => (

                <div
                  className="instruction-input-row"
                  key={index}
                >

                  <div className="instruction-number">
                    {index + 1}
                  </div>

                  <textarea
                    value={instruction}
                    onChange={(event) =>
                      handleInstructionChange(
                        index,
                        event.target.value
                      )
                    }
                    placeholder={`Step ${index + 1}`}
                    rows="3"
                  />

                  <button
                    type="button"
                    className="remove-item-btn instruction-remove"
                    onClick={() =>
                      removeInstruction(index)
                    }
                    disabled={instructions.length === 1}
                    title="Remove step"
                  >
                    ×
                  </button>

                </div>

              ))}

            </div>

            <button
              type="button"
              className="add-item-btn"
              onClick={addInstruction}
            >
              + Add Step
            </button>

          </section>

          {/* ================================= */}
          {/* Image */}
          {/* ================================= */}

          <section className="create-form-section">

            <div className="create-section-title">

              <span>
                05
              </span>

              <div>
                <h2>
                  Recipe Image
                </h2>

                <p>
                  Add an attractive image of your dish.
                </p>
              </div>

            </div>

            <div className="image-upload-area">

              <label
                htmlFor="recipeImage"
                className="image-upload-box"
              >

                <div className="upload-icon">
                  📷
                </div>

                <strong>
                  {image
                    ? image.name
                    : "Choose Recipe Image"}
                </strong>

                <span>
                  JPG, JPEG, PNG or WEBP
                </span>

              </label>

              <input
                id="recipeImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />

            </div>

            {image && (
              <div className="selected-image">

                <img
                  src={URL.createObjectURL(image)}
                  alt="Recipe preview"
                />

                <div>
                  <strong>
                    Image selected
                  </strong>

                  <p>
                    {image.name}
                  </p>

                  <button
                    type="button"
                    onClick={() => setImage(null)}
                  >
                    Remove Image
                  </button>
                </div>

              </div>
            )}

          </section>

          {/* ================================= */}
          {/* Submit */}
          {/* ================================= */}

          <div className="create-form-actions">

            <button
              type="button"
              className="cancel-create-btn"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="publish-recipe-btn"
              disabled={loading}
            >
              {loading
                ? "Publishing..."
                : "Publish Recipe"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateRecipe;

