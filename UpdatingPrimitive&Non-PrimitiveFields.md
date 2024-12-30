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

### 2. **Non-Primitive Fields in MongoDB Updates**

When updating non-primitive fields in MongoDB, it's important to only send the specific fields that need to be updated. Sending the entire document can lead to unnecessary network overhead and increase bandwidth usage. By sending only the fields that need updating, you optimize performance.

#### **Common Non-Primitive Data Types:**
- **Arrays**: `["apple", "banana", "cherry"]`
- **Objects**: `{ name: "John", age: 30 }`

### 2.1. **Goal: Transform Nested Objects for Non-Primitive Field Updates**

When the front-end sends a JSON object like this:
```json
{
  "name": {
    "lastName": "Nayeem"
  }
}
```

We want to transform it into a format suitable for MongoDB, like:
```json
{
  "name.lastName": "Nayeem"
}
```

### 2.2. **Steps to Transform Nested Data**

To achieve this, we need to flatten nested fields into a single string key using the dot notation. The process involves:
1. **Destructuring** the payload to extract nested fields.
2. **Iterating** over the nested fields and building the correct path for the update.
3. **Constructing** an update object that MongoDB can use.

### 2.3. **Service Code to Update Non-Primitive Fields**

Here’s an updated version of the service code that handles nested fields and transforms them accordingly:

```ts
const update = async (id: string, payload: Partial<TUser>) => {
  // Destructure the payload to separate nested fields and remaining data
  const { name, ...remainingData } = payload;

  // Create an object to hold the final update data
  const modifiedUpdateData: Record<string, unknown> = { ...remainingData };

  // Handle nested 'name' object, if present
  if (name && Object.keys(name).length > 0) {
    for (const [key, value] of Object.entries(name)) {
      // Dynamically build the key for the nested field (e.g., 'name.lastName')
      modifiedUpdateData[`name.${key}`] = value;
    }
  }

  // Perform the update using the `findOneAndUpdate` method
  const result = await Student.findOneAndUpdate({ id }, modifiedUpdateData, { new: true });

  return result;
};
```

### 2.4. **Explanation of the Code:**

1. **Destructuring Payload**: 
   - The payload is destructured into `name` (which could be a nested object) and `remainingData` (other fields).
   
2. **Creating `modifiedUpdateData`**: 
   - We initialize an empty object, `modifiedUpdateData`, with the remaining fields from the payload. This will hold the updated fields.

3. **Flattening Nested Fields**:
   - If the `name` field contains nested properties (like `lastName`), we loop through its entries using `Object.entries(name)`.
   - For each key (e.g., `lastName`), we create a new key `name.<key>` (e.g., `name.lastName`) and assign the corresponding value.

4. **Update MongoDB Document**:
   - Using `findOneAndUpdate`, we pass `modifiedUpdateData` as the update payload.
   - The `new: true` option ensures that the updated document is returned.


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
