# Updating Primitive and Non-Primitive Fields

### 1. **Primitive Fields**
Primitive fields are simple, immutable data types like strings, numbers, booleans, etc.

#### Common Primitive Data Types:
- **String**: `"Hello World"`
- **Number**: `42`
- **Boolean**: `true` or `false`
- **Date**: `new Date()`
- **Null**: `null`
- **Undefined**: `undefined`

### 1.1. **Updating Primitive Fields**
To update primitive fields, you can use the `updateOne`, `updateMany`, or `findOneAndUpdate` methods in Mongoose.

#### Example: Updating a Primitive Field (`String`)
```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
});

const User = mongoose.model('User', userSchema);

async function updateUser() {
  const result = await User.updateOne(
    { email: 'test@example.com' },  // Filter
    { $set: { name: 'Updated Name' } }  // Update operation
  );
  console.log(result);
}

updateUser();
```
- **Explanation**: The `updateOne` method updates a single document. It finds the document with the `email` of 'test@example.com' and updates the `name` field to 'Updated Name'.

---

### 2. **Non-Primitive Fields**
Non-primitive fields can be arrays, objects, or embedded documents, and they require different update operators.

#### Common Non-Primitive Data Types:
- **Arrays**: `["apple", "banana", "cherry"]`
- **Objects**: `{ name: "John", age: 30 }`
- **Embedded Documents**: `{ address: { street: "Main St", city: "New York" } }`

### 2.1. **Updating Non-Primitive Fields**
To update non-primitive fields like arrays and embedded documents, you can use specific update operators such as `$push` or `$set`.



The front-end sends a JSON object like this:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```



#### Example: Updating an Array (Non-Primitive Field)
```js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  comments: [{ user: String, comment: String }]
});

const Post = mongoose.model('Post', postSchema);

async function updatePost() {
  const result = await Post.updateOne(
    { title: 'Post Title' },  // Filter
    { $push: { comments: { user: 'John', comment: 'Great post!' } } }  // Add comment to array
  );
  console.log(result);
}

updatePost();
```
- **Explanation**: The `$push` operator adds a new comment to the `comments` array in the `Post` document.

### 3. **Common Mongoose Update Methods**

- **`updateOne()`**: Updates a single document based on the filter criteria.
- **`updateMany()`**: Updates multiple documents based on the filter criteria.
- **`findOneAndUpdate()`**: Finds a document and updates it, optionally returning the updated document.
- **`findByIdAndUpdate()`**: Updates a document by its `_id` and returns the updated document.

#### Example: Updating and Returning the Updated Document with `findOneAndUpdate()`
```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});

const User = mongoose.model('User', userSchema);

async function updateUser() {
  const updatedUser = await User.findOneAndUpdate(
    { email: 'test@example.com' },  // Filter
    { $set: { name: 'Updated Name' } },  // Update operation
    { new: true }  // Return the updated document
  );
  console.log(updatedUser);
}

updateUser();
```
- **Explanation**: The `{ new: true }` option ensures that the updated document is returned after the update.

---

### 4. **Updating by Document ID with `findByIdAndUpdate()`**
If you know the document's `_id`, you can directly update it using `findByIdAndUpdate()`.

#### Example:
```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String
});

const User = mongoose.model('User', userSchema);

async function updateUserById() {
  const updatedUser = await User.findByIdAndUpdate(
    'your-user-id',  // Replace with the actual document _id
    { $set: { name: 'Updated Name' } },  // Update operation
    { new: true }  // Return the updated document
  );
  console.log(updatedUser);
}

updateUserById();
```
