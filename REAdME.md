# Node.js RESTful API Server with PostgreSQL

This repository contains the source code for a RESTful API server built with Node.js and PostgreSQL. The API server provides endpoints for managing resources such as users, posts, comments, etc.

## Prerequisites

Before running this server, ensure you have the following installed:

- Node.js and npm
- PostgreSQL

## Getting Started

1. **Clone this repository:**

    ```bash
    git clone https://github.com/ahmed-226/RESTfull_pg_nodejs.git
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up the PostgreSQL database:**

    - Create a PostgreSQL database.
    - Update the database configuration in `.env` file.

4. **Run the server:**

    ```bash
    npm run dev
    ```

5. The server should now be running locally at `http://localhost:3000`.

## Configuration

This server uses environment variables for configuration. Create a `.env` file in the root directory of the project and add the following:

```env
// Exapmle for data base string
DATA_BASE_URL=postgresql://<username>:<password>@<hostname>:<port>/<database_name>

```

API Endpoints
The following endpoints are available:

1. Categories
- GET /api/categories: Retrieve all categories.
- GET /api/categories/:id: Retrieve a specific category by ID.
- POST /api/categories: Create a new category.
- PUT /api/categories/:id: Update an existing category.
- DELETE /api/categories/:id: Delete a category.


2. Products
- GET /api/products: Retrieve all products.
- GET /api/products/:id: Retrieve a specific product by ID.
- GET /api/products/category/:id: Retrieve a specific product by category.
- POST /api/products: Create a new product.
- PUT /api/products/:id: Update an existing product.
- DELETE /api/products/:id: Delete a product.

## Contributing
Contributions are welcome! Feel free to submit pull requests or open issues for any bugs or feature requests.