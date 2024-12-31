

### **1. Structure of the Query Object**

The query object now includes **field limiting** to control which fields are included in the response, along with pagination, filtering, and sorting:

```json
{
  "query": {
    "page": "1",        // The page number for pagination
    "limit": "10",      // The maximum number of results per page
    "sort": "email",    // Field to sort by (e.g., "email", "name")
    "searchTerm": "ms.x",  // Used for partial matching (e.g., searching for 'ms.x' in names, emails, etc.)
    "email": "nayeem@gmail.com",  // Exact match filter for the email field
    "fields": "name,email" // Fields to include in the response (e.g., name and email only)
  }
}
```

---

### **2. Example API Request**
The query parameters can be passed in the URL like this:

```
/api/v1/student?searchTerm=chitta&email=nayeem@gmail.com&page=2&limit=5&sort=email&fields=name,email
```

### **1. Pagination**
**Pagination**: Divides products into pages (e.g., 20 items per page).

**Definition**: Pagination divides the data into smaller chunks (pages) to improve user experience and performance.

- **Key Parameters**:
  - `page`: Current page number.
  - `limit`: Number of documents per page.

**Implementation**:
```javascript
const page = parseInt(req.query.page) || 1; // Default to page 1
const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
const skip = (page - 1) * limit;

const results = await Model.find().skip(skip).limit(limit);
```

---

### **2. Searching**


**Searching**: Finds products by name or description.

**Definition**: Searching filters data based on a search query in one or more fields.

- **Key Parameter**:
  - `search`: A string used to search specific fields.

**Implementation**:
```javascript
const searchQuery = req.query.search || "";
const results = await Model.find({
  $or: [
    { field1: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search
    { field2: { $regex: searchQuery, $options: "i" } },
  ],
});
```

---

### **3. Filtering**

**Filtering**: Filters products by category, price range, or color.


**Definition**: Filtering retrieves specific data based on key-value pairs provided by the user.

- **Key Parameters**: Dynamically filter based on the query string.

**Implementation**:
```javascript
const filters = { ...req.query }; // Assume query contains filterable keys like `category`, `status`, etc.
const excludedFields = ["page", "limit", "sort", "fields", "search"]; // Exclude non-filter fields
excludedFields.forEach(field => delete filters[field]);

const results = await Model.find(filters);
```

---

### **4. Sorting**

**Sorting**: Sorts products by price (low to high) or date (newest first).

**Definition**: Sorting arranges data in ascending or descending order based on specific fields.

- **Key Parameter**:
  - `sort`: Field name prefixed with `-` for descending or left as is for ascending.

**Implementation**:
```javascript
const sortBy = req.query.sort || "createdAt"; // Default to sorting by `createdAt`
const results = await Model.find().sort(sortBy); // Use `-fieldName` for descending order
```

---

### **5. Field Limiting**

**Field Limiting**: Shows only essential information like product name and price instead of all details.


**Definition**: Limits the fields returned in the response to reduce payload size.

- **Key Parameter**:
  - `fields`: Comma-separated field names to include.

**Implementation**:
```javascript
const fields = req.query.fields ? req.query.fields.split(",").join(" ") : ""; // Default to all fields
const results = await Model.find().select(fields);
```

---

### **Combining All**
You can combine these functionalities in a single query handler:

```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const searchQuery = req.query.search || "";
const filters = { ...req.query };
const excludedFields = ["page", "limit", "sort", "fields", "search"];
excludedFields.forEach(field => delete filters[field]);

const sortBy = req.query.sort || "createdAt";
const fields = req.query.fields ? req.query.fields.split(",").join(" ") : "";

// Final Query
const results = await Model.find({
  $or: [
    { field1: { $regex: searchQuery, $options: "i" } },
    { field2: { $regex: searchQuery, $options: "i" } },
  ],
  ...filters,
})
  .skip(skip)
  .limit(limit)
  .sort(sortBy)
  .select(fields);

// Send response
res.status(200).json({
  success: true,
  count: results.length,
  data: results,
});
```


# `QueryBuilder`

This code defines a `QueryBuilder` class that is designed to build and customize MongoDB queries using the Mongoose library. The purpose of this class is to make it easier to handle common query operations like search, filter, sort, pagination, and field selection. Here's a breakdown of what each part of the class does:

