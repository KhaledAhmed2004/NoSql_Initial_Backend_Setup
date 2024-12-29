# Data Modeling: Embedding vs Referencing

In MongoDB, there are two common methods for modeling data: **Embedding** and **Referencing**. Both have their own pros and cons, and choosing the right one depends on the specific needs of your application. Below is a detailed comparison to help you understand each approach.

---

## **1. Embedding**

Embedding in Mongoose allows you to store related data as subdocuments within a parent document. This method improves performance for operations involving nested data, as everything is stored in a single document.

### **Scenario**: Blog Application with Embedded Comments

Imagine a blog application where each blog post has comments. Instead of storing comments in a separate collection, you can embed them within the blog post document.

---

### **Example Code**:

#### Step 1: Define the Comment Schema (TypeScript)

```typescript
// Define the Comment schema in TypeScript
type IComment = {
  username: string;
  text: string;
  createdAt: Date;
  postId: mongoose.Types.ObjectId; // Reference to the BlogPost
}

```

#### Step 2: Define the Embedded Schema (Subdocument)
In Mongoose, a subdocument is defined as a schema that is embedded within another schema.
```typescript
// Define the Comment schema (subdocument)
const commentSchema = new Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
```

#### Step 3: Define the Parent Schema
Here, we embed the commentSchema as an array of comments in the blog post schema.
```typescript
// Define the BlogPost schema
const blogPostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  comments: [commentSchema] // Embedding the comments schema
});

// Create the BlogPost model
const BlogPost = mongoose.model('BlogPost', blogPostSchema);
```

### Output Example:
After embedding, when querying the blog posts, the resulting document will look like this:

```json
{
  "_id": "64f8325fc2a9f5411e8b9e2b",
  "title": "Understanding Mongoose Embedding",
  "content": "This post explains how to use embedding in Mongoose.",
  "author": "John Doe",
  "comments": [
    {
      "_id": "64f8325fc2a9f5411e8b9e2c",
      "username": "Jane",
      "text": "Great article!",
      "createdAt": "2024-09-06T12:34:56.789Z"
    },
    {
      "_id": "64f8325fc2a9f5411e8b9e2d",
      "username": "Tom",
      "text": "Very helpful, thanks!",
      "createdAt": "2024-09-06T12:35:12.345Z"
    }
  ]
}
```
---

## **2. Referencing**

Referencing in Mongoose allows you to store relationships between documents in different collections by saving the IDs (usually `ObjectIds`) of related documents within a document. This method helps you keep documents smaller and more flexible, while still maintaining relationships between them, similar to how foreign keys work in relational databases.

### **Scenario**: Blog Application with Referenced Comments

Instead of embedding comments directly into the blog post, you can store comments in a separate collection and reference them in the blog post. This method can be beneficial when comments grow large or are shared across multiple blog posts.

---

### **Example Code**:

#### **Step 1: Define the Comment Schema (TypeScript)**

```typescript
// Define the Comment schema in TypeScript
type IComment = {
  username: string;
  text: string;
  createdAt: Date;
  postId: mongoose.Types.ObjectId; // Reference to the BlogPost
}
```

#### **Step 2: Define the Comment Schema (Referenced)**

In this step, we define the `Comment` schema, which includes a reference to the `BlogPost` using `ObjectId`.

```typescript
const { Schema } = mongoose;

// Define the Comment schema
const commentSchema = new Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  postId: { type: Schema.Types.ObjectId, ref: 'BlogPost' } // Reference to BlogPost
});

// Create the Comment model
const Comment = mongoose.model('Comment', commentSchema);
```

#### **Step 3: Define the BlogPost Schema (Parent Document)**

The `BlogPost` schema contains an array of `ObjectId` references pointing to `Comment` documents.

```typescript
// Define the BlogPost schema
const blogPostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] // Array of references to Comment
});

// Create the BlogPost model
const BlogPost = mongoose.model('BlogPost', blogPostSchema);
```



#### **Step 4: Querying Referenced Data**

