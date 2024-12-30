# Types of Errors in Applications  

#### 1. **Operational Errors**  
   - **Definition**: Errors that occur due to external factors or predictable issues in the system's operation.  
   - **Examples**:  
     - Database connection failure.  
     - Invalid user input.  
     - Network timeouts.  
   - **Where They Occur**:  
     - Handled within the application (e.g., Express error-handling middleware).  

---

#### 2. **Programmatic Errors**  
   - **Definition**: Errors caused by mistakes in the code written by the developer.  
   - **Examples**:  
     - Undefined variable access.  
     - Syntax errors.  
     - Logic errors.  
   - **Where They Occur**:  
     - Handled within the application (e.g., using `try-catch` blocks).  

---

#### 3. **Uncaught Exceptions**  
   - **Definition**: Errors that occur in synchronous code but are not wrapped in error-handling mechanisms.  
   - **Examples**:  
     - Accessing a property on `undefined`.  
     - Throwing an error that isn't caught.  
   - **Where They Occur**:  
     - Inside or outside the application.  
   - **How to Handle**:  
     - Use `process.on('uncaughtException', callback)` to handle globally.  

#### 4. **Unhandled Rejections**  
   - **Definition**: Errors that occur in asynchronous code when a `Promise` is rejected but not handled with `.catch()`.  
   - **Examples**:  
     - Forgetting to handle a rejected `Promise`.  
     - API call failing without a `catch` block.  
   - **Where They Occur**:  
     - Inside or outside the application.  
   - **How to Handle**:  
     - Use `process.on('unhandledRejection', callback)` to handle globally.  


### Key Points:  
- **Operational and Programmatic Errors**: Typically occur **within the application** and are handled using tools like middleware or error-handling mechanisms.  
- **Uncaught Exceptions and Unhandled Rejections**: Can occur **inside or outside the application** and require global error-handling mechanisms.  

# Understanding Global Error Handler in Express

In an **Express** application, a **global error handler** is a special middleware function designed to handle all errors that occur during the execution of your application. It ensures that all unhandled errors are captured in a single place, allowing you to:
- Log errors for debugging.
- Send user-friendly error messages to the client.
- Avoid redundant error-handling code across routes.

### **How Errors Are Detected**

In Express, you can pass an error to the next middleware by using `next(error)`. When you call `next()` with an argument (e.g., `next(error)`), Express:

- Treats it as an error.
- Skips the regular middleware and routes.
- Forwards the error to the global error handler.

---

### **Structure of a Global Error Handler**

A global error handler is defined using **four parameters**:

```javascript
app.use((err, req, res, next) => {
    // Handle the error here
});
```

1. **`err`**: The error object passed to `next(err)` containing details like the error message, stack trace, etc.
2. **`req`**: The HTTP request object.
3. **`res`**: The HTTP response object.
4. **`next`**: A function to forward the error to another error handler (rarely used).

---

### **Key Responsibilities of a Global Error Handler**

1. **Log the Error**: Helps track errors in development and production for debugging.
   ```javascript
   console.error(err.stack);
   ```

2. **Customize the Error Response**: Sends a meaningful response to the client. Sensitive details like stack traces should only be exposed in development.
   
3. **Ensure Consistency**: Provides a standard format for error responses.

---

### **Example Implementation**

Here is an example of a robust global error handler in TypeScript:

```typescript
import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { TErrorSources } from "../interface/error";
import config from "../config";
import AppError from "../errors/AppError";
import handleDuplicateError from "../errors/handleDuplicateError";
import handleZodError from "../errors/handleZodError";
import handleValidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";

// Global error handler for catching different types of errors
const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  // Default values for error response
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSource: TErrorSources = [
    {
      path: "",
      message: "Something went wrong!",
    },
  ];

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSources;
  }
  // Handle Mongoose validation errors
  else if (error?.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSources;
  }
  // Handle MongoDB cast errors (invalid object IDs)
  else if (error?.name === "CastError") {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSources;
  }
  // Handle MongoDB duplicate key errors
  else if (error?.code === 11000) {
    const simplifiedError = handleDuplicateError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSources;
  }
  // Handle custom AppError
  else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorSource = [
      {
        path: "",
        message: error.message,
      },
    ];
  }
  // Handle general errors
  else if (error instanceof Error) {
    message = error.message;
    errorSource = [
      {
        path: "",
        message: error.message,
      },
    ];
  }

  // Final response with error details
  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    stack: config.NODE_ENV === "development" ? error.stack : null,
  });
};

export default globalErrorHandler;
```

