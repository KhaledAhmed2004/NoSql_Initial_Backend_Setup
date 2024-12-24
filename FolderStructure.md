# Folder Structure

This project follows the **Modular Pattern** to keep the codebase clean and maintainable. All modules (e.g., `user`, `auth`, `student`, etc.) are organized under a central `modules` directory. Each module contains files that serve specific purposes, ensuring a clear separation of concerns.

## Folder Structure Overview

```
modules/
  ├── user/
  │    ├── user.controller.ts        # Handles the logic for user-related requests
  │    ├── user.interface.ts         # Defines the structure of user-related data
  │    ├── user.validation.ts        # Validates user data (input)
  │    ├── user.model.ts             # Defines the schema/model for the user entity
  │    ├── user.route.ts             # Defines the routes for user-related operations
  │    ├── user.service.ts           # Contains the business logic for user operations
  ├── auth/
  │    ├── auth.controller.ts        # Handles the logic for authentication requests
  │    ├── auth.interface.ts         # Defines the structure of authentication-related data
  │    ├── auth.validation.ts        # Validates authentication data
  │    ├── auth.model.ts             # Defines the schema/model for authentication entities (like tokens)
  │    ├── auth.route.ts             # Defines the routes for authentication operations
  │    ├── auth.service.ts           # Contains the business logic for authentication processes
  └── ... (other modules like car, booking, etc.)
```

## Module Structure Details

Each module contains the following files:

1. **Controller (`*.controller.ts`)**  
This file handles incoming HTTP requests for the module. It acts as a middle layer between the routes and the service, delegating the business logic to the service. It is responsible for interacting with the service layer and returning the appropriate responses.


2. **Interface (`*.interface.ts`)**  
Defines the TypeScript interfaces for data structures used in the module. It ensures consistency in data types across the module.


3. **Validation (`*.validation.ts`)**  
   Contains the logic for validating incoming data (e.g., checking if the email is valid, password strength, etc.). This file ensures that only valid data is passed to the service layer.

4. **Model (`*.model.ts`)**  
   Defines the data model (using Mongoose, Sequelize, or any other ORM/ODM) for the module's entities. The model represents how the data is structured and how it interacts with the database.

5. **Route (`*.route.ts`)**  
   Defines the API routes for the module. It sets up which controller methods should handle specific HTTP requests (GET, POST, PUT, DELETE, etc.).



6. **Service (`*.service.ts`)**  
   Contains the core business logic for the module. The service layer interacts with the database and provides methods that the controller layer calls. It handles database operations, data processing, and other core functionalities.


## Example: User Module

### user.controller.ts
Handles HTTP requests related to user actions like registration, login, and profile management.

### user.interface.ts
Defines the shape of user data, such as:

```typescript
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}
```

### user.validation.ts
Validates the incoming user data for registration, login, etc.

```typescript
import { z } from "zod";

const userValidactionSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.enum(["user", "admin"]).default("user"),
  status: z.enum(["active", "blocked"]).default("active"),
  isDeleted: z.boolean().default(false),
});

export const UserValidaction = { userValidactionSchema };
```

### user.model.ts
Defines the user schema for interacting with the database (e.g., MongoDB, SQL).

```typescript
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

export const User = model('User', userSchema);
```

### user.route.ts
Sets up the routes for the user-related operations.

```typescript
import express from "express";

const router = express.Router();

router.post("create-student", UserController.createStudent);

export const UserRouter = router;
```


### user.controller.ts
Handles HTTP requests related to user actions like registration, login, and profile management.
```typescript
import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const userData = await req?.body;

  const user = await UserServices.createUserIntoDB(userData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: user,
  });
});
export const UserControllers = {
  createUser,
};

```


### user.service.ts
Contains the logic for user-related operations like saving a user to the database, authenticating, etc.

```typescript
import { User } from './user.model';

export class UserService {
  async register(userData: any) {
    const newUser = new User(userData);
    return await newUser.save();
  }

  async authenticate(email: string, password: string) {
    // Logic to authenticate the user
  }
}
```

---

## Adding New Modules

When adding a new module to the project, follow the same structure as shown above:

1. **Create a new folder** for the module inside the `modules` directory.
2. **Define controller, service, model, validation, and route** files for the new module.
3. **Update the central `index.ts` file** (if applicable) to include the routes for the new module.
