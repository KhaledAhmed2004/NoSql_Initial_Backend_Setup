

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