---

### **Key Features of the Global Error Handler**

1. **Default Error Response**:
   - The handler initializes default values for the error response:
     ```typescript
     let statusCode = 500;
     let message = "Something went wrong!";
     let errorSource = [
       {
         path: "",
         message: "Something went wrong!",
       },
     ];
     ```
   - These values are overwritten if a specific error type is encountered.

2. **Handling Specific Error Types**:
   The middleware uses conditional checks to identify the error type and processes it accordingly:

   - **Zod Validation Errors**:
     Handled using `handleZodError` utility to update response with validation details.
     ```typescript
     if (error instanceof ZodError) {
       const simplifiedError = handleZodError(error);
       statusCode = simplifiedError.statusCode;
       message = simplifiedError.message;
       errorSource = simplifiedError.errorSources;
     }
     ```

   - **Mongoose Validation Errors**:
     Handled using `handleValidationError` to provide better error messages.
     ```typescript
     else if (error?.name === "ValidationError") {
       const simplifiedError = handleValidationError(error);
       statusCode = simplifiedError.statusCode;
       message = simplifiedError.message;
       errorSource = simplifiedError.errorSources;
     }
     ```

   - **MongoDB Cast Errors**:
     Handled for invalid object IDs or types.
     ```typescript
     else if (error?.name === "CastError") {
       const simplifiedError = handleCastError(error);
       statusCode = simplifiedError.statusCode;
       message = simplifiedError.message;
       errorSource = simplifiedError.errorSources;
     }
     ```

   - **MongoDB Duplicate Key Errors**:
     Identifies duplicate key errors (e.g., unique field violations).
     ```typescript
     else if (error?.code === 11000) {
       const simplifiedError = handleDuplicateError(error);
       statusCode = simplifiedError.statusCode;
       message = simplifiedError.message;
       errorSource = simplifiedError.errorSources;
     }
     ```

   - **Custom Application Errors (`AppError`)**:
     For developer-defined errors.
     ```typescript
     else if (error instanceof AppError) {
       statusCode = error.statusCode;
       message = error.message;
       errorSource = [
         {
           path: "",
           message: error.message,
         },
       ];
     }
     ```

   - **Generic Errors**:
     For other errors.
     ```typescript
     else if (error instanceof Error) {
       message = error.message;
       errorSource = [
         {
           path: "",
           message: error.message,
         },
       ];
     }
     ```

3. **Environment-Based Response**:
  Differentiate between development and production environments to provide detailed stack traces in development:
   ```typescript
   res.status(statusCode).json({
     success: false,
     message,
     errorSource,
     stack: config.NODE_ENV === "development" ? error.stack : null,
   });
   ```
   - The `stack` trace is included only in the development environment.

---

### **Detailed Error Flow**

1. **Error Occurrence**:
   - An error is thrown or passed using `next(error)` in any route or middleware.

2. **Forwarding to Global Error Handler**:
   - Express will bypass regular middleware and routes and invoke the global error handler.

3. **Error Processing**:
   - The global error handler checks the error type and processes it accordingly.

4. **Error Response**:
   - A structured JSON response is sent back to the client with relevant details.
  
# utility of globel error handaler
Here is a more organized version of the provided explanation:

---

## Global Error Handlers

### 1. `handleZodError` (Zod Validation Errors)
#### **Purpose**
The `handleZodError` function processes errors thrown by Zod validation and formats them into a readable and structured format for the application.

#### **Code Breakdown**

1. **Input**: Takes in a `ZodError` object containing validation issues from Zod.
2. **Mapping Zod Issues**: 
   ```ts
   const errorSources: TErrorSources = error.issues.map((issue: ZodIssue) => {
     return {
       path: issue?.path[issue.path.length - 1], // Last index of issue path
       message: issue?.message, // Error message
     };
   });
   ```
   - **`path`**: Extracts the last element of the path array to identify the field where the error occurred.
   - **`message`**: The error message explaining what went wrong.

3. **Status Code**: 
   ```ts
   const statusCode = 400; // Bad Request
   ```

4. **Returning Response**:
   ```ts
   return {
     statusCode,
     message: "Validation Error",
     errorSources,
   };
   ```

#### **Response Structure**
- **`statusCode`**: `400` (Bad Request)
- **`message`**: "Validation Error"
- **`errorSources`**: Array of error details (field and error message).

---

