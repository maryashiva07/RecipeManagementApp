import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";

import {
  getCollections,
  createCollection,
  deleteCollection
} from "../../services/socialService";

import "./Collections.css";

const Collections = () => {
  const [collections, setCollections] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCollections();

      setCollections(
        response.collections ||
          response.data ||
          []
      );
    } catch (error) {
      console.error("Collections fetch error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load collections."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleCreateCollection = async event => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Collection name is required.");
      return;
    }

    try {
      setCreating(true);

      const response = await createCollection({
        name: name.trim(),
        description: description.trim()
      });

      const newCollection =
        response.collection ||
        response.data ||
        response;

      if (newCollection?.id) {
        setCollections(previous => [
          newCollection,
          ...previous
        ]);
      } else {
        await fetchCollections();
      }

      setName("");
      setDescription("");

      setSuccess("Collection created successfully.");
    } catch (error) {
      console.error("Create collection error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create collection."
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCollection = async id => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this collection?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteCollection(id);

      setCollections(previous =>
        previous.filter(collection =>
          Number(collection.id) !== Number(id)
        )
      );

      setSuccess("Collection deleted successfully.");
    } catch (error) {
      console.error("Delete collection error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to delete collection."
      );
    }
  };

  if (loading) {
    return (
      <div className="collections-page">
        <Loader text="Loading collections..." />
      </div>
    );
  }

  return (
    <div className="collections-page">
      <div className="collections-container">

        <div className="collections-header">
          <span className="collections-badge">
            Organize Your Recipes
          </span>

          <h1>My Collections</h1>

          <p>
            Create custom collections and organize your
            favorite recipes your way.
          </p>
        </div>

        {(error || success) && (
          <div
            className={
              error
                ? "collection-message collection-error"
                : "collection-message collection-success"
            }
          >
            {error || success}
          </div>
        )}

        {/* CREATE COLLECTION */}

        <section className="create-collection-card">

          <div className="create-collection-heading">
            <div className="collection-plus">+</div>

            <div>
              <h2>Create Collection</h2>
              <p>
                Give your collection a name and description.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleCreateCollection}
            className="collection-form"
          >

            <div className="collection-form-group">
              <label htmlFor="collectionName">
                Collection Name
              </label>

              <input
                id="collectionName"
                type="text"
                value={name}
                onChange={event =>
                  setName(event.target.value)
                }
                placeholder="e.g. Weekend Breakfast"
              />
            </div>

            <div className="collection-form-group">
              <label htmlFor="collectionDescription">
                Description
              </label>

              <textarea
                id="collectionDescription"
                rows="3"
                value={description}
                onChange={event =>
                  setDescription(event.target.value)
                }
                placeholder="What recipes belong in this collection?"
              />
            </div>

            <Button
              type="submit"
              loading={creating}
              disabled={creating}
            >
              Create Collection
            </Button>

          </form>
        </section>

        {/* COLLECTION LIST */}

        <section className="collection-list-section">

          <div className="collection-list-heading">
            <h2>Your Collections</h2>
            <span>
              {collections.length} collection
              {collections.length !== 1 ? "s" : ""}
            </span>
          </div>

          {collections.length === 0 ? (
            <div className="collections-empty">

              <div className="empty-collection-icon">
                📚
              </div>

              <h3>No Collections Yet</h3>

              <p>
                Create your first collection to organize
                recipes.
              </p>

            </div>
          ) : (
            <div className="collections-grid">

              {collections.map(collection => (
                <div
                  className="collection-card"
                  key={collection.id}
                >

                  <div className="collection-card-top">
                    <div className="collection-icon">
                      📖
                    </div>

                    <button
                      type="button"
                      className="collection-delete"
                      onClick={() =>
                        handleDeleteCollection(
                          collection.id
                        )
                      }
                    >
                      ×
                    </button>
                  </div>

                  <h3>{collection.name}</h3>

                  <p>
                    {collection.description ||
                      "No description added."}
                  </p>

                  <div className="collection-card-footer">

                    <span>
                      {collection.recipes?.length || 0}{" "}
                      recipes
                    </span>

                    <Link
                      to={`/collections/${collection.id}`}
                    >
                      View Collection →
                    </Link>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </div>
  );
};

export default Collections;