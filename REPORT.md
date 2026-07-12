# Web API Development Report

## Archive Outfitters — A Full-Stack E-Commerce Platform

---

**Student Name:** Sabja Shrestha  
**Student ID:** 240122  
**Module:** ST6003CEM Web API Development  
**Word Count:** ~1,850  
**Date:** 4 July 2026

---

## 1. Introduction

### Aims and Objectives

The aim of this project was to design and develop a fully functional full-stack web application that demonstrates practical and theoretical understanding of modern web development technologies. The objectives were to build a RESTful API backend using Node.js and Express, integrate it with a dynamic frontend using Next.js and React, persist data through a suitable NoSQL database, implement secure authentication and authorisation, and deploy a production-ready system that solves a real-world problem.

### Project Overview — Archive Outfitters

Archive Outfitters is an e-commerce web application that allows users to browse products, manage a shopping cart, place orders, and view their order history. The application includes user authentication (local registration/login as well as Google and Facebook OAuth), password reset functionality, an admin panel for managing users, products, and orders, and an AI-powered product recommendation engine. The application supports five languages (English, Spanish, Portuguese, Japanese, and Nepali) and both light and dark themes.

### Target Users

The primary target users are online shoppers looking for a streamlined, mobile-friendly shopping experience. The secondary user group is store administrators who need a centralised dashboard to manage inventory, view orders, and track sales analytics.

### Problems Solved

Traditional e-commerce platforms often suffer from complex interfaces, slow load times, and poor mobile responsiveness. Archive Outfitters solves these problems by leveraging Next.js server-side rendering for fast initial loads, a responsive Tailwind CSS design that works seamlessly on mobile devices, and a lightweight React-based frontend that provides a smooth, app-like user experience.

### App Monetisation

The application generates revenue through direct product sales. Each order placed by a customer contributes to the store's revenue, which is tracked in the analytics dashboard. Future monetisation could include featured product placements and premium seller accounts.

### Similar Apps and Differentiation

Similar platforms such as Shopify and WooCommerce offer e-commerce solutions, but Archive Outfitters differentiates itself by providing a custom-built, lightweight solution with built-in AI-driven product recommendations, multi-language support, and a clean, minimalistic interface that prioritises user experience over feature bloat.

---

## 2. Technology Stack

### Backend — Node.js with Express (TypeScript)

Node.js was chosen as the runtime for its event-driven, non-blocking I/O model, which is ideal for handling multiple concurrent API requests in an e-commerce environment (Node.js Foundation, 2018). Express provides a minimal and flexible routing layer that allows for rapid API development. TypeScript adds static typing, reducing runtime errors and improving maintainability.

**Key dependencies:**
- `express` ^4.19.2 — HTTP server framework
- `mongoose` ^8.4.0 — MongoDB ODM
- `jsonwebtoken` ^9.0.2 — JWT-based authentication
- `bcryptjs` ^2.4.3 — Password hashing
- `zod` ^3.23.8 — Schema validation
- `passport` ^0.7.0 — OAuth strategies (Google, Facebook)
- `multer` ^1.4.5 — File upload handling
- `nodemailer` ^6.9.13 — Email service for password reset

### Frontend — Next.js 14 with React and TypeScript

Next.js was selected for its hybrid rendering capabilities (server-side rendering and static generation), built-in routing, and API route support. Version 14 introduced the App Router, which provides a more intuitive file-based routing system. React 18 provides a component-based architecture for building reusable UI elements.

**Key dependencies:**
- `next` 14.2.3 — React framework with SSR
- `react` ^18 — UI library
- `axios` ^1.7.2 — HTTP client
- `js-cookie` ^3.0.5 — Client-side cookie management
- `zod` ^3.23.8 — Client-side validation
- `tailwindcss` ^3.4.1 — Utility-first CSS framework

### Database — MongoDB with Mongoose

MongoDB was chosen for its flexible document-based data model, which aligns well with the varied data structures in an e-commerce application (products, orders, users). Mongoose provides schema validation, middleware (pre-save hooks for password hashing), and a clean API for database interactions.

### Why These Choices

