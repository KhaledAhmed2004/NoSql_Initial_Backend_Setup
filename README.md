# Project Requirement Analysis

When starting a project quickly, it's important to conduct a **requirement analysis**. The following is an example of how to structure **functional requirements**:

## Functional Requirements

### 1. Authentication

#### a. **Student**
- Students can **login** and **logout** securely.
- Students can **update their password**.

#### b. **Faculty**
- Faculty can **login** and **logout** securely.
- Faculty can **update their password**.

#### c. **Admin**
- Admin can **login** and **logout** securely.
- Admin can **update their password**.

### 2. Profile Management

#### a. **Student**
- Students can **manage and update** their profile securely.
- Students can **update specific fields** in their profile.

#### b. **Faculty**
- Faculty can **manage and update** their profile securely.
- Faculty can **update specific fields** in their profile.

#### c. **Admin**
- Admin can **manage and update** user profiles securely.
- Admin can **update specific fields** in any profile.

### 3. Academic Process

#### a. **Student**
- Students can **enroll** in courses for a specific semester.
- Students can **view their class schedule**.
- Students can **see their grades**.
- Students can **view the notice board and events**.

#### b. **Faculty**
- Faculty can **manage student grades**.
- Faculty can **access student personal and academic information**.

#### c. **Admin**
- Admin can **manage multiple processes**:
  - **Semester** management
  - **Course** management
  - **Ordered courses**
  - **Section** management
  - **Room** management
  - **Building** management

### 4. User Management

#### a. **Admin**
- Admin can **manage multiple user accounts**.
- Admin can **block or unblock users**.
- Admin can **change user passwords**.

# data modle
To avoid confusion and maintain consistency, it’s important to define the data structure at the start.

 give a example:
### **Student Data Model**

- `_id`: ObjectId (generated automatically)
- `id`: String (unique ID for the student)
- `password`: String (hashed password)
- `name`: String (full name of the student)
- `gender`: String (gender of the student)
- `dateOfBirth`: Date (date of birth)
- `email`: String (email address)
- `contactNo`: String (phone number)
- `emergencyContactNo`: String (emergency contact number)
- `presentAddress`: String (current address)
- `permanentAddress`: String (permanent address)
- `guardian`: String (name of the guardian)
- `localGuardian`: String (name of the local guardian)
- `profileImage`: String (URL or path to profile image)
- `status`: String (current status of the student, e.g., active, graduated)
- `isDeleted`: Boolean (soft delete flag)
- `createdAt`: Date (record creation date)
- `updatedAt`: Date (record last update date)
- `academicDepartment`: String (department the student is enrolled in)

### **Faculty Data Model**

- `_id`: ObjectId (generated automatically)
- `id`: String (unique ID for the faculty)
- `password`: String (hashed password)
- `name`: String (full name of the faculty)
- `gender`: String (gender of the faculty)
- `dateOfBirth`: Date (date of birth)
- `email`: String (email address)
- `contactNo`: String (phone number)
- `emergencyContactNo`: String (emergency contact number)
- `presentAddress`: String (current address)
- `permanentAddress`: String (permanent address)
- `localGuardian`: String (name of the local guardian)
- `profileImage`: String (URL or path to profile image)
- `status`: String (current status of the faculty, e.g., active, retired)
- `isDeleted`: Boolean (soft delete flag)
- `createdAt`: Date (record creation date)
- `updatedAt`: Date (record last update date)
- `academicDepartment`: String (department the faculty belongs to)
- `academicFaculty`: String (faculty they are part of)

### **Admin Data Model**

