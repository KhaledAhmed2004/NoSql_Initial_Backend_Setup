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

## `CatchAsync` Utility

The `catchAsync` function is a middleware utility for handling asynchronous errors in Express route handlers. Express route handlers typically return a promise (e.g., when you work with databases or external APIs), and if any of those promises fail, the error will be unhandled unless explicitly caught.

### Breakdown of the Code:

1. **Function Declaration**:
   ```ts
   const catchAsync = (fn: RequestHandler) => { ... };
   ```
   The `catchAsync` function is a higher-order function, meaning it takes another function `fn` (which is a request handler) as its argument and returns a new function that includes error handling.

2. **Wrapper for Request Handler**:
   ```ts
   return (req: Request, res: Response, next: NextFunction) => { ... };
   ```
   This returned function is the actual middleware that will replace the original request handler (`fn`). It takes the standard Express parameters: `req`, `res`, and `next`.

3. **Handling Async Errors**:
   ```ts
   Promise.resolve(fn(req, res, next)).catch((error) => next(error));
   ```
   - `Promise.resolve(fn(req, res, next))`: This ensures that `fn` is wrapped in a promise. Even if the `fn` function is not an asynchronous function (e.g., if it's synchronous), it gets wrapped in a resolved promise.
   - `.catch((error) => next(error))`: If the promise fails (i.e., an error occurs), this `.catch` block catches the error and passes it to the next middleware in the stack using `next(error)`.

4. **Error Handling**:
   - By using `next(error)`, it ensures that any errors are passed to the error-handling middleware in Express (typically defined with `app.use((err, req, res, next) => { ... })`).

### Why Use `catchAsync`?
In Express, if you have an async route handler, you would normally need to wrap it in a `try...catch` block to handle errors. Instead of repeating that boilerplate in every route, you can use `catchAsync` to automatically handle async errors.

For example:

#### Without `catchAsync`:
```ts
app.get('/user', async (req, res, next) => {
  try {
    const user = await getUserFromDatabase();
    res.json(user);
  } catch (error) {
    next(error);
  }
});
```

#### With `catchAsync`:
```ts
app.get('/user', catchAsync(async (req, res, next) => {
  const user = await getUserFromDatabase();
  res.json(user);
}));
```

This way, you don't need to manually handle the `try...catch` in every route, making your code cleaner and easier to maintain.
