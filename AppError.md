# `AppError` 

This code defines a custom error class named `AppError` in TypeScript (or JavaScript if used in that context). This class extends the built-in `Error` class and is designed specifically for handling application errors in a way that includes an HTTP status code. Below is an explanation of its components:

---

### Key Features of `AppError`

#### 1. **Purpose**  
   The `AppError` class helps standardize error handling in an application by:
   - Including an **HTTP status code** (e.g., 404 for "Not Found," 500 for "Internal Server Error") to categorize errors.
   - Providing a **custom message** to describe the error.
   - Optionally including or generating a **stack trace** to aid in debugging.

---

### Components

#### **`statusCode: number`**
   - A public property that stores the HTTP status code associated with the error.
   - Example: `404` (Not Found), `500` (Internal Server Error).

#### **Constructor Parameters**
   - **`statusCode` (number):** The HTTP status code for the error.
   - **`message` (string):** A human-readable description of the error.
   - **`stack` (optional, string):** A string representing the stack trace. If not provided, the constructor generates one automatically.

---

### How the Constructor Works

1. **`super(message)`**
   - Calls the constructor of the base `Error` class to initialize the `message` property.

2. **`this.statusCode = statusCode`**
   - Sets the `statusCode` property for the instance.

3. **Stack Trace Handling**
   - If a `stack` parameter is provided, it sets the `stack` property to that value.
   - Otherwise, it generates a stack trace using `Error.captureStackTrace` for debugging purposes.

---

### Example Usage

Here's how you might use `AppError` in an application:

```typescript
import AppError from './AppError';

// Function to simulate a user retrieval operation
function getUserById(id: string) {
  if (id !== "123") {
    // Throw an error if the user is not found
    throw new AppError(404, "User not found");
  }
  return { id, name: "John Doe" };
}

// Error handling example
try {
  const user = getUserById("456");
  console.log(user);
} catch (error) {
  if (error instanceof AppError) {
    console.error(`Error (${error.statusCode}): ${error.message}`);
  } else {
    console.error("An unexpected error occurred:", error);
  }
}
```

---

### Advantages of `AppError`

1. **Improved Error Management**  
   Allows you to differentiate between different types of errors using status codes.

2. **Debugging Made Easier**  
   Includes an optional stack trace to help developers locate the error.

3. **Standardization**  
   Ensures consistency in how errors are thrown and handled across the application.

---

### Analogy

Think of `AppError` as a specialized envelope for error messages:
- The **status code** is like a priority label (e.g., "Urgent" or "Normal").
- The **message** is the content of the message.
- The **stack trace** is a map showing how the message reached you.

This makes it easier to handle errors uniformly, just like sorting mail by priority labels.
