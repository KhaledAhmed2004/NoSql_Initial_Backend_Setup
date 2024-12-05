import { Router } from "express";
import { DemoRoutes } from "../modules/demo/demo.routes"; // Replace with real Routs

const router = Router(); // Create a new Router instance

// Define paths and their route handlers
const moduleRoutes = [
  { path: "/demo", route: DemoRoutes },
  // Add more routes as needed
];

// Add each route to the router
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router; // Export the router to be used in the main app
