# `lean()` method in mongoos

In Mongoose, the `lean()` method is used to optimize queries by returning plain JavaScript objects instead of Mongoose documents. 

### Why Use `lean()`?

By default, when you query a Mongoose model, the results are returned as **Mongoose documents**. These documents are wrapped with Mongoose's functionalities, such as methods for updating or validation. However, if you don't need these extra features and only want plain data, you can use `lean()`.

### How `lean()` Works

When you chain `.lean()` to a query, Mongoose tells MongoDB to return the raw JSON objects directly from the database. These objects are much lighter in memory since they don’t carry Mongoose's additional functionalities.

### Syntax Example

```javascript
const users = await User.find({ isActive: true }).lean();
```

Here:
- Without `lean()`, `users` would be an array of Mongoose documents.
- With `lean()`, `users` is an array of plain JavaScript objects.

### Benefits of `lean()`

1. **Performance**: Queries with `lean()` are faster because Mongoose skips processing the data into documents.
2. **Lightweight Objects**: Since plain objects are returned, they consume less memory.
3. **Flexibility**: Useful when you only need data for read-only operations, like rendering on the frontend.

### Drawbacks

1. **No Mongoose Features**: You lose access to Mongoose-specific methods like `.save()`, virtual properties, and getters/setters.
2. **No Middleware**: Mongoose middleware (like pre or post hooks) won't run because you're dealing with plain objects.

### When to Use `lean()`

- When fetching data purely for display or reporting.
- In read-heavy operations where performance is critical.
- When you don't need to modify the data or use Mongoose document methods.

### Practical Example

Consider a blog app where you fetch posts for a public API:

```javascript
const posts = await Post.find({ isPublished: true }).lean();
```

Here, you don’t need Mongoose features like `.save()` or virtual properties; plain data is sufficient.

### Summary

`lean()` is a Mongoose method used to improve query performance by skipping the conversion of MongoDB documents into Mongoose documents, returning plain JavaScript objects instead. Use it when you need fast, lightweight, and read-only data access.
