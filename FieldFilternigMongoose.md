# Field filternig in mongoose

In Mongoose, field filtering is used to specify which fields to include or exclude in the documents returned from a query. This is particularly useful for optimizing database queries by fetching only the data you need.

### How to Filter Fields in Mongoose

You can filter fields using the **`select()`** method or by passing a second argument to the **`find()`**, **`findOne()`**, or other query methods.

---

### 1. **Using `select()` Method**

The `select()` method specifies the fields you want to include or exclude:

#### Include Specific Fields
```javascript
const mongoose = require('mongoose');

// Example: Fetch only 'name' and 'email' fields
Model.find()
  .select('name email')
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

#### Exclude Specific Fields
To exclude fields, prefix them with a `-` (minus sign):
```javascript
// Example: Exclude the 'password' field
Model.find()
  .select('-password')
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

---

### 2. **Using the Projection Option in Query Methods**

You can achieve the same result by passing a projection object as the second argument to the query method:

#### Include Specific Fields
```javascript
Model.find({}, { name: 1, email: 1 })
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

#### Exclude Specific Fields
```javascript
Model.find({}, { password: 0 })
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

---

### 3. **Combining Field Filtering with Conditions**
You can combine field filtering with conditions:
```javascript
// Find users where age > 25 and fetch only 'name' and 'email'
Model.find({ age: { $gt: 25 } }, { name: 1, email: 1 })
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

---

### Notes:
1. **Include and Exclude Conflict**: You cannot mix inclusion and exclusion in the same query (except for `_id`, which can be excluded independently):
   ```javascript
   // Invalid:
   Model.find({}, { name: 1, password: 0 }); // This will throw an error
   ```

2. **Default `_id` Field**: By default, Mongoose always includes the `_id` field unless explicitly excluded:
   ```javascript
   Model.find({}, { name: 1, _id: 0 }) // Excludes the '_id' field
     .then(data => console.log(data))
     .catch(err => console.error(err));
   ```

3. **Chaining with Other Query Methods**: You can chain field filtering with other query methods such as `limit()`, `sort()`, etc.

---

### Example Use Case:
Suppose you have a `User` model and you want to return users' public profiles without sensitive data like passwords:
```javascript
User.find({}, { name: 1, email: 1, password: 0 })
  .then(users => console.log(users))
  .catch(err => console.error(err));
```

This approach ensures that sensitive fields like `password` are never sent to the client.