When querying blog posts, use the `.populate()` method to replace the `comments` field with the actual `Comment` documents.

```typescript
async function getBlogPostWithComments() {
  const blogPosts = await BlogPost.find()
    .populate('comments') // Populates the comments field with the actual Comment documents
    .exec();
  console.log('Blog Posts with Populated Comments:', blogPosts);
}

getBlogPostWithComments().catch(console.error);
```

---

#### **Output Example**

After running the query, the populated blog post document will look like this:

```json
{
  "_id": "64f8345dc2a9f5411e8b9e2e",
  "title": "Understanding Mongoose Referencing",
  "content": "This post explains how to use referencing in Mongoose.",
  "author": "John Doe",
  "comments": [
    {
      "_id": "64f8346dc2a9f5411e8b9e2f",
      "username": "Jane",
      "text": "Great article!",
      "createdAt": "2024-09-06T12:45:34.123Z",
      "postId": "64f8345dc2a9f5411e8b9e2e"
    },
    {
      "_id": "64f8347ec2a9f5411e8b9e30",
      "username": "Tom",
      "text": "Very helpful, thanks!",
      "createdAt": "2024-09-06T12:46:10.456Z",
      "postId": "64f8345dc2a9f5411e8b9e2e"
    }
  ]
}
```



### Considerations:
- Use referencing when related data can grow large or is shared among multiple documents.
- Requires additional queries (e.g., `.populate()`) to fetch related data, which can impact performance compared to embedding.


### Nested Populate in Mongoose

When you use referencing in MongoDB with Mongoose, sometimes you'll want to populate data from multiple levels of relationships. Mongoose allows you to use **nested populate**, which lets you populate a reference that itself contains another reference. This is useful when you have a more complex schema structure with multiple levels of references.

Here’s how you can implement and use **nested populate** in Mongoose:

---

### **Scenario: Blog Application with Author and Commenter**

Imagine a blog application where:
- A `BlogPost` contains a reference to an `Author`.
- Each `BlogPost` also has comments, and each `Comment` contains a reference to a `Commenter`.

You want to fetch a blog post, and not only load the comments but also populate the `Commenter` information within each comment and the `Author` information for the post itself.

---

### **Example Code for Nested Populate:**

#### Step 1: Define the Author Schema  (Parent Document)
```typescript
const { Schema, model, Types } = mongoose;

// Define the Author schema
const authorSchema = new Schema({
  name: { type: String, required: true },
  bio: { type: String }
});

// Create the Author model
const Author = model('Author', authorSchema);
```

#### Step 2: Define the Commenter Schema  (Referenced)
```typescript
// Define the Commenter schema
const commenterSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true }
});

// Create the Commenter model
const Commenter = model('Commenter', commenterSchema);
```

#### Step 3: Define the Comment Schema 
The `Comment` will reference the `Commenter` model.
```typescript
// Define the Comment schema
const commentSchema = new Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  commenter: { type: Types.ObjectId, ref: 'Commenter' },  // Reference to Commenter
  postId: { type: Types.ObjectId, ref: 'BlogPost' } // Reference to BlogPost
});

// Create the Comment model
const Comment = model('Comment', commentSchema);
```

#### Step 4: Define the BlogPost Schema
The `BlogPost` will reference the `Author` model and store an array of `comments` that reference the `Comment` model.
```typescript
// Define the BlogPost schema
const blogPostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Types.ObjectId, ref: 'Author' }, // Reference to Author
  comments: [{ type: Types.ObjectId, ref: 'Comment' }] // Array of references to Comment
});

// Create the BlogPost model
const BlogPost = model('BlogPost', blogPostSchema);
```

#### Step 5: Query with Nested Populate

Now, you can query a blog post and use **nested populate** to load both the `author` of the blog post and the `commenter` of each comment:

```typescript
async function getBlogPostWithCommentsAndAuthor() {
  const blogPosts = await BlogPost.find()
    .populate({
      path: 'author',  // Populate the Author
      select: 'name bio'  // Only include name and bio fields
    })
    .populate({
      path: 'comments',  // Populate the comments
      populate: {  // Nested populate for each comment's commenter
        path: 'commenter',  // Populate the Commenter's details
        select: 'username email'  // Only include username and email fields
      }
    })
    .exec();

  console.log('Blog Post with Author and Comments:', blogPosts);
}

getBlogPostWithCommentsAndAuthor().catch(console.error);
```

### **Explanation of Nested Populate:**
- The first `populate()` call fetches the `author` of the `BlogPost` and includes only the `name` and `bio` fields.
- The second `populate()` call fetches the `comments` array, and within that, it uses a nested `populate` to retrieve the `commenter` details. In this case, only the `username` and `email` fields of each `Commenter` are included.
  
### **Output Example:**
After running the query, the populated blog post document will look like this:

```json
{
  "_id": "64f8345dc2a9f5411e8b9e2e",
  "title": "Understanding Mongoose Referencing",
  "content": "This post explains how to use referencing in Mongoose.",
  "author": {
    "_id": "64f8345dc2a9f5411e8b9e2f",
    "name": "John Doe",
    "bio": "Software Developer"
  },
  "comments": [
    {
      "_id": "64f8346dc2a9f5411e8b9e2f",
      "text": "Great article!",
      "createdAt": "2024-09-06T12:45:34.123Z",
      "commenter": {
        "_id": "64f8346dc2a9f5411e8b9e30",
        "username": "Jane",
        "email": "jane@example.com"
      },
      "postId": "64f8345dc2a9f5411e8b9e2e"
    },
    {
      "_id": "64f8347ec2a9f5411e8b9e30",
      "text": "Very helpful, thanks!",
      "createdAt": "2024-09-06T12:46:10.456Z",
      "commenter": {
        "_id": "64f8347ec2a9f5411e8b9e31",
        "username": "Tom",
        "email": "tom@example.com"
      },
      "postId": "64f8345dc2a9f5411e8b9e2e"
    }
  ]
}
```




## **Comparison Table**

| **Aspect**            | **Embedding**                                         | **Referencing**                                        |
|-----------------------|-------------------------------------------------------|--------------------------------------------------------|
| **Definition**         | Storing related data directly within a document.      | Storing a reference (e.g., `ObjectId`) to another document. |
| **Faster Reading**     | Yes, because all related data is stored together.     | No, requires additional queries to fetch referenced data. |
| **Writing Performance**| Slow for large data, as the whole document needs to be rewritten. | Fast, as only references are updated.                   |
| **Update Performance** | Slow for complex updates since the entire document must be updated. | Fast, only the reference is updated.                   |
| **Size Limitations**   | Limited to 16MB per document.                        | No size limit, data can grow indefinitely.              |
| **Data Duplication**   | Possible data duplication if data is repeated across multiple documents. | Avoids data duplication by storing only references.     |
| **Scalability**        | Limited scalability due to document size limits.     | High scalability, as data is normalized and stored separately. |
| **Query Performance**  | Less expensive, as no additional lookups are required. | More expensive, requires multiple queries to fetch related data. |
| **Lookup**             | No lookup needed since data is embedded directly in the document. | Requires lookup to retrieve data from the referenced document. |
| **Use Case**           | Best for smaller, self-contained data or when fast access is needed. | Best for larger, frequently updated data or when data needs to be shared between multiple documents. |


## **Data Relationships in ER Diagram**

### **1. One-to-One (1:1) Relationship**

- Each entity has **only one** related entity.
- **Example**: One **person** has one **passport**.
  - One **student** has one **profile**.

In an **ER diagram**, this means for each **student**, there is exactly one **profile** linked to them, and each **profile** belongs to one **student**.

### **2. One-to-Many (1:M) Relationship**

- One entity can have **many** related entities.
- **Example**: One **teacher** can have many **students**.
  - One **admin** can manage many **faculty members**.

In an **ER diagram**, this means one **teacher** can be linked to many **students**, but each **student** has only one **teacher**. Similarly, one **admin** manages many **faculty members**, but each **faculty member** is managed by only one **admin**.