The MERN-like stack (MongoDB, Express, React, Node) with Next.js was chosen because it uses JavaScript/TypeScript across the entire development pipeline, enabling code reuse and reducing context switching (Wieruch, 2020). Next.js specifically eliminates the need for a separate backend rendering layer while providing excellent SEO capabilities through SSR. MongoDB's schema-less nature accommodates rapid feature iteration without costly migrations.

---

## 3. Research — Modern Web Technology Stack for Full-Stack Development

A modern full-stack web technology stack refers to a cohesive set of technologies used to build both the client-side and server-side components of a web application. According to Sestili (2023), a full-stack technology stack typically comprises a frontend framework for building user interfaces, a backend runtime for handling HTTP requests and business logic, and a database for persistent data storage.

The stack chosen for this project — **Next.js + Node.js/Express + MongoDB** — represents a modern evolution of the traditional MERN stack. What distinguishes this stack is Next.js's ability to serve as both a frontend framework and a backend layer through its server-side rendering capabilities and API route support. This reduces architectural complexity while maintaining separation of concerns.

The primary advantage of this stack is its use of TypeScript across all layers, which provides compile-time type checking and improved developer experience. Additionally, the component-based architecture of React enables modular development, where individual features (product listings, cart, orders) can be developed and tested in isolation before being composed into pages.

---

## 4. REST API Development

### Key Endpoints

The backend exposes a RESTful API under the `/api/v1` base path. The following table summarises the key endpoints:

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user (409 on duplicate email) |
| POST | `/auth/login` | No | Login, returns JWT + httpOnly cookie |
| POST | `/auth/logout` | No | Clears auth cookie |
| GET | `/auth/whoami` | JWT | Returns current user |
| PUT | `/auth/update` | JWT | Update profile/avatar/password |
| POST | `/auth/forgot-password` | No | Sends 6-digit reset code via email |
| POST | `/auth/reset-password` | No | Verifies code + resets password |
| GET | `/products` | No | List all products |
| POST | `/products` | Admin | Create product (multipart) |
| PUT | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |
| PATCH | `/products/:id/favorite` | No | Toggle product favourite |
| POST | `/orders` | JWT | Create order |
| GET | `/orders/my` | JWT | Get current user's orders |
| GET | `/recommendations` | JWT | Get personalised recommendations |
| GET | `/admin/users` | Admin | List users (paginated, searchable) |
| POST | `/admin/users` | Admin | Create user |
| PUT | `/admin/users/:id` | Admin | Update user |
| DELETE | `/admin/users/:id` | Admin | Delete user |
| GET | `/admin/orders` | Admin | List all orders |
| PATCH | `/admin/orders/:id/status` | Admin | Update order status |
| GET | `/admin/analytics` | Admin | Get revenue and usage analytics |

### CRUD Operations

Full CRUD (Create, Read, Update, Delete) operations are implemented for the `User`, `Product`, and `Order` resources. Product management includes image upload via Multer with validation (JPEG/PNG/WEBP/GIF only, max 5MB). Order creation includes server-side validation to verify that all ordered products exist in the database and calculates the total price automatically.

### Authentication

Authentication uses JWT (JSON Web Tokens). On login, the server returns a signed token and sets it as an httpOnly cookie for security against XSS attacks. The `authenticate` middleware verifies the token from either the cookie or the `Authorization: Bearer` header. Admin-only endpoints are protected by a secondary `requireAdmin` middleware that checks the user's role.

### Testing Summary

API testing was performed using PowerShell's `Invoke-WebRequest` (equivalent to Postman/curl). Key test results:

```
REGISTER   → 201 {"success":true, "message":"Account created successfully"}
LOGIN      → 200 {"success":true, "data":{"token":"eyJ..."}}
WHOAMI     → 200 {"success":true, "data":{"id":"...", "fullName":"Test User"}}
DUPLICATE  → 409 (email already exists)
PRODUCTS   → 200 {"success":true, "data":[...3 products...]}
```

---

## 5. Frontend

### Component Structure

The frontend follows Next.js 14's App Router convention, where each folder under `app/` corresponds to a route segment. The component tree is structured as follows:

