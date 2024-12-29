In Mongoose, a **static method** is a method you define directly on the model (not on the document). Static methods are used when you want functionality at the model level, such as custom queries or operations that do not depend on individual document instances.

### Defining Static Methods
You define static methods using the `statics` property in your Mongoose schema. These methods can be called directly on the model.

### Example

Here’s how you can define and use a static method:

#### Step 1: Define the Static Method

```javascript
const mongoose = require('mongoose');

// Define a schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
});

// Add a static method to find users by age
userSchema.statics.findByAge = function (age) {
  return this.find({ age });
};

// Create a model
const User = mongoose.model('User', userSchema);
```

#### Step 2: Use the Static Method

```javascript
async function findUsersByAgeExample() {
  // Call the static method on the model
  const users = await User.findByAge(25);
  console.log(users);
}

// Call the function
findUsersByAgeExample();
```

### Use Case for Static Methods
1. **Custom Queries**: Create reusable query functions, such as `findByAge` or `findActiveUsers`.
2. **Aggregations**: Perform operations on the entire collection, like calculating averages or grouping data.
3. **Utility Functions**: Implement shared logic that operates at the collection level.

### Key Points
- Static methods are called on the **model** (e.g., `User.findByAge()`), not on individual documents.
- They are ideal for operations that involve multiple documents or require interaction at the collection level.
- If you need methods tied to individual documents, you should use **instance methods** instead.

Let me know if you'd like more examples!
