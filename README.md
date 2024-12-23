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