### 2. `handleValidationError` (Mongoose Validation Errors)
#### **Purpose**
The `handleValidationError` function handles validation errors thrown by Mongoose when a document fails schema validation.

#### **Code Breakdown**

1. **Input**: Takes in a `ValidationError` object from Mongoose.
2. **Mapping Validation Errors**: 
   ```ts
   const errorSources: TErrorSources = Object.values(error.errors).map(
     (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
       return {
         path: val?.path, // Error field path
         message: val?.message, // Error message
       };
     }
   );
   ```
   - **`path`**: The field that caused the error.
   - **`message`**: A description of the validation error.

3. **Status Code**: 
   ```ts
   const statusCode = 400; // Bad Request
   ```

4. **Returning Response**:
   ```ts
   return {
     statusCode,
     message: "Validation Error",
     errorSources,
   };
   ```

#### **Response Structure**
- **`statusCode`**: `400` (Bad Request)
- **`message`**: "Validation Error"
- **`errorSources`**: Array of error details.

---

### 3. `handleCastError` (Mongoose Cast Errors)
#### **Purpose**
The `handleCastError` function handles MongoDB `CastError` instances, which occur when Mongoose fails to cast a value to a specific type (e.g., invalid `ObjectId`).

#### **Code Breakdown**

1. **Input**: Takes in a `mongoose.Error.CastError`.
2. **Extracting Error Details**: 
   ```ts
   const errorSources: TErrorSources = [
     { path: error.path, message: error.message }, // Provide error path and message
   ];
   ```

3. **Status Code**: 
   ```ts
   const statusCode = 400; // Bad Request
   ```

4. **Returning Response**:
   ```ts
   return {
     statusCode,
     message: "Invalid ID",
     errorSources,
   };
   ```

#### **Response Structure**
- **`statusCode`**: `400` (Bad Request)
- **`message`**: "Invalid ID"
- **`errorSources`**: Array with details about the casting error.

---

### 4. `handleDuplicateError` (MongoDB Duplicate Key Errors)
#### **Purpose**
The `handleDuplicateError` function processes MongoDB errors caused by duplicate key violations, such as attempting to insert a document with an existing unique value (e.g., duplicate email).

#### **Code Breakdown**

1. **Input**: Takes in a generic `error` object containing the duplicate key error message.
2. **Extracting the Duplicate Value**: 
   ```ts
   const match = error.message.match(/"([^"]*)"/);
   const extractedMessage = match && match[1];
   ```

3. **Constructing Error Source**:
   ```ts
   const errorSources: TErrorSources = [
     { path: "", message: `${extractedMessage} already exists` },
   ];
   ```

4. **Status Code**: 
   ```ts
   const statusCode = 400; // Bad Request
   ```

5. **Returning Response**:
   ```ts
   return {
     statusCode,
     message: "Duplicate Key Error",
     errorSources,
   };
   ```

#### **Response Structure**
- **`statusCode`**: `400` (Bad Request)
- **`message`**: "Duplicate Key Error"
- **`errorSources`**: Details about the duplicate key (e.g., `"test@example.com already exists"`).








## Unhandled Promise Rejection and Uncaught Exception handled on `server.ts` file

```ts
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

```

### 1. **Unhandled Promise Rejection**

When a promise is rejected and there is no `.catch()` handler attached to it, the `unhandledRejection` event is triggered. Instead of allowing the application to crash, the code ensures a graceful shutdown. Here’s how it works:

```js
process.on("unhandledRejection", () => {
  console.error("Unhandled promise rejection detected, shutting down...");

  if (server) {
    server.close(() => process.exit(1));  // Gracefully close the server before exiting
  } else {
    process.exit(1);  // Exit immediately if the server is not running
  }
});
```

- **Explanation**:
  - **Graceful shutdown**: The server is closed first to ensure that any ongoing requests are handled before the process exits.
  - **Exit process**: After shutting down the server, the process exits with status code `1`, indicating an error.

This approach prevents sudden termination of the application, ensuring that resources like open connections are properly closed before exiting.

### 2. **Uncaught Exception**

The `uncaughtException` event is triggered when an exception occurs and is not caught by any `try-catch` block. In this case, the application will exit immediately to prevent the app from running in an unstable state.

```js
process.on("uncaughtException", () => {
  console.error("Uncaught exception detected, shutting down...");
  process.exit(1);  // Exit immediately
});
```

- **Explanation**:
  - The application logs the error message for diagnostic purposes.
  - The process is immediately exited with status code `1`.

This ensures that the application doesn't continue running after an uncaught error, which might cause further issues.

