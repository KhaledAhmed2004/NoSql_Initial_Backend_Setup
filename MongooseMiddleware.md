# **Mongoose Middleware**

Mongoose middleware functions, also known as **pre** and **post hooks**, are executed during specific stages of a Mongoose document lifecycle, such as before or after saving, updating, or deleting documents. These hooks are powerful tools for automating tasks like validation, data formatting, logging, and more.

Mongoose middleware supports asynchronous logic using either `async/await` or promises.

---

## **Types of Mongoose Middleware**

### **1. Pre Middleware**
Pre middleware runs **before** a specific action (e.g., saving, updating, deleting).  
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
Post middleware runs **after** an action completes (e.g., saving, updating, deleting).  
**Use Cases**: Logging, sending notifications, or clearing sensitive fields.

#### Example: Post-save Middleware
```javascript
userSchema.post('save', function (doc, next) {
  console.log('User saved:', doc);
  doc.password = ""; // Clear password in the returned object
  next(); // Move to the next step
});
```

---

### **3. Aggregate Middleware**
Aggregate middleware runs during the lifecycle of an aggregation query.  
**Use Cases**: Adding common filters or transformations to aggregation pipelines automatically.

#### Example: Pre-aggregate Middleware
```javascript
userSchema.pre('aggregate', function (next) {
  console.log('Pre-aggregate middleware triggered');
  this.pipeline().unshift({ $match: { isActive: true } }); // Add a default filter
  next();
});

const User = model('User', userSchema);

// Usage example
User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }])
  .then(result => console.log(result));
```

---

### **4. Find Middleware**
Find middleware runs before or after a `find` operation.  
**Use Cases**: Applying default filters, processing data, or logging.

#### Example: Pre-find Middleware
```javascript
userSchema.pre('find', function (next) {
  console.log('Pre-find middleware triggered');
  this.where({ isActive: true }); // Add a default filter to show only active users
  next();
});

const User = mongoose.model('User', userSchema);

// Usage example
User.find({}).then(users => {
  console.log(users); // Only active users will be retrieved
});
```

#### Example: Post-find Middleware
```javascript
userSchema.post('find', function (docs, next) {
  console.log('Post-find middleware triggered');
  docs.forEach(doc => {
    doc.password = undefined; // Mask the password field
  });
  next();
});

const User = mongoose.model('User', userSchema);

// Usage example
User.find({}).then(users => {
  console.log(users); // Passwords will be masked
});
```

---

## **Common Use Cases for Mongoose Middleware**

### **1. Hashing Passwords (`pre` hook)**
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

### **2. Masking Passwords (`post` hook)**
Mask sensitive information like passwords after retrieving documents from the database.

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
  console.log(users); // Passwords will be masked
});
```

---

## **Summary Table**

| **Middleware Type** | **Execution Stage**       | **Common Use Cases**                | **Example Methods**       |
|----------------------|---------------------------|--------------------------------------|---------------------------|
| Pre Middleware       | Before an action         | Validation, password hashing         | `save`, `update`, `remove`|
| Post Middleware      | After an action          | Logging, notifications, data cleanup | `save`, `update`, `remove`|
| Aggregate Middleware | Before/After aggregation | Adding default filters, transformations| `aggregate`              |
| Find Middleware      | Before/After `find`      | Default filters, data masking        | `find`, `findOne`         |

