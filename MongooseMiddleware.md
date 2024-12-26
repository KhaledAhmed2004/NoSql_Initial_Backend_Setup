
# Mongoose Middleware

Mongoose middleware functions are executed during specific stages of a Mongoose document lifecycle, such as before or after creating, updating, or deleting documents. This allows you to perform actions like validation, modification, or logging automatically at different stages.

---

### Types of Mongoose Middleware

1. **Pre Middleware**
   - Runs **before** an action (e.g., before saving, updating, or deleting a document).
 
 **Use Case**: Validating email or modifying data before saving.
   **Example: Pre-save Middleware**

   ```javascript
   const userSchema = new Schema({
     username: String,
     email: String,
   });

   // Pre-save middleware
   userSchema.pre('save', function (next) {
     // Modify the document or perform any action before saving
     console.log('Before saving user:', this);
     next(); // Proceed to the next middleware or save operation
   });

   const User = model('User', userSchema);
   ```

  

---

2. **Post Middleware**
   - Runs **after** an action has completed (e.g., after saving, updating, or deleting a document).
   - Useful for logging, sending notifications, or updating related documents.

   **Example: Post-save Middleware**

   ```javascript
   userSchema.post('save', function (doc) {
     console.log('User saved:', doc);
   });
   ```

   **Use Case**: Logging after a document is saved, sending a notification after creation, or modifying other related documents.

---

3. **Error Middleware**
   - Runs **after** an error occurs during an operation like save, update, etc.
   - Useful for error handling, logging, or performing actions on failure.

   **Example: Error Handling Middleware**

   ```javascript
   userSchema.post('save', function (error, doc, next) {
     console.error('Error during save:', error);
     next(error); // Pass the error to the next middleware
   });
   ```

   **Use Case**: Logging or handling errors after an operation fails.

---

### Common Use Cases for Mongoose Middleware

1. **Validation**
   - Validate a document’s fields before saving it to the database.

   **Example: Validation Middleware**

   ```javascript
   userSchema.pre('save', function (next) {
     if (!this.email) {
       next(new Error('Email is required!'));
     } else {
       next();
     }
   });
   ```

2. **Hashing Passwords**
   - Hash passwords before saving them to the database. This can be done in a `pre('save')` middleware.

   **Example: Hashing Password Middleware**

   ```javascript
   const bcrypt = require('bcrypt');

   userSchema.pre('save', async function (next) {
     if (this.isModified('password')) {
       this.password = await bcrypt.hash(this.password, 10);
     }
     next();
   });
   ```

3. **Populating Fields**
   - Populate fields (like references to other documents) after a document is retrieved.

   **Example: Post-find Middleware**

   ```javascript
   userSchema.post('find', function (docs) {
     docs.forEach(doc => {
       doc.populate('profile');
     });
   });
   ```

---

### Asynchronous Middleware

Mongoose supports asynchronous middleware. To handle this, you must either use the `next` function or return a promise from the middleware to signal completion.

1. **Using async/await:**

   ```javascript
   userSchema.pre('save', async function (next) {
     this.password = await bcrypt.hash(this.password, 10);
     next();
   });
   ```

2. **Using Promises:**

   ```javascript
   userSchema.pre('save', function (next) {
     someAsyncFunction()
       .then(result => {
         next();
       })
       .catch(error => {
         next(error);
       });
   });
   ```

---
