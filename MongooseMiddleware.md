# **Mongoose Middleware**

Mongoose middleware functions,also known as pre and post hooks, are executed during specific stages of a Mongoose document lifecycle, such as before or after creating, updating, or deleting documents. This allows you to perform actions like validation, modification, or logging automatically at different stages.

---

## **Types of Mongoose Middleware**

### 1. **Pre Middleware**
Runs **before** a specific action (e.g., saving, updating, deleting).  
**Use Cases**: Validating fields, formatting data, or hashing passwords.

#### **Example: Pre-save Middleware**
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

### 2. **Post Middleware**
Runs **after** an action completes (e.g., saving, updating, deleting).  
**Use Cases**: Logging, sending notifications, or clearing sensitive fields.

#### **Example: Post-save Middleware**
```javascript
userSchema.post('save', function (doc, next) {
  console.log('User saved:', doc);
  doc.password = ""; // Clear password in the returned object
  next(); // Move to the next step
});
```

---

### 3. **Error Middleware**
Runs **after** an error occurs during operations like saving or updating.  
**Use Cases**: Logging errors, transforming error messages, or notifying admins.

#### **Example: Error Middleware**
```javascript
userSchema.post('save', function (error, doc, next) {
  console.error('Error during save:', error.message);
  next(error); // Pass the error to the next handler
});
```

---

## **Common Use Cases for Mongoose Middleware**

### **1. Validation**  
Ensure that documents meet specific requirements before saving.

#### **Example: Validation Middleware**
```javascript
userSchema.pre('save', function (next) {
  if (!this.email) {
    next(new Error('Email is required!'));
  } else {
    next(); // Continue if validation passes
  }
});
```

---

### **2. Hashing Passwords**  
Securely hash user passwords before saving them in the database.

#### **Example: Password Hashing Middleware**
```javascript
const bcrypt = require('bcrypt');

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
```

---

### **3. Populating Fields**  
Automatically populate reference fields after querying documents.

#### **Example: Post-find Middleware**
```javascript
userSchema.post('find', async function (docs) {
  for (const doc of docs) {
    await doc.populate('profile'); // Populate 'profile' reference
  }
});
```

---

## **Asynchronous Middleware**
Mongoose middleware supports asynchronous logic using either `async/await` or promises.

#### **Using async/await:**
```javascript
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

#### **Using Promises:**
```javascript
userSchema.pre('save', function (next) {
  someAsyncFunction()
    .then(() => next())  // Proceed after async operation
    .catch(err => next(err)); // Pass errors to the next handler
});
```

---

## **Special Post Middleware Example**  
Reset a sensitive field like `password` in the document after saving.

#### **Post-save Middleware Example**
```javascript
userSchema.post('save', async function (doc, next) {
  doc.password = ""; // Clear the password field in the returned object
  next();
});
```
