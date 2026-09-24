# Recipe Management & Sharing Platform

A full-stack web application where users can create, share, discover, save, review, and organize recipes.

The project focuses primarily on backend API development using Node.js, Express.js, Sequelize, MySQL, and JWT authentication, with a React frontend for testing and demonstrating the APIs.

---

## 🚀 Features

### 👤 User Authentication & Profile

- User registration
- User login
- JWT-based authentication
- View user profile
- Update profile information
- Upload profile image
- View user's contributed recipes
- View favorite recipes

### 🍳 Recipe Management

- Create recipes
- Edit recipes
- Delete recipes
- View recipe details
- Browse all recipes
- Search recipes by keywords
- Search by ingredients
- Filter recipes by:
  - Category
  - Dietary type
  - Difficulty
  - Preparation time
- Recipe image upload

### ❤️ Favorites

- Add recipe to favorites
- Remove recipe from favorites
- View all favorite recipes

### 📚 Collections

- Create recipe collections
- View collections
- Update collections
- Delete collections
- Add recipes to collections
- Remove recipes from collections

### ⭐ Reviews & Ratings

- Add reviews and ratings
- View recipe reviews
- Update your review
- Delete your review

### 👥 Follow System

- Follow users
- Unfollow users
- View followers
- View following users

### 📰 Activity Feed

- View activity feed
- Track activities such as:
  - Recipe creation
  - Following users
  - Adding favorites
  - Reviews

### 🛠️ Admin Features

- View all users
- Ban users
- Approve users
- Delete users
- View all recipes
- Remove recipes

### 📖 API Documentation

The backend APIs are documented using Swagger.

Swagger UI is available at:

`http://localhost:5000/api-docs`

---

# 🏗️ Tech Stack

## Backend

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT Authentication
- bcrypt
- Multer
- Swagger
- REST APIs

## Frontend

- React.js
- React Router
- Axios
- Vite
- CSS

## Development Tools

- Git
- GitHub
- VS Code
- Postman

---

# 📁 Project Structure

```text
recipe-management/
│
├── backend/
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── recipeController.js
│   │   ├── favoriteController.js
│   │   ├── collectionController.js
│   │   ├── reviewController.js
│   │   ├── followController.js
│   │   ├── feedController.js
│   │   └── adminController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Recipe.js
│   │   ├── Favorite.js
│   │   ├── Collection.js
│   │   ├── CollectionRecipe.js
│   │   ├── Review.js
│   │   ├── Follow.js
│   │   ├── Activity.js
│   │   └── index.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── recipeRoutes.js
│   │   ├── favoriteRoutes.js
│   │   ├── collectionRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── followRoutes.js
│   │   ├── feedRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── createActivity.js
│   │
│   ├── docs/
│   │   └── swagger.js
│   │
│   ├── uploads/
│   │   ├── profiles/
│   │   └── recipes/
│   │
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