```
RootLayout (ThemeProvider → LanguageProvider → AuthProvider)
├── SplashPage (/)
├── LoginPage (/login)
├── RegisterPage (/register)
├── ForgotPasswordPage (/forgot-password)
├── ResetPasswordPage (/reset-password)
├── DashboardLayout (/dashboard)
│   ├── DashboardPage (products, cart, orders, profile)
│   ├── ProfilePage (/dashboard/profile)
│   └── PasswordPage (/dashboard/password)
├── AdminLayout (/admin)
│   ├── AdminOverview (/admin)
│   ├── AnalyticsPage (/admin/analytics)
│   ├── ProductsPage (/admin/products)
│   ├── OrdersPage (/admin/orders)
│   ├── UsersPage (/admin/users)
│   │   ├── CreateUserPage (/admin/users/create)
│   │   ├── UserDetailPage (/admin/users/[id])
│   │   └── EditUserPage (/admin/users/[id]/edit)
```

### Client and Server Components

Next.js 14 distinguishes between Server Components (rendered on the server, no client-side JavaScript) and Client Components (hydrated on the client with interactivity). In this project, layout components and non-interactive pages use Server Components by default. Interactive pages (dashboard, login, admin) use the `'use client'` directive to enable event handlers, hooks, and browser APIs.

### State Management

React Context API is used for global state management, avoiding the complexity of external libraries like Redux for this project's scope:

- **AuthContext** — Manages user authentication state, login/logout functions, and cookie synchronisation
- **ThemeContext** — Manages light/dark theme toggle with localStorage persistence
- **LanguageContext** — Manages the selected language with localStorage persistence and provides a translation function (`t()`)

### Routing

Routing is handled automatically by Next.js file-based routing. Each `page.tsx` file in a folder creates a corresponding route. Dynamic routes (e.g., `/admin/users/[id]/edit`) use bracket-notation folders.

The Next.js Edge Middleware (`middleware.ts`) protects routes by checking for a valid token cookie and redirecting unauthenticated users to `/login`. Authenticated users are redirected away from `/login` and `/register` to either `/dashboard` or `/admin` based on their role.

### API Integration

The frontend communicates with the backend through Axios. In development, Next.js rewrites (`next.config.js`) proxy `/api/*` requests to `http://localhost:5000/api/*`, eliminating CORS issues. Admin operations use Next.js Server Actions (`'use server'`) that read the httpOnly cookie directly from the server-side request headers.

---

## 6. Design Patterns and Architecture

### MVC Pattern

The Model-View-Controller (MVC) pattern is a software architectural pattern that separates an application into three interconnected components (Gamma et al., 1994). The **Model** represents the data and business logic, the **View** represents the presentation layer, and the **Controller** handles user input and updates the model.

In this project, MVC is implemented as follows:
- **Model:** Mongoose schemas (`User`, `Product`, `Order`) in `src/models/`
- **View:** Next.js React components in `app/` directory
- **Controller:** Express route handlers in `src/controllers/`

### Layered Architecture

Beyond MVC, the backend employs a layered architecture:

```
┌──────────────────────────────────────────────────────┐
│                    Routes                             │
│     (HTTP method + path → middleware → controller)    │
├──────────────────────────────────────────────────────┤
│                    Middleware                          │
│     (authenticate, requireAdmin, upload, errorHandler)│
├──────────────────────────────────────────────────────┤
│                   Controllers                          │
│     (request parsing, response formatting)             │
├──────────────────────────────────────────────────────┤
│                    Services                            │
│     (business logic: register, login, recommend)       │
├──────────────────────────────────────────────────────┤
│                    Models                              │
│     (Mongoose schemas, DB interaction)                 │
└──────────────────────────────────────────────────────┘
```

This separation ensures that each layer has a single responsibility. Routes define the API surface, middleware handles cross-cutting concerns (authentication, authorisation, file uploads), controllers parse and validate input, services implement business logic, and models handle data persistence.

### Why This Architecture

This layered approach was chosen because it promotes testability, maintainability, and scalability. Each layer can be tested independently, changes to business logic do not affect route definitions, and new features can be added without modifying existing code.

---

## 7. Database Design — Entity Relationship

The database consists of three main collections:

**User**
```
fullName: String (required)
email: String (required, unique, lowercase)
password: String (required, minlength: 8, select: false)
avatar: String
age: Number
role: String (enum: user | admin, default: user)
provider: String (enum: local | google | facebook)
providerId: String
resetPasswordCode: String
resetPasswordExpires: Date
timestamps: true
```

**Product**
```
name: String (required, trim)
price: Number (required)
imageUrl: String (required)
isFavourite: Boolean (default: false)
timestamps: true
```

**Order**
```
user: ObjectId (ref: User)
items: [{
  product: ObjectId (ref: Product)
  name: String (snapshot)
  price: Number (snapshot)
  imageUrl: String (snapshot)
  quantity: Number (min: 1)
}]
totalPrice: Number
status: String (enum: Pending | Shipped | Delivered | Cancelled)
delivery: { name, address, phone }
timestamps: true
```

Orders embed item snapshots (name, price, imageUrl) to preserve historical data even if products are later modified or deleted — a common e-commerce pattern known as "snapshotting."

---

## 8. Challenges Faced and Lessons Learned

### Challenge 1: OAuth Callback Redirection

Integrating Google and Facebook OAuth required careful handling of callback URLs and session management. The initial implementation failed because the OAuth callback redirected to the frontend without preserving the authentication state. This was resolved by signing a JWT server-side during the callback and setting the cookie before redirecting to the frontend dashboard.

### Challenge 2: Server Actions vs. Client-Side API Calls

For admin operations, the initial approach used client-side API calls, but the httpOnly cookie was inaccessible from client-side JavaScript. The solution was to migrate admin operations to Next.js Server Actions (`'use server'`), which run on the server and can read cookies directly from the request headers.

### Challenge 3: Recommendation Engine Fallbacks

The collaborative filtering recommendation engine returned empty results when users had no order history. A fallback strategy was implemented: first attempt collaborative filtering based on similar users' order patterns, then fall back to age-aware keyword matching, and finally return top-selling products.

### Skills Gained

**Technical skills:** RESTful API design with Express, JWT authentication, MongoDB schema design with Mongoose, Next.js App Router and Server Actions, TypeScript type safety, Zod validation, OAuth 2.0 integration, and responsive UI development with Tailwind CSS.

**Soft skills:** Project planning and time management, debugging complex multi-service interactions, and making architectural trade-off decisions balancing development speed with code quality.

---

## 9. Conclusion and Future Improvements

Archive Outfitters successfully demonstrates a modern full-stack web application built with Next.js, Node.js/Express, and MongoDB. The application implements secure authentication, full CRUD operations, a responsive frontend, and an admin dashboard for business management. The layered MVC architecture ensures maintainability, and the use of TypeScript across the stack reduces runtime errors.

### Future Improvements

1. **Payment gateway integration** — Adding Stripe or PayPal for real payment processing
2. **Unit and integration tests** — Adding Jest/Supertest for backend and React Testing Library for frontend
3. **Docker containerisation** — Packaging the application for consistent deployment
4. **CI/CD pipeline** — Automating testing and deployment with GitHub Actions
5. **WebSocket notifications** — Real-time order status updates for users and admin

---

## 10. References

Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley.

Node.js Foundation. (2018). *Node.js Application Guide*. https://nodejs.org/en/docs/guides/

Sestili, M. (2023). *Modern Full-Stack Development: A Practical Guide*. O'Reilly Media.

Wieruch, R. (2020). *The Road to React*. https://www.roadtoreact.com/

Mozilla Developer Network. (2024). *HTTP authentication*. https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication

Mongoose.js. (2024). *Mongoose Documentation*. https://mongoosejs.com/docs/

Next.js. (2024). *Next.js Documentation*. https://nextjs.org/docs

Express.js. (2024). *Express API Reference*. https://expressjs.com/en/api.html

---

## Appendix A — API Test Logs

