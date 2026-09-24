const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// SWAGGER CONFIGURATION

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Recipe Management and Sharing Platform API",

      version: "1.0.0",

      description:
        "REST API for creating, sharing, discovering, rating, reviewing and managing recipes.",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local Development Server",
      },
    ],

    tags: [
      {
        name: "Authentication",
        description: "User registration and login",
      },

      {
        name: "Users",
        description: "User profiles and user recipes",
      },

      {
        name: "Recipes",
        description: "Recipe creation, browsing, searching and management",
      },

      {
        name: "Favorites",
        description: "Manage favorite recipes",
      },

      {
        name: "Collections",
        description: "Create and manage recipe collections",
      },

      {
        name: "Reviews",
        description: "Recipe ratings and reviews",
      },

      {
        name: "Follows",
        description: "Follow and unfollow users",
      },

      {
        name: "Feed",
        description: "Activity feed from followed users",
      },

      {
        name: "Admin",
        description: "Admin user and recipe management",
      },
    ],

    // JWT AUTHENTICATION

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",

          scheme: "bearer",

          bearerFormat: "JWT",
        },
      },

      // SCHEMAS

      schemas: {
        User: {
          type: "object",

          properties: {
            id: {
              type: "integer",
              example: 1,
            },

            name: {
              type: "string",
              example: "Shiva Kant Marya",
            },

            email: {
              type: "string",
              format: "email",
              example: "shiva@gmail.com",
            },

            bio: {
              type: "string",
              example: "Food lover and home chef",
            },

            profileImage: {
              type: "string",
              example: "uploads/profiles/profile.jpg",
            },

            role: {
              type: "string",
              example: "USER",
            },

            status: {
              type: "string",
              example: "APPROVED",
            },
          },
        },

        Recipe: {
          type: "object",

          properties: {
            id: {
              type: "integer",
              example: 1,
            },

            title: {
              type: "string",
              example: "Paneer Butter Masala",
            },

            description: {
              type: "string",
              example: "Creamy and delicious Indian paneer curry.",
            },

            ingredients: {
              type: "array",

              items: {
                type: "string",
              },

              example: [
                "Paneer - 250g",
                "Butter - 2 tbsp",
                "Tomato - 3",
                "Cream - 100ml",
              ],
            },

            instructions: {
              type: "array",

              items: {
                type: "string",
              },

              example: [
                "Heat butter in a pan.",
                "Add tomato puree.",
                "Add paneer and cook.",
                "Add cream and simmer.",
              ],
            },

            prepTime: {
              type: "integer",
              example: 15,
            },

            cookingTime: {
              type: "integer",
              example: 25,
            },

            servings: {
              type: "integer",
              example: 4,
            },

            difficulty: {
              type: "string",

              enum: ["EASY", "MEDIUM", "HARD"],

              example: "MEDIUM",
            },

            category: {
              type: "string",
              example: "Indian",
            },

            dietaryType: {
              type: "string",

              enum: ["VEGETARIAN", "VEGAN", "NON_VEGETARIAN", "GLUTEN_FREE"],

              example: "VEGETARIAN",
            },

            image: {
              type: "string",
              example: "uploads/recipes/recipe.jpg",
            },

            UserId: {
              type: "integer",
              example: 1,
            },
          },
        },

        Review: {
          type: "object",

          properties: {
            id: {
              type: "integer",
              example: 1,
            },

            rating: {
              type: "integer",

              minimum: 1,

              maximum: 5,

              example: 5,
            },

            comment: {
              type: "string",

              example: "Amazing recipe. Very easy to prepare.",
            },

            UserId: {
              type: "integer",
              example: 1,
            },

            RecipeId: {
              type: "integer",
              example: 1,
            },
          },
        },

        Collection: {
          type: "object",

          properties: {
            id: {
              type: "integer",
              example: 1,
            },

            name: {
              type: "string",
              example: "My Desserts",
            },

            description: {
              type: "string",
              example: "My favorite dessert recipes",
            },

            UserId: {
              type: "integer",
              example: 1,
            },
          },
        },
      },
    },
  },

  // ROUTES

  apis: [],
};

