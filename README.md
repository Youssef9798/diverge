# User Management Platform (Diverge)

This is the documentation of diverge assessment User Management Platform

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Setup and Run Instructions

To set up and run the project, follow these steps:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Youssef9798/diverge.git
   cd diverge
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Build and run the project:**

   ```sh
   npm run build
   npm start
   ```

4. **Run Unit Tests with [Vitest](https://vitest.dev/)**

   ```sh
   npm run test:unit
   ```

5. **Run End-to-End Tests with [Cypress](https://www.cypress.io/)**

   ```sh
   npm run test:e2e:dev
   ```

   This runs the end-to-end tests against the Vite development server.
   It is much faster than the production build.

   But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

   ```sh
   npm run build
   npm run test:e2e
   ```

6. **Lint with [ESLint](https://eslint.org/)**

   ```sh
   npm run lint
   ```

7. **Access the application:**
   Open your browser and go to `http://localhost:5173` (or the appropriate port).

## Architectural Decisions and Approach

### Technologies Used

- **Frontend:** Vue 3, Pinia for state management, Tailwind CSS for styling.
- **Testing:** Vitest for unit tests, Cypress for end-to-end tests.

### Architecture Overview

The project follows a modular and maintainable architecture, leveraging Vue 3 and Tailwind CSS for UI development, along with TypeScript for strong typing and better developer experience. I added a new folder to the Vue 3 default strcutre such as api, locales, composables, data, directives, layouts, middleware, types, test.

### api

`api` folder includes `mockApi`. The `mockApi` service is a simulated backend used to mimic real API interactions for user management. It includes authentication, user retrieval, and role-based permission handling, all with simulated network latency.

#### Features

- **Simulated API Latency**: Responses include random delays to emulate real-world API calls.
- **User Authentication**: Login endpoint with role-based access control.
- **User Management**: CRUD operations for users.
- **Role Management**: Retrieves predefined user roles and their permissions.
- **Error Simulation**: Supports forced errors for testing failure scenarios.

### API Methods

#### `mockApi.login(email: string, password: string)`

**Description**: Authenticates a user and returns user details along with role-based permissions.

#### Returns

```ts
Promise<{
  isSuccess: boolean
  message: string
  user: Omit<User, 'password'>
  permissions: string[]
}>
```

---

#### `mockApi.getUsers(params?: GetUsersParams)`

**Description**: Fetches a paginated list of users with optional filtering and sorting.

#### Parameters

- `page`: Page number (default: 1)
- `limit`: Number of users per page (default: 20)
- `filter`: Query parameters for filtering users
- `sortBy`: Sorting field (default: 'name')
- `sortOrder`: Sorting order ('asc' or 'desc')

#### Returns

```ts
Promise<{
  isSuccess: boolean
  message: string
  users: Omit<User, 'password'>[] | null
  total: number
}>
```

---

#### `mockApi.getUser(id: number)`

**Description**: Fetches a single user by ID.

#### Returns

```ts
Promise<{
  isSuccess: boolean
  message: string
  user: Omit<User, 'password'> | null
}>
```

---

#### `mockApi.createUser(user: Omit<User, 'id' | 'dateJoined' | 'status'>)`

**Description**: Creates a new user with a pending status.

#### Returns

```ts
Promise<{
  isSuccess: boolean
  message: string
  newUser: Omit<User, 'password'> | null
}>
```

---

#### `mockApi.updateUser(id: number, data: Omit<User, 'id' | 'dateJoined' | 'password'>)`

**Description**: Updates user details.

#### Returns

```ts
Promise<{
  isSuccess: boolean
  message: string
  user: Omit<User, 'password'> | null
}>
```

---

#### `mockApi.deleteUser(id: number)`

**Description**: Deletes a user by ID.

#### Returns

```ts
Promise<{
  isSuccess: boolean
  message: string
}>
```

---

#### `mockApi.getRoles()`

**Description**: Retrieves available user roles.

#### Returns

```ts
Promise<Role[]>
```

---

#### Role-Based Permissions

#### Predefined Roles

- **ADMIN**: Full access to user management and permissions.
- **MANAGER**: Limited to viewing users and dashboard.
- **VIEWER**: Can only view the dashboard.

#### Role Permissions

```ts
const rolePermissions: RolePermissions = {
  [Role.ADMIN]: [
    'view_dashboard',
    'view_users',
    'add_users',
    'view_user',
    'change_password',
    'edit_users',
    'delete_users',
    'give_permissions',
  ],
  [Role.MANAGER]: ['view_dashboard', 'view_users', 'view_user'],
  [Role.VIEWER]: ['view_dashboard'],
}
```

---

#### Error Handling

The `mockApi` service includes an error simulation feature:

- If `mockApi.simulatedError = true`, the next API call will throw an error.
- Errors return an object with `isSuccess: false` and a relevant message.

Example:

```ts
mockApi.simulatedError = true
await mockApi.getUsers().catch((error) => console.error(error.message))
```

---

### locales

`locales` folder includes the locales files of english and arabic versions which will be used for rendereing the required language content.

This document describes the localization configuration used in the application. It defines text labels, messages, errors, buttons, and modal content that can be translated or customized for different languages.

#### Structure

The localization file is structured as follows:

- **Links (`links`)**: Defines navigation-related labels.
- **Pages (`pages`)**: Contains labels for different pages.
- **Buttons (`buttons`)**: Stores button text labels.
- **Keywords (`keywords`)**: Stores miscellaneous keywords.
- **Messages (`messages`)**: Stores general messages displayed to users.
- **Errors (`errors`)**: Stores error messages for form validation and input handling.
- **Inputs (`inputs`)**: Stores labels for form input fields.
- **Modals (`modals`)**: Defines modal-related labels and messages.

---

### composables

`composables` folder includes two files of composables as follows.

#### helpers.composables.ts

#### `useDebounce<T>(value: Ref<T>, delay: number = 300): Ref<T>`

**Description:**
A debounce utility for Vue's reactive references (`Ref<T>`). It ensures that the provided `value` is updated only after a specified delay, reducing the number of updates in rapid succession.

**Parameters:**

- `value: Ref<T>` - A reactive reference that needs debouncing.
- `delay: number` (default: 300ms) - The delay before updating the debounced value.

**Returns:**

- `Ref<T>` - The debounced reactive reference.

---

#### `useFormatDate(date: string | Date, format: string): string`

**Description:**
A date formatting utility that leverages `moment.js` to format a given date.

**Parameters:**

- `date: string | Date` - The date to format.
- `format: string` - The formatting pattern (e.g., `YYYY-MM-DD`).

**Returns:**

- `string` - The formatted date string.

---

#### `useHasPermission(permissions: string[] | string): boolean`

**Description:**
A permission-checking utility that verifies if the authenticated user has the specified permission(s).

**Parameters:**

- `permissions: string[] | string` - A single permission string or an array of permissions.

**Returns:**

- `boolean` - `true` if the user has the required permission(s), otherwise `false`.

---

#### `useFiltersToQueryParams(filters: Record<string, string>): string`

**Description:**
Converts an object of filter parameters into a URL query string.

**Parameters:**

- `filters: Record<string, string>` - An object containing filter key-value pairs.

**Returns:**

- `string` - A URL-encoded query string.

---

#### dataTable.composables.ts

#### `getRecordProperty<T extends Record<string, unknown>>(item: T | string | null | undefined, key: string): string`

**Description:**
Retrieves a nested property from an object based on a dot-separated key path. If the key does not exist, it returns a fallback value (`'-'`).

**Parameters:**

- `item: T | string | null | undefined` - The object or string to retrieve data from.
- `key: string` - The dot-separated key path (e.g., `user.name`).

**Returns:**

- `string` - The resolved value or `'-'` if the key does not exist.

---

### data

`data` folder includes the navigation static data and mocked users objects.

### directives

`directives` folder includes a single custom directive clickAway which elements using the directive to do some logic if there is any clicks outside the elements.

### layouts

`layouts` folder includes two layout files represents the authicated users layout and the default layout.

### middleware

`middleware` folder includes two middleware files `routeGuard` which responsible for prevent unauth users from access pages that requires access. `loadLayout` which is responsible for loading routes layouts based on the route meta layout.

### types

`types` folder includes all types required for the project

### api.d.ts

#### `User` Interface

**Description:**
Represents a user in the system with relevant attributes.

**Properties:**

- `id: number` - Unique identifier for the user.
- `name: string` - Full name of the user.
- `email: string` - Email address of the user.
- `role: Role` - Role of the user (`admin`, `manager`, `viewer`).
- `status: Status` - Account status (`active`, `inactive`, `pending`).
- `dateJoined: string` - The date the user joined.
- `password?: string` - (Optional) User's password (excluded in responses for security).

---

#### `GetUsersParams` Type

**Description:**
Defines parameters for fetching users.

**Properties:**

- `page?: number` - Page number for pagination.
- `limit?: number` - Number of users per page.
- `filter?: string` - Filter string for search.
- `sortBy?: keyof User` - Sorting parameter.
- `sortOrder?: 'asc' | 'desc'` - Sorting order.

---

#### `RolePermissions` Type

**Description:**
Defines permission levels for each role.

**Structure:**

- `Role.ADMIN` - Full access to user management.
- `Role.MANAGER` - Limited access to user information.
- `Role.VIEWER` - Read-only access.

---

### dataTable.d.ts

#### `Headers` Type

**Description:**
Defines table header properties.

**Properties:**

- `label: string` - Display label.
- `key: string` - Data key reference.
- `sortable?: boolean` - If column is sortable.
- `searchable?: boolean` - If column is searchable.
- `width?: string` - Column width.
- `class?: string | object | string[]` - Custom styling classes.

---

#### `UsersFilters` Type

**Description:**
Defines filters applicable to users.

**Properties:**

- `status?: Status` - Filter by user status.
- `role?: Role` - Filter by user role.
- `name?: string` - Filter by user name.
- `email?: string` - Filter by user email.

---

### enums.ts

#### `Role` Enum

**Description:**
Defines user roles in the system.

**Values:**

- `ADMIN = 'admin'` - Full access.
- `MANAGER = 'manager'` - Limited access.
- `VIEWER = 'viewer'` - Read-only access.

---

#### `Status` Enum

**Description:**
Defines user status levels.

**Values:**

- `ACTIVE = 'active'` - Active user.
- `INACTIVE = 'inactive'` - Inactive user.
- `PENDING = 'pending'` - Pending approval.

---

### sidebarLinks.d.ts

#### `MenuItem` Type

**Description:**
Represents a navigation menu item.

**Properties:**

- `name: string` - Display name.
- `path: string` - Navigation path.
- `icon: string` - Associated icon.
- `permissions: string[]` - Required permissions.

---

#### `MenuCategory` Type

**Description:**
Defines a categorized menu structure.

**Properties:**

- `category: string` - Category label.
- `permissions: string[]` - Permissions required for access.
- `children: MenuItem[]` - Sub-items under this category.

## Answers to Architecture Questions

Provide detailed answers to key architecture questions, such as scalability considerations, data integrity strategies, and API design principles used in the project.

### Optimization of API Calls

To optimize API calls for performance, Implemented request debouncing and throttling for frequently updated data. Additionally, using pagination, lazy loading, and background fetching strategies ensures that only the necessary data is loaded. Implementing a caching to authenticated user using Pinia. Mainly this application could be go through performance optimization to imporve it.

### Handling Shared Logic Between Components

Shared logic can be managed using Vue 3's composables (i.e., reusable functions created using the Composition API). This approach allows logic to be encapsulated in separate files and shared across multiple components. I am using defineModel and props and expose and Pinia store to share and access data and required props between components.

### Client-Side Data Caching

I achieved this using Pinia, which enable automatic cache. Additionally, storing authentcated user data in localStorage and Pinia state to access it through different pages and components.

### Scaling User Permission Types

Based on my experience to support hundreds user permission types. Permissions represented into JSON responses or any format which these permissions fetched on every fisrt access and thesse permissions stores into the store and browser caching which can be used anytime everywhere. I already make a way to extend the usage of the permissions and the role-based rendering. Also we can use env variables on some specific cases.

### Testing Strategy

The testing strategy includes unit tests for individual functions and composables, integration tests for API interactions, and end-to-end (E2E) tests for user flows. I used Vitest for unit and integration tests and Cypress for E2E testing. The focus would be on testing critical business logic, authentication flows, and permission handling while maintaining a balance between test coverage and performance. I didn't covered all the possible test cases due to the shortage of time but for better testing environment TDD could be better.

### Handling Offline Capabilities

Offline capabilities can be handled by caching essential data in `localStorage` or `IndexedDB`. Implementing service workers allows for offline-first experiences by caching assets and API responses. Additionally, notifying users when they are offline and queuing API requests to be sent once the connection is restored improves the user experience.

## Implemented Features

### Authentication & Authorization

#### **Authentication & Authorization**

- **Login System**: Users can log in using their email and password.
- **Role-Based Permissions**: Users have different roles (`Admin`, `Manager`, `Viewer`), each with specific permissions.
- **Access Control**: Pages and actions are restricted based on user permissions.

#### **User Management**

- **View Users**: Fetch and display a paginated list of users.
- **Search & Filtering**: Users can be filtered by `name`, `email`, `role`, or `status`.
- **Sorting**: Users can be sorted by various fields like `name`, `dateJoined`, etc.
- **View User Details**: Retrieve detailed information about a specific user.
- **Create User**: Add a new user with role assignment.
- **Update User**: Modify user details (excluding password) if the edit permission is available.
- **Delete User**: Remove a user from the system.

#### **Mock API Service**

- **Simulated Backend**: A `mockApi` service provides CRUD operations for users and roles.
- **Latency Simulation**: API requests simulate real-world delays.
- **Error Handling**: Simulated API failures for testing purposes.

#### **Reusable UI Components**

- **Data Table Components**: Supports dynamic headers, sorting, and filtering and pagination.
- **Sidebar & Navigation**: Sidebar links dynamically generated based on permissions.
- **Buttons & Modals**: Common UI elements like `Add User`, `Delete Confirmation`, etc.
- **MDI Icons**: A component used for rendering mdi icons provided on @mdi/js package.
- **Dropdown Menu**: A component used wrapping the dropdown menus buttons and list.

#### **Composables & Utility Functions**

- **Debounce Hook**: Optimized input handling with a debounce function.
- **Date Formatter**: Formats dates using `moment.js`.
- **Permission Checker**: Determines if a user has the required permissions.
- **Query String Generator**: Converts filters into query parameters.
- **Dynamic Property Getter**: Extracts nested object properties dynamically to be used on the DataTable component.

#### **Localization & Translations**

- **Multi-Language Support**: Static texts and UI labels are stored in a structured JSON format for easy translation suportting English and Arabic versions.

#### **UI**

- **Simple & Modern UI**: A simple and modern UI based on TailwindCSS components with light colors.
- **Dark & Light theme**: Support the dark and light themes.

#### **Error Handling & Feedback**

- **Form Validations**: Ensures required fields and valid input formats.
- **User-Friendly Messages**: Errors and system messages provide clear feedback.
- **404 & 401 Pages**: Custom pages for unauthorized access and missing routes.