- `_id`: ObjectId (generated automatically)
- `id`: String (unique ID for the admin)
- `password`: String (hashed password)
- `name`: String (full name of the admin)
- `gender`: String (gender of the admin)
- `dateOfBirth`: Date (date of birth)
- `email`: String (email address)
- `contactNo`: String (phone number)
- `emergencyContactNo`: String (emergency contact number)
- `presentAddress`: String (current address)
- `permanentAddress`: String (permanent address)
- `guardian`: String (name of the guardian)
- `localGuardian`: String (name of the local guardian)
- `profileImage`: String (URL or path to profile image)
- `status`: String (current status of the admin, e.g., active)
- `isDeleted`: Boolean (soft delete flag)
- `createdAt`: Date (record creation date)
- `updatedAt`: Date (record last update date)
- `managementDepartment`: String (department the admin is in charge of)

we need to create er digramTo help visualize and understand the relationships and data referencing ammabeding.



# Data Modeling: Embedding vs Referencing

In MongoDB, two common ways to model data are **embedding** and **referencing**. Both methods have their advantages and drawbacks. Below is a comparison of the two approaches to help determine the best fit for your use case.

## Embedding vs Referencing

### 1. **Embedding**

Embedding stores related data directly within a single document. This method works well when the data is often retrieved together and when data consistency is important.

#### **Pros:**
- **Faster reading:** Since all related data is stored together, no additional queries are required to fetch related data.
- **Single query updates:** Updating all data in one place with a single query is possible.
- **Less expensive lookup:** No need for additional lookups to retrieve data.

#### **Cons:**
- **Slow writing and updating:** Writing or updating large documents can be slow, as the entire document needs to be rewritten.
- **Limited size:** Documents are capped at 16MB in size, which may limit the amount of embedded data.
- **Data duplication:** If the same data appears in multiple documents, there may be unnecessary duplication.

---

### 2. **Referencing**

Referencing stores only the IDs (usually ObjectIds) of related documents within a document, pointing to other collections. This method works well when data grows independently and is frequently updated.

#### **Pros:**
- **Fast writing and updating:** Writing and updating documents is fast as only references need to be updated, not the entire document.
- **No data duplication:** Data is stored once, reducing redundancy.
- **Scalable:** Works well for large data sets, as there is no size limitation for individual documents.

#### **Cons:**
- **Slow reading:** Requires additional queries to look up and fetch referenced data, which can impact performance.
- **Expensive lookup:** Lookups to retrieve related data can be more expensive as they require separate queries.
- **Complex queries:** More complex queries and joins may be needed to fetch related data.

---

## Comparison Table

| **Aspect**            | **Embedding**                                         | **Referencing**                                        |
|-----------------------|-------------------------------------------------------|--------------------------------------------------------|
| **Definition**         | Storing related data directly within a document.      | Storing a reference (e.g., ObjectId) to another document. |
| **Faster Reading**     | Yes, because all related data is stored together.     | No, requires additional queries to fetch referenced data. |
| **Writing Performance**| Slow for large data, as the whole document needs to be rewritten. | Fast, as only references are updated.                   |
| **Update Performance** | Slow for complex updates since the entire document must be updated. | Fast, only the reference is updated.                   |
| **Size Limitations**   | Limited to 16MB per document.                        | No size limit, data can grow indefinitely.              |
| **Data Duplication**   | Possible data duplication if data is repeated across multiple documents. | Avoids data duplication by storing only references.     |
| **Scalability**        | Limited scalability due to document size limits.     | High scalability, as data is normalized and stored separately. |
| **Query Performance**  | Less expensive, as no additional lookups are required. | More expensive, requires multiple queries to fetch related data. |
| **Lookup**             | No lookup needed since data is embedded directly in the document. | Requires lookup to retrieve data from the referenced document. |
| **Use Case**           | Best for smaller, self-contained data or when fast access is needed. | Best for larger, frequently updated data or when data needs to be shared between multiple documents. |

---

## Conclusion

Both **embedding** and **referencing** have their own advantages, and the choice between them depends on the specific requirements of your application:

- **Embedding** is suitable for **faster reading** and **simpler use cases** with small to medium-sized data.
- **Referencing** is ideal for **scalable, large applications** with **frequent updates** and **shared data**.