// API PATHS

const paths = {
  // AUTHENTICATION

  "/api/auth/register": {
    post: {
      tags: ["Authentication"],

      summary: "Register a new user",

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              type: "object",

              required: ["name", "email", "password"],

              properties: {
                name: {
                  type: "string",
                  example: "Shiva",
                },

                email: {
                  type: "string",
                  format: "email",
                  example: "shiva@gmail.com",
                },

                password: {
                  type: "string",
                  format: "password",
                  example: "Password@123",
                },
              },
            },
          },
        },
      },

      responses: {
        201: {
          description: "User registered successfully",
        },

        400: {
          description: "Invalid input or user already exists",
        },
      },
    },
  },

  "/api/auth/login": {
    post: {
      tags: ["Authentication"],

      summary: "Login user",

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              type: "object",

              required: ["email", "password"],

              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "shiva@gmail.com",
                },

                password: {
                  type: "string",
                  format: "password",
                  example: "Password@123",
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: "Login successful. JWT token returned.",
        },

        401: {
          description: "Invalid credentials",
        },
      },
    },
  },

  // USERS

  "/api/users/profile": {
    get: {
      tags: ["Users"],

      summary: "Get logged-in user's profile",

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        200: {
          description: "Profile fetched successfully",
        },

        401: {
          description: "Unauthorized",
        },
      },
    },

    put: {
      tags: ["Users"],

      summary: "Update logged-in user's profile",

      security: [
        {
          bearerAuth: [],
        },
      ],

      requestBody: {
        required: false,

        content: {
          "multipart/form-data": {
            schema: {
              type: "object",

              properties: {
                name: {
                  type: "string",
                  example: "Shiva Kant",
                },

                bio: {
                  type: "string",
                  example: "Food enthusiast",
                },

                profileImage: {
                  type: "string",

                  format: "binary",
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: "Profile updated successfully",
        },

        401: {
          description: "Unauthorized",
        },
      },
    },
  },

  "/api/users/{id}": {
    get: {
      tags: ["Users"],

      summary: "Get user by ID",

      parameters: [
        {
          name: "id",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 1,
        },
      ],

      responses: {
        200: {
          description: "User fetched successfully",
        },

        404: {
          description: "User not found",
        },
      },
    },
  },

  "/api/users/{id}/recipes": {
    get: {
      tags: ["Users"],

      summary: "Get recipes created by a user",

      parameters: [
        {
          name: "id",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 1,
        },
      ],

      responses: {
        200: {
          description: "User recipes fetched successfully",
        },
      },
    },
  },

  // RECIPES

  "/api/recipes": {
    get: {
      tags: ["Recipes"],

      summary: "Browse, search and filter recipes",

      parameters: [
        {
          name: "search",

          in: "query",

          schema: {
            type: "string",
          },

          description:
            "Search recipes by title, description, ingredients or category",

          example: "paneer",
        },

        {
          name: "category",

          in: "query",

          schema: {
            type: "string",
          },

          example: "Indian",
        },

        {
          name: "dietaryType",

          in: "query",

          schema: {
            type: "string",

            enum: ["VEGETARIAN", "VEGAN", "NON_VEGETARIAN", "GLUTEN_FREE"],
          },

          example: "VEGETARIAN",
        },

        {
          name: "difficulty",

          in: "query",

          schema: {
            type: "string",

            enum: ["EASY", "MEDIUM", "HARD"],
          },

          example: "EASY",
        },

        {
          name: "maxPrepTime",

          in: "query",

          schema: {
            type: "integer",
          },

          description: "Maximum preparation time in minutes",

          example: 30,
        },

        {
          name: "page",

          in: "query",

          schema: {
            type: "integer",
            default: 1,
          },

          example: 1,
        },

        {
          name: "limit",

          in: "query",

          schema: {
            type: "integer",
            default: 10,
          },

          example: 10,
        },
      ],

      responses: {
        200: {
          description: "Recipes fetched successfully",
        },
      },
    },

    post: {
      tags: ["Recipes"],

      summary: "Create a new recipe",

      security: [
        {
          bearerAuth: [],
        },
      ],

      requestBody: {
        required: true,

        content: {
          "multipart/form-data": {
            schema: {
              type: "object",

              required: [
                "title",

                "description",

                "ingredients",

                "instructions",

                "prepTime",

                "cookingTime",

                "servings",

                "difficulty",

                "category",
              ],

              properties: {
                title: {
                  type: "string",
                  example: "Paneer Butter Masala",
                },

                description: {
                  type: "string",
                  example: "Creamy Indian paneer curry",
                },

                ingredients: {
                  type: "string",

                  example: '["Paneer - 250g","Butter - 2 tbsp","Tomato - 3"]',

                  description: "JSON string containing ingredient array",
                },

                instructions: {
                  type: "string",

                  example:
                    '["Heat butter","Add tomato puree","Add paneer","Cook for 10 minutes"]',

                  description: "JSON string containing instruction array",
                },

                prepTime: {
                  type: "integer",
                  example: 15,
                },

                cookingTime: {
                  type: "integer",
                  example: 25,
                },

                servings: {
                  type: "integer",
                  example: 4,
                },

                difficulty: {
                  type: "string",

                  enum: ["EASY", "MEDIUM", "HARD"],

                  example: "MEDIUM",
                },

                category: {
                  type: "string",
                  example: "Indian",
                },

                dietaryType: {
                  type: "string",

                  enum: [
                    "VEGETARIAN",
                    "VEGAN",
                    "NON_VEGETARIAN",
                    "GLUTEN_FREE",
                  ],

                  example: "VEGETARIAN",
                },

                image: {
                  type: "string",

                  format: "binary",
                },
              },
            },
          },
        },
      },

      responses: {
        201: {
          description: "Recipe created successfully",
        },

        400: {
          description: "Invalid recipe data",
        },

        401: {
          description: "Unauthorized",
        },
      },
    },
  },

  "/api/recipes/{id}": {
    get: {
      tags: ["Recipes"],

      summary: "Get recipe by ID",

      parameters: [
        {
          name: "id",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 1,
        },
      ],

      responses: {
        200: {
          description: "Recipe fetched successfully",
        },

        404: {
          description: "Recipe not found",
        },
      },
    },

    put: {
      tags: ["Recipes"],

      summary: "Update own recipe",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "id",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 1,
        },
      ],

      requestBody: {
        required: false,

        content: {
          "multipart/form-data": {
            schema: {
              type: "object",

              properties: {
                title: {
                  type: "string",
                },

                description: {
                  type: "string",
                },

                ingredients: {
                  type: "string",
                },

                instructions: {
                  type: "string",
                },

                prepTime: {
                  type: "integer",
                },

                cookingTime: {
                  type: "integer",
                },

                servings: {
                  type: "integer",
                },

                difficulty: {
                  type: "string",

                  enum: ["EASY", "MEDIUM", "HARD"],
                },

                category: {
                  type: "string",
                },

                dietaryType: {
                  type: "string",

                  enum: [
                    "VEGETARIAN",
                    "VEGAN",
                    "NON_VEGETARIAN",
                    "GLUTEN_FREE",
                  ],
                },

                image: {
                  type: "string",

                  format: "binary",
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: "Recipe updated successfully",
        },

        401: {
          description: "Unauthorized",
        },

        403: {
          description: "User is not the recipe owner",
        },

        404: {
          description: "Recipe not found",
        },
      },
    },

    delete: {
      tags: ["Recipes"],

      summary: "Delete own recipe",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "id",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 1,
        },
      ],

      responses: {
        200: {
          description: "Recipe deleted successfully",
        },

        401: {
          description: "Unauthorized",
        },

        403: {
          description: "User is not the recipe owner",
        },

        404: {
          description: "Recipe not found",
        },
      },
    },
  },

  // FAVORITES

  "/api/favorites": {
    get: {
      tags: ["Favorites"],

      summary: "Get logged-in user's favorite recipes",

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        200: {
          description: "Favorites fetched successfully",
        },

        401: {
          description: "Unauthorized",
        },
      },
    },
  },

  "/api/favorites/{recipeId}": {
    post: {
      tags: ["Favorites"],

      summary: "Add recipe to favorites",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "recipeId",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 1,
        },
      ],

      responses: {
        201: {
          description: "Recipe added to favorites",
        },

        409: {
          description: "Recipe already in favorites",
        },
      },
    },

    delete: {
      tags: ["Favorites"],

      summary: "Remove recipe from favorites",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "recipeId",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 1,
        },
      ],

      responses: {
        200: {
          description: "Recipe removed from favorites",
        },

        404: {
          description: "Favorite not found",
        },
      },
    },
  },

  // COLLECTIONS

  "/api/collections": {
    get: {
      tags: ["Collections"],

      summary: "Get user's collections",

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        200: {
          description: "Collections fetched successfully",
        },
      },
    },

    post: {
      tags: ["Collections"],

      summary: "Create a collection",

      security: [
        {
          bearerAuth: [],
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              type: "object",

              required: ["name"],

              properties: {
                name: {
                  type: "string",
                  example: "Desserts",
                },

                description: {
                  type: "string",
                  example: "My favorite dessert recipes",
                },
              },
            },
          },
        },
      },

      responses: {
        201: {
          description: "Collection created successfully",
        },
      },
    },
  },

  "/api/collections/{id}": {
    get: {
      tags: ["Collections"],

      summary: "Get collection by ID",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "id",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 1,
        },
      ],

      responses: {
        200: {
          description: "Collection fetched successfully",
        },
      },
    },

    put: {
      tags: ["Collections"],

      summary: "Update collection",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "id",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 1,
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              type: "object",

              properties: {
                name: {
                  type: "string",
                  example: "Weekend Desserts",
                },

                description: {
                  type: "string",
                  example: "Updated description",
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: "Collection updated successfully",
        },
      },
    },

    delete: {
      tags: ["Collections"],

      summary: "Delete collection",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "id",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 1,
        },
      ],

      responses: {
        200: {
          description: "Collection deleted successfully",
        },
      },
    },
  },

  "/api/collections/{collectionId}/recipes/{recipeId}": {
    post: {
      tags: ["Collections"],

      summary: "Add recipe to collection",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "collectionId",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 1,
        },

        {
          name: "recipeId",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 5,
        },
      ],

      responses: {
        201: {
          description: "Recipe added to collection",
        },
      },
    },

    delete: {
      tags: ["Collections"],

      summary: "Remove recipe from collection",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "collectionId",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 1,
        },

        {
          name: "recipeId",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 5,
        },
      ],

      responses: {
        200: {
          description: "Recipe removed from collection",
        },
      },
    },
  },

  // REVIEWS

  "/api/reviews/recipe/{recipeId}": {
    get: {
      tags: ["Reviews"],

      summary: "Get reviews for a recipe",

      parameters: [
        {
          name: "recipeId",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 1,
        },
      ],

      responses: {
        200: {
          description: "Reviews fetched successfully",
        },
      },
    },

    post: {
      tags: ["Reviews"],

      summary: "Create a recipe review and rating",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "recipeId",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 1,
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              type: "object",

              required: ["rating", "comment"],

              properties: {
                rating: {
                  type: "integer",

                  minimum: 1,

                  maximum: 5,

                  example: 5,
                },

                comment: {
                  type: "string",

                  example: "Really tasty and easy recipe!",
                },
              },
            },
          },
        },
      },

      responses: {
        201: {
          description: "Review created successfully",
        },

        400: {
          description: "Invalid review",
        },
      },
    },
  },

  "/api/reviews/{id}": {
    put: {
      tags: ["Reviews"],

      summary: "Update your review",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "id",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 1,
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              type: "object",

              properties: {
                rating: {
                  type: "integer",

                  minimum: 1,

                  maximum: 5,

                  example: 4,
                },

                comment: {
                  type: "string",

                  example: "Updated review",
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: "Review updated successfully",
        },
      },
    },

    delete: {
      tags: ["Reviews"],

      summary: "Delete your review",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "id",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 1,
        },
      ],

      responses: {
        200: {
          description: "Review deleted successfully",
        },
      },
    },
  },

  // FOLLOWS

  "/api/follows/{userId}": {
    post: {
      tags: ["Follows"],

      summary: "Follow a user",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "userId",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 2,
        },
      ],

      responses: {
        201: {
          description: "User followed successfully",
        },

        400: {
          description: "Cannot follow yourself",
        },

        409: {
          description: "Already following this user",
        },
      },
    },

    delete: {
      tags: ["Follows"],

      summary: "Unfollow a user",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "userId",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 2,
        },
      ],

      responses: {
        200: {
          description: "User unfollowed successfully",
        },

        404: {
          description: "Follow relationship not found",
        },
      },
    },
  },

  "/api/follows/{userId}/followers": {
    get: {
      tags: ["Follows"],

      summary: "Get user's followers",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "userId",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 1,
        },
      ],

      responses: {
        200: {
          description: "Followers fetched successfully",
        },
      },
    },
  },

  "/api/follows/{userId}/following": {
    get: {
      tags: ["Follows"],

      summary: "Get users followed by a user",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "userId",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 1,
        },
      ],

      responses: {
        200: {
          description: "Following users fetched successfully",
        },
      },
    },
  },

  // FEED

  "/api/feed": {
    get: {
      tags: ["Feed"],

      summary: "Get activity feed",

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        200: {
          description: "Activity feed fetched successfully",
        },

        401: {
          description: "Unauthorized",
        },
      },
    },
  },

  // ADMIN USERS

  "/api/admin/users": {
    get: {
      tags: ["Admin"],

      summary: "Get all users",

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        200: {
          description: "Users fetched successfully",
        },

        403: {
          description: "Admin access required",
        },
      },
    },
  },

  "/api/admin/users/{id}/ban": {
    put: {
      tags: ["Admin"],

      summary: "Ban a user",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "id",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 2,
        },
      ],

      responses: {
        200: {
          description: "User banned successfully",
        },

        403: {
          description: "Admin access required",
        },
      },
    },
  },

  "/api/admin/users/{id}/approve": {
    put: {
      tags: ["Admin"],

      summary: "Approve a user",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "id",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 2,
        },
      ],

      responses: {
        200: {
          description: "User approved successfully",
        },
      },
    },
  },

  "/api/admin/users/{id}": {
    delete: {
      tags: ["Admin"],

      summary: "Delete a user",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "id",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 2,
        },
      ],

      responses: {
        200: {
          description: "User deleted successfully",
        },
      },
    },
  },

  // ADMIN RECIPES

  "/api/admin/recipes": {
    get: {
      tags: ["Admin"],

      summary: "Get all recipes for admin",

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        200: {
          description: "Recipes fetched successfully",
        },

        403: {
          description: "Admin access required",
        },
      },
    },
  },

  "/api/admin/recipes/{id}": {
    delete: {
      tags: ["Admin"],

      summary: "Delete recipe by admin",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "id",

          in: "path",

          required: true,

          schema: {
            type: "integer",
          },

          example: 1,
        },
      ],

      responses: {
        200: {
          description: "Recipe deleted successfully by admin",
        },

        403: {
          description: "Admin access required",
        },

        404: {
          description: "Recipe not found",
        },
      },
    },
  },
};

// ADD PATHS TO SWAGGER DOCUMENT

options.definition.paths = paths;

// GENERATE SWAGGER SPEC

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerSpec,
  swaggerUi,
};


// Browser Link

// http://localhost:5000/api-docs