### **File Location:**
  - Create a folder named builder under the app folder.
  - Inside the builder folder, create a new TypeScript file called QueryBuilder.ts.

### Class Declaration
```typescript
class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }
}
```
- **`modelQuery`**: A Mongoose query object that holds the actual MongoDB query to be executed (e.g., `find()`, `findOne()`, etc.).
- **`query`**: A record (object) that holds the parameters that were passed to the query (e.g., search terms, filters, sort fields, etc.).
- The constructor takes two parameters: `modelQuery` (the Mongoose query object) and `query` (the parameters for the query).

### Methods

#### 1. **`search()`**
```typescript
search(searchableFields: string[]) {
  const searchTerm = this?.query?.searchTerm;
  if (searchTerm) {
    this.modelQuery = this.modelQuery.find({
      $or: searchableFields.map(
        (field) =>
          ({
            [field]: { $regex: searchTerm, $options: 'i' },
          }) as FilterQuery<T>,
      ),
    });
  }

  return this;
}
```
- **Purpose**: This method allows you to perform a search operation on specified fields (`searchableFields`).
- **How**: If the `searchTerm` exists in the query, it creates a `$regex` condition for each field in `searchableFields` to match the `searchTerm` (case-insensitive).
- **Returns**: The `QueryBuilder` instance, allowing for method chaining.

#### 2. **`filter()`**
```typescript
filter() {
  const queryObj = { ...this.query }; // copy

  // Filtering
  const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

  excludeFields.forEach((el) => delete queryObj[el]);

  this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

  return this;
}
```
- **Purpose**: This method applies filtering to the query based on the other parameters in the `query` object.
- **How**: It copies the `query` object and removes fields that should not be included in the filtering process, such as `searchTerm`, `sort`, `limit`, `page`, and `fields`.
- **Returns**: The `QueryBuilder` instance, allowing for method chaining.

#### 3. **`sort()`**
```typescript
sort() {
  const sort =
    (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';
  this.modelQuery = this.modelQuery.sort(sort as string);

  return this;
}
```
- **Purpose**: This method allows you to apply sorting to the query.
- **How**: The `sort` parameter in the query is split by commas and converted into a string that can be passed to Mongoose's `sort()` method. If no `sort` parameter is provided, it defaults to sorting by `-createdAt` (descending order).
- **Returns**: The `QueryBuilder` instance, allowing for method chaining.

#### 4. **`paginate()`**
```typescript
paginate() {
  const page = Number(this?.query?.page) || 1;
  const limit = Number(this?.query?.limit) || 10;
  const skip = (page - 1) * limit;

  this.modelQuery = this.modelQuery.skip(skip).limit(limit);

  return this;
}
```
- **Purpose**: This method applies pagination to the query.
- **How**: It uses the `page` and `limit` parameters from the `query` object to calculate how many documents to skip and how many to limit the result to. If these parameters are not provided, defaults of `1` for `page` and `10` for `limit` are used.
- **Returns**: The `QueryBuilder` instance, allowing for method chaining.

#### 5. **`fields()`**
```typescript
fields() {
  const fields =
    (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

  this.modelQuery = this.modelQuery.select(fields);
  return this;
}
```
- **Purpose**: This method allows you to specify which fields should be returned in the query results.
- **How**: The `fields` parameter in the query is split by commas and converted into a string that Mongoose can use for the `select()` method. If no `fields` parameter is provided, the default is `'-__v'`, which excludes the version field (`__v`).
- **Returns**: The `QueryBuilder` instance, allowing for method chaining.

### Example Usage
Here's how you might use the `QueryBuilder` class in practice:

```typescript
const queryBuilder = new QueryBuilder(MyModel.find(), req.query);

const results = await queryBuilder
  .search(['name', 'description'])
  .filter()
  .sort()
  .paginate()
  .fields()
  .modelQuery;
```
- **Explanation**: In this example, `MyModel.find()` creates the initial query, and then the `QueryBuilder` class is used to apply the search, filter, sort, pagination, and field selection methods, in that order.
- The final `modelQuery` is the fully customized Mongoose query that can be executed.

### Summary
The `QueryBuilder` class simplifies and centralizes the logic for building complex MongoDB queries with Mongoose. By chaining methods like `search`, `filter`, `sort`, `paginate`, and `fields`, it allows you to easily apply multiple operations to a query in a readable and maintainable way.

