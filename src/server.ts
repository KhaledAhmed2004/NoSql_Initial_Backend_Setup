import app from "./app";
import { Server } from "http";
import mongoose from "mongoose";
import config from "./app/config";

let server: Server; // Holds the server instance

async function main() {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(config.db_uri as string);

    // Start the server
    server = app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error); // Log startup errors
  }
}

main(); // Initialize the app

// Handle unhandled promise rejections
process.on("unhandledRejection", () => {
  console.error("Unhandled promise rejection detected, shutting down...");

  if (server) {
    // Gracefully stop the server and exit
    server.close(() => process.exit(1));
  } else {
    process.exit(1); // Exit immediately
  }
});

// Handle uncaught exceptions
process.on("uncaughtException", () => {
  console.error("Uncaught exception detected, shutting down...");
  process.exit(1); // Exit immediately
});
