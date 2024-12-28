
## Express Router Setup for Modular Routing

This code snippet demonstrates a clean and modular approach to setting up routes in an Express application. Here's a breakdown of the process:

### 1. **Purpose**
- To organize application routes in a modular and scalable way.
- Centralize all route definitions in one place for better maintainability.

### 2. **Code Breakdown**

#### **a. Importing Required Modules**
```javascript
import { Router } from "express";
import { UserRouter } from "../modules/user/user.routes";
```
- **`Router`**: A utility from Express used to create modular route handlers.

#### **b. Creating the Router Instance**
```javascript
const router = Router();
```
- Creates a new router instance (`router`) that will act as the central hub for all routes.

#### **c. Defining Routes**
```javascript
const moduleRoutes = [
  { path: "/auth", route: UserRouter },
  // Add more routes as needed
];
```
- **`moduleRoutes`**: An array of objects, where each object defines:
  - **`path`**: The base URL path for the module.
  - **`route`**: The router module to handle requests for this path.
- Example:
  - The `UserRouter` is mounted at the `/auth` path. All routes inside `UserRouter` will now be prefixed with `/auth`.

#### **d. Attaching Routes to the Central Router**
```javascript
moduleRoutes.forEach((route) => router.use(route.path, route.route));
```
- Iterates over the `moduleRoutes` array and attaches each route to the central router (`router`).
- **`router.use(path, route)`**: Mounts the specified route handler at the given path.

#### **e. Exporting the Central Router**
```javascript
export default router;
```
- Exports the `router` so it can be imported and used in the main application file (usually `app.js` or `server.js`).

### 4. **Adding More Routes**
To add more modules, simply include additional entries in the `moduleRoutes` array:
```javascript
const moduleRoutes = [
  { path: "/auth", route: UserRouter },
  { path: "/products", route: ProductRouter }, // Example for a Products module
];
```

### 5. **Usage in Main Application**
In the main application file (e.g., `app.js`), import the central router and use it:
```javascript
import express from "express";
import router from "./routes"; // Adjust the path as needed

const app = express();
app.use("/api/v1", router); // All routes will now be prefixed with `/api/v1`
```
