import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";

import {
  getRecipeById,
  updateRecipe,
  deleteRecipe
} from "../../services/recipeService";

import "./EditRecipe.css";

const parseData = value => {
  if (!value) return [""];

  if (Array.isArray(value)) {
    return value.length ? value : [""];
  }

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed.length ? parsed : [""];
    }

    return [String(parsed)];
  } catch {
    const result = String(value)
      .split("\n")
      .map(item => item.trim())
      .filter(Boolean);

    return result.length ? result : [""];
  }
};

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);

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
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getRecipeById(id);

        const recipeData =
          response.recipe ||
          response.data ||
          response;

        if (!recipeData) {
          throw new Error("Recipe not found.");
        }

        setRecipe(recipeData);

        setFormData({
          title: recipeData.title || "",
          description: recipeData.description || "",
          prepTime: recipeData.prepTime ?? "",
          cookingTime: recipeData.cookingTime ?? "",
          servings: recipeData.servings ?? "",
          difficulty: recipeData.difficulty || "Easy",
          category: recipeData.category || "",
          dietaryType: recipeData.dietaryType || ""
        });

        setIngredients(parseData(recipeData.ingredients));
        setInstructions(parseData(recipeData.instructions));

        if (recipeData.image) {
          setImagePreview(
            recipeData.image.startsWith("http")
              ? recipeData.image
              : `http://localhost:5000/${recipeData.image}`
          );
        }
      } catch (error) {
        console.error("Fetch recipe error:", error);

        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load recipe."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleChange = event => {
    const { name, value } = event.target;

    setFormData(previous => ({
      ...previous,
      [name]: value
    }));
  };

  const handleIngredientChange = (index, value) => {
    setIngredients(previous => {
      const updated = [...previous];
      updated[index] = value;
      return updated;
    });
  };

  const addIngredient = () => {
    setIngredients(previous => [...previous, ""]);
  };

  const removeIngredient = index => {
    if (ingredients.length === 1) {
      setIngredients([""]);
      return;
    }

    setIngredients(previous =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const handleInstructionChange = (index, value) => {
    setInstructions(previous => {
      const updated = [...previous];
      updated[index] = value;
      return updated;
    });
  };

  const addInstruction = () => {
    setInstructions(previous => [...previous, ""]);
  };

  const removeInstruction = index => {
    if (instructions.length === 1) {
      setInstructions([""]);
      return;
    }

    setInstructions(previous =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const handleImageChange = event => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    setImage(selectedFile);

    const previewUrl = URL.createObjectURL(selectedFile);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanIngredients = ingredients
      .map(item => item.trim())
      .filter(Boolean);

    const cleanInstructions = instructions
      .map(item => item.trim())
      .filter(Boolean);

    if (!formData.title.trim()) {
      setError("Recipe title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Recipe description is required.");
      return;
    }

    if (!cleanIngredients.length) {
      setError("Please add at least one ingredient.");
      return;
    }

    if (!cleanInstructions.length) {
      setError("Please add at least one instruction.");
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      data.append("title", formData.title.trim());
      data.append("description", formData.description.trim());
      data.append("prepTime", formData.prepTime);
      data.append("cookingTime", formData.cookingTime);
      data.append("servings", formData.servings);
      data.append("difficulty", formData.difficulty);
      data.append("category", formData.category.trim());
      data.append("dietaryType", formData.dietaryType);

      data.append(
        "ingredients",
        JSON.stringify(cleanIngredients)
      );

      data.append(
        "instructions",
        JSON.stringify(cleanInstructions)
      );

      if (image) {
        data.append("image", image);
      }

      const response = await updateRecipe(id, data);

      const updatedRecipe =
        response.recipe ||
        response.data ||
        response;

      setSuccess("Recipe updated successfully.");

      const recipeId = updatedRecipe?.id || id;

      setTimeout(() => {
        navigate(`/recipes/${recipeId}`);
      }, 800);
    } catch (error) {
      console.error("Update recipe error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update recipe."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this recipe?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await deleteRecipe(id);

      navigate("/profile");
    } catch (error) {
      console.error("Delete recipe error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to delete recipe."
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-recipe-page">
        <Loader text="Loading recipe..." />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="edit-recipe-page">
        <div className="edit-recipe-container">
          <div className="edit-error-box">
            {error || "Recipe not found."}
          </div>

          <Button onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-recipe-page">
      <div className="edit-recipe-container">

        <div className="edit-recipe-header">
          <div>
            <span className="edit-recipe-badge">
              Update Recipe
            </span>

            <h1>Edit Recipe</h1>

            <p>
              Update your recipe details, ingredients,
              instructions or image.
            </p>
          </div>
        </div>

        {error && (
          <div className="edit-message edit-error">
            {error}
          </div>
        )}

        {success && (
          <div className="edit-message edit-success">
            {success}
          </div>
        )}

        <form
          className="edit-recipe-form"
          onSubmit={handleSubmit}
        >

          {/* BASIC INFORMATION */}

          <section className="edit-form-section">
            <div className="section-heading">
              <h2>Basic Information</h2>
              <p>Update the basic information of your recipe.</p>
            </div>

            <div className="form-group">
              <label htmlFor="title">
                Recipe Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter recipe title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your recipe..."
              />
            </div>
          </section>

          {/* COOKING DETAILS */}

          <section className="edit-form-section">
            <div className="section-heading">
              <h2>Cooking Details</h2>
              <p>
                Update preparation and cooking information.
              </p>
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label htmlFor="prepTime">
                  Preparation Time (minutes)
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
              </div>

              <div className="form-group">
                <label htmlFor="cookingTime">
                  Cooking Time (minutes)
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
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
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
                  placeholder="Indian, Dessert, Breakfast..."
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
                    Select dietary type
                  </option>
                  <option value="Vegetarian">
                    Vegetarian
                  </option>
                  <option value="Vegan">
                    Vegan
                  </option>
                  <option value="Gluten-Free">
                    Gluten-Free
                  </option>
                  <option value="Non-Vegetarian">
                    Non-Vegetarian
                  </option>
                </select>
              </div>

            </div>
          </section>

          {/* INGREDIENTS */}

          <section className="edit-form-section">
            <div className="section-heading">
              <h2>Ingredients</h2>
              <p>Add or update ingredients.</p>
            </div>

            <div className="dynamic-list">

              {ingredients.map((ingredient, index) => (
                <div
                  className="dynamic-item"
                  key={index}
                >
                  <span className="item-number">
                    {index + 1}
                  </span>

                  <input
                    type="text"
                    value={ingredient}
                    onChange={event =>
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
                    aria-label="Remove ingredient"
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

          {/* INSTRUCTIONS */}

          <section className="edit-form-section">
            <div className="section-heading">
              <h2>Instructions</h2>
              <p>
                Update the cooking steps in the correct order.
              </p>
            </div>

            <div className="dynamic-list">

              {instructions.map((instruction, index) => (
                <div
                  className="dynamic-item instruction-item"
                  key={index}
                >
                  <span className="item-number">
                    {index + 1}
                  </span>

                  <textarea
                    rows="3"
                    value={instruction}
                    onChange={event =>
                      handleInstructionChange(
                        index,
                        event.target.value
                      )
                    }
                    placeholder={`Step ${index + 1}`}
                  />

                  <button
                    type="button"
                    className="remove-item-btn"
                    onClick={() =>
                      removeInstruction(index)
                    }
                    aria-label="Remove instruction"
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

          {/* IMAGE */}

          <section className="edit-form-section">
            <div className="section-heading">
              <h2>Recipe Image</h2>
              <p>
                Keep the current image or upload a new one.
              </p>
            </div>

            {imagePreview && (
              <div className="image-preview-wrapper">
                <img
                  src={imagePreview}
                  alt="Recipe preview"
                  className="recipe-image-preview"
                />
              </div>
            )}

            <div className="file-input-wrapper">
              <label htmlFor="recipeImage">
                Choose New Image
              </label>

              <input
                id="recipeImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {image && (
                <p className="selected-file">
                  Selected: {image.name}
                </p>
              )}
            </div>
          </section>

          {/* ACTIONS */}

          <div className="edit-actions">

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(`/recipes/${id}`)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={saving}
              disabled={saving || deleting}
            >
              Update Recipe
            </Button>

            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              loading={deleting}
              disabled={saving || deleting}
            >
              Delete Recipe
            </Button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditRecipe;