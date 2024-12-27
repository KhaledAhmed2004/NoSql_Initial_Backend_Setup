# **Mongoose Middleware**

Mongoose middleware functions, also known as **pre** and **post hooks**, are functions executed during specific stages of a Mongoose document lifecycle, such as before or after saving, updating, or deleting documents. These hooks are powerful tools for automating tasks like validation, data formatting, logging, and more.

---

## **Types of Mongoose Middleware**

### **1. Pre Middleware**
Runs **before** a specific action (e.g., saving, updating, deleting).  
**Use Cases**: Validating fields, formatting data, or hashing passwords.

#### Example: Pre-save Middleware
```javascript
const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
});

// Pre-save middleware to modify data before saving
userSchema.pre('save', function (next) {
  console.log('Before saving user:', this);
  next(); // Proceed to the next step
});

const User = model('User', userSchema);
```

---

### **2. Post Middleware**
Runs **after** an action completes (e.g., saving, updating, deleting).  
**Use Cases**: Logging, sending notifications, or clearing sensitive fields.

#### Example: Post-save Middleware
```javascript
userSchema.post('save', function (doc, next) {
  console.log('User saved:', doc);
  doc.password = ""; // Clear password in the returned object
  next(); // Move to the next step
});
```



## **Common Use Cases for Mongoose Middleware**

### **1. Hashing Passwords `pre` hook**
Securely hash user passwords before saving them to the database.

#### Example: Password Hashing Middleware
```javascript
const bcrypt = require('bcrypt');

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
```
## 2.**Masking Passwords by `post` hook**

The **post-find hook** runs after a query using `find` is executed. It’s useful for modifying or processing the retrieved data.

#### Example: Masking Passwords
```javascript
userSchema.post('find', function (docs, next) {
  docs.forEach(doc => {
    doc.password = undefined; // Hide the password
  });
  console.log('Post-find middleware executed');
  next();
});

const User = mongoose.model('User', userSchema);

// Usage example
User.find({}).then(users => {
  console.log(users); // Password will be masked
});
```

---

## **Asynchronous Middleware**

Mongoose middleware supports asynchronous logic using either `async/await` or promises.

#### Using `async/await`:
```javascript
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

#### Using Promises:
```javascript
userSchema.pre('save', function (next) {
  someAsyncFunction()
    .then(() => next())  // Proceed after async operation
    .catch(err => next(err)); // Pass errors to the next handler
});
```

---


### Summary Table
| **Middleware Type** | **Execution Stage**       | **Common Use Cases**                | **Example Methods**       |
|----------------------|---------------------------|--------------------------------------|---------------------------|
| Pre Middleware       | Before an action         | Validation, password hashing         | `save`, `update`, `remove`|
| Post Middleware      | After an action          | Logging, notifications, data cleanup | `save`, `update`, `remove`|
| Error Middleware     | After an error occurs    | Error logging, transforming messages | `save`, `update`, `remove`|