```
TEST 1: Register
POST /api/v1/auth/register
Body: {"fullName": "Test User", "email": "test@example.com", "password": "password123"}
Response: 201
{"success":true, "message":"Account created successfully",
 "data":{"id":"6a48c7849fbc19388696f182","fullName":"Test User","email":"test@example.com","role":"user"}}

TEST 2: Login
POST /api/v1/auth/login
Body: {"email": "test@example.com", "password": "password123"}
Response: 200
{"success":true, "message":"Logged in successfully",
 "data":{"token":"eyJ...","user":{"id":"6a48c7849fbc19388696f182","fullName":"Test User","email":"test@example.com"}}}

TEST 3: Duplicate Email
POST /api/v1/auth/register
Body: {"fullName": "Another User", "email": "test@example.com", "password": "password123"}
Response: 409 (Conflict)

TEST 4: Whoami
GET /api/v1/auth/whoami
Cookie: token=eyJ...
Response: 200
{"success":true, "data":{"id":"6a48c7849fbc19388696f182","fullName":"Test User","email":"test@example.com","role":"user"}}

TEST 5: Get Products
GET /api/v1/products
Response: 200
{"success":true, "data":[
  {"name":"Zip Up Hoodie","price":1600},
  {"name":"Portugal Away Kit WC26","price":2000},
  {"name":"Summer Tees","price":1650}
]}

TEST 6: Recommendations
GET /api/v1/recommendations
Cookie: token=eyJ...
Response: 200
{"success":true, "data":[
  {"name":"Zip Up Hoodie","price":1600},
  {"name":"Portugal Away Kit WC26","price":2000}
]}
```

## Appendix B — Architectural Diagrams

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                            │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Next.js 14 (App Router)                      │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │  │
│  │  │  Splash  │  │  Login   │  │ Dashboard│  │  Admin   │ │  │
│  │  │  Page    │  │  /Register│  │  /Orders │  │  Panel   │ │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │           Context Providers                          │ │  │
│  │  │  AuthContext | ThemeContext | LanguageContext         │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │  Next.js Middleware (Route Protection)               │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                       │
│  ┌──────────────────────┴──────────────────────────────────────┐│
│  │        Next.js Rewrites Proxy (/api/* → localhost:5000)    ││
│  └──────────────────────┬──────────────────────────────────────┘│
└─────────────────────────┼────────────────────────────────────────┘
                          │ HTTP
┌─────────────────────────┴────────────────────────────────────────┐
│                    EXPRESS SERVER (Port 5000)                      │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                     Routes                                  │   │
│  │  /auth  │  /products  │  /orders  │  /admin  │  /recomms   │   │
│  └────────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                   Middleware                                │   │
│  │  authenticate → requireAdmin → upload → errorHandler       │   │
│  └────────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                   Controllers                               │   │
│  │  authController │ productController │ orderController       │   │
│  │  oauthController │ recommendationController                  │   │
│  │  admin/userController │ admin/orderController                │   │
│  │  admin/analyticsController                                   │   │
│  └────────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                  Services                                   │   │
│  │  userService │ emailService │ recommendationService         │   │
│  └────────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                  Models (Mongoose)                          │   │
│  │  User │ Product │ Order                                    │   │
│  └────────────────────────────────────────────────────────────┘   │
└─────────────────────────┬────────────────────────────────────────┘
                          │
                    ┌─────┴─────┐
                    │  MongoDB   │
                    └───────────┘
```

### Data Flow Diagram

```
User Action (click)
  → Client Component (event handler)
    → Frontend Action (lib/actions/) or API Service (lib/api/)
      → Axios /api/v1/*
        → Next.js Rewrite → Express Backend
          → Middleware (auth, admin, upload)
            → Controller
              → Service (business logic)
                → Model (Mongoose)
                  → MongoDB
```

## Appendix C — UI Screenshots

*[INSERT SCREENSHOT: Splash page showing "archive outfitters" logo and "Enter" link]*
*[INSERT SCREENSHOT: Login page with email/password fields and OAuth buttons]*
*[INSERT SCREENSHOT: Registration page with form fields]*
*[INSERT SCREENSHOT: Dashboard showing product grid with search, cart, and recommendations]*
*[INSERT SCREENSHOT: Admin dashboard with navigation cards]*
*[INSERT SCREENSHOT: Admin users page with table and search]*
*[INSERT SCREENSHOT: Admin analytics page with revenue chart and statistics]*
