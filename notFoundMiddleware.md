# **Express `notFound` Middleware**

This `notFound` middleware is designed to handle **404 errors** in an Express application. It ensures that requests to unknown routes return a consistent and user-friendly response.

---

## **Code Example**
```typescript
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

// Middleware to handle 404 (Not Found) errors
const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,          // Indicates the request failed
    message: "API Not Found !!", // Error message for the client
    error: "",               // Additional details (empty in this case)
  });
};

export default notFound;
```

---

## **Key Features**

### **1. Purpose**
- Handles requests to **undefined routes** in the application.
- Ensures the server provides a consistent and structured response for such cases.

### **2. Parameters**
The middleware uses the standard Express middleware signature:
- **`req` (Request):** Represents the incoming request, including details like URL, headers, and parameters.
- **`res` (Response):** Used to send the response back to the client.
- **`next` (NextFunction):** Passes control to the next middleware in the stack. Not used here, as this middleware handles the final case for unknown routes.

### **3. Function Logic**
1. **Set HTTP Status Code**  
   The middleware sets the response status to **404 (Not Found)** using `httpStatus.NOT_FOUND`.  

2. **Send JSON Response**  
   It sends a structured response to the client in JSON format:  
   ```json
   {
     "success": false,
     "message": "API Not Found !!",
     "error": ""
   }
   ```
   - `success: false` → Indicates failure.  
   - `message: "API Not Found !!"` → Specifies why the request failed.  
   - `error: ""` → Empty as no additional details are provided in this case.

---

## **Why Use This Middleware?**
- **Consistent Error Handling:** Prevents default Express error pages and provides a clear, structured response.  
- **Improved User Experience:** Clients receive a meaningful message about what went wrong.  
- **Security:** Avoids exposing server details via default error messages.  

---

## **How to Use**
Place the `notFound` middleware **after all route handlers** in your Express application.  

### **Example Usage**
```typescript
import express from "express";
import someRoutes from "./routes/someRoutes";
import notFound from "./middlewares/notFound";

const app = express();

// Middleware to parse incoming requests
app.use(express.json());

// Define application routes
app.use("/api", someRoutes);

// Handle undefined routes
app.use(notFound);

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
```
