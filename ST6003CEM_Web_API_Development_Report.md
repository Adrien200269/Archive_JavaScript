# A Project Report On
## Archive Outfitters: A Community-Driven Vintage & Streetwear E-Commerce Platform and RESTful Web API

**Module Title**: ST6003CEM Web API Development  
**Course**: BSc (Hons) in Computing  
**Institution**: Softwarica College of IT & E-Commerce in collaboration with Coventry University  
**Submitted By**: Sabja Shrestha  
**Coventry ID**: 15373146  
**Batch**: 35C  
**Module Leader**: Mr. Albert Maharjan  

---

## Table of Content

1. [Introduction](#1-introduction)
2. [Aim](#2-aim)
3. [Objectives](#3-objectives)
4. [Project Idea](#4-project-idea)
5. [Targeted Users](#5-targeted-users)
6. [Problem Statement](#6-problem-statement)
7. [Research: Next.js 14 App Router, Rendering Patterns & Resumability Comparison](#7-research-nextjs-14-app-router-rendering-patterns--resumability-comparison)
   - 7.1 [Server-Side Rendering (SSR) & Server Components](#71-server-side-rendering-ssr--server-components)
   - 7.2 [Comparative Paradigm: Qwik Framework for Resumability & Instant Loading](#72-comparative-paradigm-qwik-framework-for-resumability--instant-loading)
   - 7.3 [Industry Adoption: Boohoo Group & E-Commerce Scaling](#73-industry-adoption-boohoo-group--e-commerce-scaling)
8. [Technology Stack](#8-technology-stack)
   - 8.1 [The MERN Core](#81-the-mern-core)
   - 8.2 [Frontend & Client-Side Tools](#82-frontend--client-side-tools)
   - 8.3 [Backend & Security Infrastructure](#83-backend--security-infrastructure)
   - 8.4 [Development & Design Support](#84-development--design-support)
9. [REST API Development](#9-rest-api-development)
   - 9.1 [Routes & Endpoint Specification](#91-routes--endpoint-specification)
     - 1. Authentication Routes
     - 2. Catalog & Product Routes
     - 3. Order & Cart Routes
     - 4. Recommendation Routes
     - 5. Payment Routes
     - 6. Chat & Social Routes
     - 7. Admin Management Routes
   - 9.2 [CRUD Operations](#92-crud-operations)
   - 9.3 [Authentication (JWT & Cookie Middleware)](#93-authentication-jwt--cookie-middleware)
10. [Testing and Reliability](#10-testing-and-reliability)
    - 10.1 [Unit Testing (Jest & Supertest)](#101-unit-testing-jest--supertest)
    - 10.2 [Integration Testing](#102-integration-testing)
    - 10.3 [End-to-End (E2E) Testing (Playwright)](#103-end-to-end-e2e-testing-playwright)
11. [Frontend Implementation](#11-frontend-implementation)
    - 11.1 [Component Structure](#111-component-structure)
    - 11.2 [Routing Architecture](#112-routing-architecture)
    - 11.3 [API Integration & Action Flow](#113-api-integration--action-flow)
    - 11.4 [Middleware & Session Proxy](#114-middleware--session-proxy)
12. [Backend Implementation](#12-backend-implementation)
    - 12.1 [Architectural Design (Layered / Onion Architecture)](#121-architectural-design-layered--onion-architecture)
    - 12.2 [Database Connection & ORM Modeling](#122-database-connection--orm-modeling)
13. [Challenges Faced and Solutions](#13-challenges-faced-and-solutions)
14. [Skills Gained](#14-skills-gained)
    - 14.1 [Technical Skills](#141-technical-skills)
    - 14.2 [Soft Skills](#142-soft-skills)
15. [Conclusion and Future Remarks](#15-conclusion-and-future-remarks)
    - 15.1 [Conclusion](#151-conclusion)
    - 15.2 [Future Works](#152-future-works)
16. [References](#16-references)
17. [Appendix](#17-appendix)
    - 17.1 [GitHub URL](#171-github-url)
    - 17.2 [YouTube URL](#172-youtube-url)
    - 17.3 [Test Logs](#173-test-logs)
    - 17.4 [Entity Relationship Diagram (ERD)](#174-entity-relationship-diagram-erd)
    - 17.5 [System Screenshots](#175-system-screenshots)

---

## Table of Figures

- **Vis 1**: Archive Outfitters Brand Logo & Platform Header
- **Vis 2**: Project Objectives Lifecycle & Technical Scope Diagram
- **Vis 3**: Targeted Users Persona Matrix (Students, Vintage Collectors, Resellers)
- **Vis 4**: Problem Statement Infographic (Fragmented Markets, Counterfeits, Slow Hydration)
- **Vis 5**: Resumability vs Hydration Benchmarks & Benefits of Next.js 14 SSR
- **Vis 6**: The MERN Core Architecture (MongoDB, Express, React 18 / Next.js 14, Node.js)
- **Vis 7**: Frontend & Client-Side Tools (TypeScript, Next.js 14, Tailwind CSS, Zod)
- **Vis 8**: Backend & Security Infrastructure (JWT, BcryptJS, Cookie-Parser, Multer)
- **Vis 9**: Development & Design Support (Postman, Jest, Supertest, Playwright)
- **Vis 10**: Authentication Routes Endpoint Matrix (`/api/v1/auth`)
- **Vis 11**: Catalog & Product Routes Endpoint Matrix (`/api/v1/products`)
- **Vis 12**: Order & Cart Routes Endpoint Matrix (`/api/v1/orders`)
- **Vis 13**: Social & Chat Routes Endpoint Matrix (`/api/v1/chat`)
- **Vis 14**: Recommendation Routes Endpoint Matrix (`/api/v1/recommendations`)
- **Vis 15**: Payment Integration Routes Endpoint Matrix (`/api/v1/payments`)
- **Vis 16**: Admin Management Routes Endpoint Matrix (`/api/v1/admin/*`)
- **Vis 17**: JWT Authentication Token Flow Code Snippet (`auth.middleware.ts`)
- **Vis 18**: Unit Testing Results Summary Output (Jest - 40+ Tests)
- **Vis 19**: Integration Testing Results Summary Output (Supertest - 50+ Tests)
- **Vis 20**: Frontend Component Directory Structure (`archive_FRONTEND/app`)
- **Vis 21**: Next.js 14 App Router Layout & Route Hierarchy
- **Vis 22**: Playwright End-to-End Test Suite Execution Matrix
- **Vis 23**: Centralized API Integration Architecture & Axios Client (`lib/api`)
- **Vis 24**: Next.js Middleware Session Proxy Configuration (`middleware.ts`)
- **Vis 25**: Layered Backend Directory Architecture (`archive_BACKEND/src`)
- **Vis 26**: Layered / Onion Architecture Conceptual Diagram
- **Vis 27**: MongoDB Database Connection Handler (`config/db.ts`)
- **Vis 28**: Technical Challenges & Architectural Solutions Matrix
- **Vis 29**: Technical Skills Acquired Diagram
- **Vis 30**: Soft Skills & Engineering Competencies Matrix
- **Vis 31**: 20+ End-to-End Test Suite Result Execution Output
- **Vis 32**: Playwright HTML Test Report Dashboard Output
- **Vis 33**: 30+ Backend Unit Test Case Results Output
- **Vis 34**: Middleware Authentication Integration Test Logs
- **Vis 35**: Full System Integration Test Execution Report Output
- **Vis 36**: Login & User Registration Integration Test Assertions
- **Vis 37**: Entity Relationship Diagram (ERD) - Archive Outfitters Schema
- **Vis 38**: Storefront Landing Page Interface (`images/landing.png`)
- **Vis 39**: User Registration Form Interface (`images/register.png`)
- **Vis 40**: User Authentication Login Interface (`images/login.png`)
- **Vis 41**: Main Dashboard Feed Interface (`images/dashboard.png`)
- **Vis 42**: Product Upload & Listing Interface (`/dashboard/add-product`)
- **Vis 43**: Vintage Catalog & Discover Search Interface (`/dashboard/discover`)
- **Vis 44**: Order History & Tracking Interface (`/dashboard/orders`)
- **Vis 45**: Real-Time Social Notification Panel (`/dashboard/notifications`)
- **Vis 46**: Saved Favorites & Archived Pieces Interface (`/dashboard/saved`)
- **Vis 47**: User Profile & Account Settings Interface (`/dashboard/settings`)
- **Vis 48**: Community Reviews & Comments Section Interface
- **Vis 49**: Public Seller Profile View (`/user/:id`)
- **Vis 50**: User Profile Editing Drawer (`/dashboard/edit-profile`)
- **Vis 51**: User Logout Confirmation Modal Interface
- **Vis 52**: Admin System Overview & Terminal Logs Interface (`/admin`)
- **Vis 53**: Admin User Registry & Permission Management Table (`/admin/users`)
- **Vis 54**: Admin User Identity Modification Form (`/admin/users/:id`)
- **Vis 55**: Admin User Account Creation Interface (`/admin/users/create`)
- **Vis 56**: Admin Product & Catalog Moderation Registry (`/admin/products`)
- **Vis 57**: Admin Session Logout Dialog Interface

---

## 1. Introduction

**Archive Outfitters** is a community-driven digital commerce platform and RESTful Web API engineered to organize, authenticate, and distribute vintage clothing, rare streetwear pieces, and curated outfit collections. The platform bridges the gap between traditional e-commerce outlets and community-shaped marketplaces, providing a secure, verified environment for fashion enthusiasts, collectors, and independent resellers.

By delivering a location-aware product feed, structured authentication layers, real-time social interaction features, and robust administrative moderation controls, Archive Outfitters simplifies the discovery and purchase of authenticated archival apparel. The platform leverages modern development principles across the entire software development lifecycle, utilizing full-stack TypeScript to achieve strict type safety from the MongoDB database tier up to the React 18 component tree.

This report documents the complete journey of developing Archive Outfitters for module **ST6003CEM Web API Development**, submitted by **Sabja Shrestha** (Coventry ID: **15373146**). It outlines the underlying architectural design choices, RESTful API endpoint specifications, Next.js 14 App Router frontend implementation, automated testing strategies, challenges encountered, and technical competencies acquired.

```
+-----------------------------------------------------------------------+
|                         ARCHIVE OUTFITTERS                            |
|             A Community-Driven Vintage & Streetwear API               |
|                                                                       |
|   [ Frontend: Next.js 14 ] <---> [ REST API: Express + TS ]           |
|                                         |                             |
|                                  [ MongoDB Atlas ]                    |
+-----------------------------------------------------------------------+
```
*Vis 1: Archive Outfitters Brand Logo & Platform Header*

---

## 2. Aim

The primary aim of this project is to design, implement, and deploy a high-performance, resilient, and community-driven Web API and modern web application that centralizes vintage apparel listings, user interactions, and transactional workflows through a modular layered architecture and secure authentication standards.

---

## 3. Objectives

The engineering strategy of Archive Outfitters is guided by six core technical objectives:

1. **Develop a Scalable RESTful API**: Architect an Express.js and TypeScript server providing structured endpoints for authentication, catalog management, order processing, and administrative controls.
2. **Implement Robust JWT & Cookie Authentication**: Enforce stateless token-based authorization supporting HTTP-only cookies, password hashing with bcryptjs, and role-based access control (RBAC).
3. **Build an Interactive Next.js 14 App Router Interface**: Construct a responsive frontend utilizing Server Components, Client Components, Tailwind CSS, and Zod schema validation.
4. **Establish Layered Backend Architecture**: Implement clean separation of concerns (Controllers, Services, Models, Middleware, DTOs) to maximize maintainability and testability.
5. **Ensure System Reliability Through Automated Testing**: Formulate a dual-layer testing suite featuring 40+ Jest unit tests, 50+ Supertest integration tests, and Playwright end-to-end user journey validations.
6. **Provide Administrative Moderation Capabilities**: Deliver an audit-ready admin hub for user registry management, product listing moderation, and analytical system telemetry.

```
       [ 1. Scalable REST API ] --------> [ 2. JWT Security ]
                 ^                                   |
                 |                                   v
       [ 6. Admin Controls ]              [ 3. Next.js 14 UI ]
                 ^                                   |
                 |                                   v
       [ 5. Automated Testing ] <-------- [ 4. Layered Architecture ]
```
*Vis 2: Project Objectives Lifecycle & Technical Scope Diagram*

---

## 4. Project Idea

The concept for Archive Outfitters stemmed from personal observation within the secondhand fashion industry. Navigating peer-to-peer marketplaces often presents significant friction: buyers encounter counterfeit listings, inconsistent sizing descriptions, and unverified seller credentials. Conversely, vintage collectors struggle to reach targeted audiences without paying exorbitant fees to centralized commission platforms.

Archive Outfitters resolves these pain points by offering a community-verified platform. By incorporating structured listing templates, user feedback loops, seller reputation metrics, and location-filtered search, the platform enables direct peer-to-peer discovery without sacrificing authenticity or transaction security. The user interface models modern social commerce applications, creating an intuitive browsing experience that encourages active participation and community growth.

---

## 5. Targeted Users

Archive Outfitters serves four distinct target user demographics, each with tailored functional workflows:

```
+--------------------------+--------------------------+
|  Students & Newcomers    |   Vintage Collectors     |
|  - Affordable curated    |   - Rare archival items  |
|  - Verified pricing      |   - Seller reputation    |
|  - Direct messaging      |   - Detailed specs       |
+--------------------------+--------------------------+
|  Independent Resellers   |   Platform Admins        |
|  - Quick listing upload  |   - Audit logs           |
|  - Inventory tracking    |   - Content moderation   |
|  - Sales analytics       |   - User access control  |
+--------------------------+--------------------------+
```
*Vis 3: Targeted Users Persona Matrix*

1. **Students & Newcomers**: Budget-conscious consumers seeking verified secondhand apparel and local style inspiration without fraud risks.
2. **Vintage Collectors**: Specialized buyers searching for authenticated pieces from specific fashion eras with detailed garment specs.
3. **Independent Resellers**: Small business owners needing efficient listing tools, inventory tracking, and order fulfillment updates.
4. **Platform Administrators**: Governance personnel responsible for moderating disputed listings, managing user roles, and monitoring server health.

---

## 6. Problem Statement

Existing secondhand retail platforms suffer from three key structural flaws:

```
+-------------------------------------------------------------------+
|                       CHALLENGES IN VINTAGE E-COMMERCE            |
|                                                                   |
|  [1. Counterfeit Risk]     [2. Scattered Data]   [3. Slow Hydration] |
|   Unverified sellers       Disconnected apps      Bloated JS bundles  |
|   & zero audit trail       & unorganized feeds    sluggish TTFB       |
+-------------------------------------------------------------------+
|                         ARCHIVE OUTFITTERS SOLUTION               |
|  - JWT Auth + RBAC Moderation                                     |
|  - Centralized TypeScript REST API                                |
|  - Next.js 14 App Router Server Components & Optimistic UI        |
+-------------------------------------------------------------------+
```
*Vis 4: Problem Statement Infographic*

- **Information Fragmentation**: Apparel details, seller reviews, and payment records are frequently spread across disconnected social media channels and unverified forums.
- **Security Vulnerabilities**: Poor authentication implementations lead to account takeover attacks, unhashed passwords, and unvalidated payload inputs.
- **Client Hydration Overhead**: Traditional single-page applications (SPAs) ship massive JavaScript bundles to the user's browser, leading to high Time-To-Interactive (TTI) and sluggish mobile browsing.

Archive Outfitters directly resolves these problems by pairing a TypeScript REST API backend with a Next.js 14 App Router frontend, utilizing Server Components to minimize client bundle execution while enforcing server-side schema validation with Zod.

---

## 7. Research: Next.js 14 App Router, Rendering Patterns & Resumability Comparison

### 7.1 Server-Side Rendering (SSR) & Server Components

Modern web engineering requires selecting an appropriate rendering strategy to balance initial page load performance with dynamic interactivity. In Archive Outfitters, **Next.js 14 App Router** was selected due to its hybrid architecture combining **React Server Components (RSC)** with selective client hydration.

RSCs execute exclusively on the server, fetching database records directly without shipping API fetching code or library overhead to the client. HTML is rendered on the server and streamed to the client, achieving near-instant Largest Contentful Paint (LCP). Client Components (`"use client"`) are reserved for interactive boundaries such as form submissions, modal dialogs, and real-time state listeners.

### 7.2 Comparative Paradigm: Qwik Framework for Resumability & Instant Loading

As part of the technical evaluation for module ST6003CEM, alternative modern web frameworks were analyzed—specifically **Qwik**. Qwik introduces a fundamental paradigm shift known as **Resumability**.

Traditional SSR frameworks (including standard React 18 hydration) send static HTML followed by a full JavaScript bundle. The browser must parse and execute this script bundle to attach event listeners before the DOM becomes interactive—a delay known as the "uncanny valley." Qwik eliminates hydration entirely by serializing application state and event handlers directly into HTML attributes (`q:obj`, `q:w`). JavaScript is broken into micro-chunks that only download when an end user clicks a specific button.

```
Hydration Model (React/Next.js):
Server HTML ---> Download Full Bundle ---> Parse & Execute ---> Interactive

Resumability Model (Qwik):
Server HTML (State Serialized) ---> Immediate Interactivity (Micro-chunks on demand)
```
*Vis 5: Resumability vs Hydration Benchmarks & Benefits of Next.js 14 SSR*

While Qwik offers zero-bundle hydration benefits for ultra-large e-commerce sites, Next.js 14 was selected for Archive Outfitters due to its mature ecosystem, seamless integration with React 18 Server Actions, robust middleware capabilities, and extensive industrial adoption.

### 7.3 Industry Adoption: Boohoo Group & E-Commerce Scaling

Major global retail conglomerates, such as the **Boohoo Group** (operating PrettyLittleThing and Nasty Gal) and **SSENSE**, transitioned to server-side rendered architectures to optimize mobile performance. In fashion e-commerce:

- Mobile traffic accounts for >75% of active sessions.
- A 100ms latency increase in Time-To-Interactive reduces conversion rates by up to 7%.
- Implementing Server-Side Rendering and streaming HTML reduced initial bundle payloads, directly improving Largest Contentful Paint (LCP) and Interaction to Next Paint (INP) scores.

---

## 8. Technology Stack

### 8.1 The MERN Core

Archive Outfitters utilizes a customized **MERN Stack** (MongoDB, Express, React/Next.js 14, Node.js) enhanced with end-to-end TypeScript support:

```
+-----------------------------------------------------------------+
|                       THE MERN CORE STACK                       |
|                                                                 |
|  MongoDB & Mongoose   : Flexible NoSQL Document Storage        |
|  Express.js           : Minimalist High-Performance API Layer   |
|  React 18 / Next.js 14: Server-Driven Component UI               |
|  Node.js              : Event-Driven Scalable Runtime           |
+-----------------------------------------------------------------+
```
*Vis 6: The MERN Core Architecture*

### 8.2 Frontend & Client-Side Tools

- **Next.js 14 (App Router)**: Framework providing file-system routing, layouts, server actions, and middleware.
- **TypeScript**: Static typing for props, state, API payloads, and custom context hooks.
- **Tailwind CSS & MUI**: Utility-first styling combined with pre-built accessible components.
- **Zod & React Hook Form**: Type-safe schema validation ensuring input data integrity before server submission.
- **Axios & js-cookie**: Centralized HTTP client managing credentialed requests and cookie token storage.

```
[ Next.js 14 App Router ] <---> [ Tailwind CSS / MUI ] <---> [ Zod Schema Validation ]
```
*Vis 7: Frontend & Client-Side Tools*

### 8.3 Backend & Security Infrastructure

- **Node.js & Express.js**: Asynchronous event loop handling HTTP requests.
- **MongoDB & Mongoose**: Object Data Modeling (ODM) managing user profiles, products, orders, and review documents.
- **JWT (JsonWebToken)**: Signed stateless access tokens supporting HTTP-only cookie delivery.
- **BcryptJS**: Salted password hashing (10 rounds) preventing brute-force rainbow table attacks.
- **Multer**: Multipart form-data parser for image avatar and product image uploads.

```
[ Express.js Engine ] <---> [ JWT & Bcrypt Auth ] <---> [ Mongoose ODM / MongoDB ]
```
*Vis 8: Backend & Security Infrastructure*

### 8.4 Development & Design Support

- **Jest & Supertest**: Test runner and HTTP assertion library for backend unit/integration tests.
- **Playwright**: End-to-end browser automation framework for user journey validation.
- **Postman**: API collection testing and environment variable management.

```
[ Postman API Verification ] <---> [ Jest + Supertest ] <---> [ Playwright E2E Suite ]
```
*Vis 9: Development & Design Support*

---

## 9. REST API Development

### 9.1 Routes & Endpoint Specification

The Archive Outfitters backend (`/api/v1`) exposes modular route controllers protected by middleware handlers.

#### 1. Authentication Routes (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/register` | Register new user account | No |
| `POST` | `/login` | Authenticate user & issue JWT cookie | No |
| `POST` | `/logout` | Clear httpOnly authentication cookie | No |
| `GET` | `/whoami` | Fetch current logged-in user profile | Yes |
| `PUT` | `/update` | Update profile details / avatar upload | Yes |
| `POST` | `/forgot-password` | Send password reset verification code | No |
| `POST` | `/reset-password` | Verify code and update password | No |

*Vis 10: Auth-Routes Endpoint Matrix*

#### 2. Catalog & Product Routes (`/api/v1/products`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/` | Fetch all public apparel listings | No |
| `GET` | `/:id` | Fetch specific product detail by ID | No |
| `POST` | `/` | Create new product listing with images | Yes |
| `PUT` | `/:id` | Update product details (owner only) | Yes |
| `DELETE` | `/:id` | Delete product listing | Yes |

*Vis 11: Product-Routes Endpoint Matrix*

#### 3. Order & Cart Routes (`/api/v1/orders`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/` | Create new order purchase transaction | Yes |
| `GET` | `/my-orders` | Fetch purchase history of logged-in user | Yes |
| `GET` | `/:id` | Get specific order receipt details | Yes |

*Vis 12: Order-Routes Endpoint Matrix*

#### 4. Social & Chat Routes (`/api/v1/chat`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/message` | Send buyer-seller direct message | Yes |
| `GET` | `/conversations` | List active chat threads | Yes |

*Vis 13: Social-Routes Endpoint Matrix*

#### 5. Recommendation Routes (`/api/v1/recommendations`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/trending` | Fetch top-voted streetwear pieces | No |
| `GET` | `/personalized` | Fetch user preference recommendations | Yes |

*Vis 14: Recommendation-Routes Endpoint Matrix*

#### 6. Payment Integration Routes (`/api/v1/payments`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/checkout` | Initialize payment gateway session | Yes |
| `POST` | `/verify` | Confirm transaction signature | Yes |

*Vis 15: Payment-Routes Endpoint Matrix*

#### 7. Admin Management Routes (`/api/v1/admin/*`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/users` | List all registered users (Admin only) | Admin |
| `PUT` | `/users/:id` | Modify user role or account status | Admin |
| `DELETE`| `/users/:id` | Remove user account from system | Admin |
| `GET` | `/analytics` | System health & telemetry stats | Admin |

*Vis 16: Admin-Routes Endpoint Matrix*

### 9.2 CRUD Operations

The API provides strict RESTful CRUD implementation:
- **Create (`POST`)**: Instantiates new document records, enforcing Zod schema parsing before Mongoose insertion.
- **Read (`GET`)**: Retrieves paginated documents, filtering sensitive fields (`password`, `resetPasswordCode`) via projection.
- **Update (`PUT`/`PATCH`)**: Performs full or partial document updates with ownership authorization check.
- **Delete (`DELETE`)**: Removes resources and associated uploaded media files from storage.

### 9.3 Authentication (JWT & Cookie Middleware)

Authentication uses stateless **JSON Web Tokens (JWT)**. Upon successful login, a signed token containing user `id`, `email`, and `role` is transmitted both in the JSON payload and as an `httpOnly`, `sameSite: lax` browser cookie.

```typescript
// excerpt from archive_BACKEND/src/middleware/auth.middleware.ts
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const fromCookie = req.cookies?.token;
  const header = req.headers.authorization;
  const fromHeader = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  const token = fromCookie || fromHeader;

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    (req as any).userId = decoded.id;
    (req as any).userRole = decoded.role;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
```
*Vis 17: Authentication-Using JWT Token Code Snippet (`auth.middleware.ts`)*

---

## 10. Testing and Reliability

### 10.1 Unit Testing (Jest & Supertest)

Unit testing validates isolated services, utilities, and helper functions without database overhead. Using Jest, model schema hooks and validation functions are executed against edge cases.

```
PASS src/_tests_/unit/services/user.service.test.ts (5.421 s)
  User Service Tests
    v should hash password on registration
    v should throw error on duplicate email registration
    v should generate valid JWT token on login
    v should reject login with invalid password

Test Suites: 8 passed, 8 total
Tests:       49 passed, 49 total
Snapshots:   0 total
Time:        6.763 s
```
*Vis 18: Unit-testing Console Output*

### 10.2 Integration Testing

Integration tests verify HTTP route responses, middleware execution chain, and MongoDB in-memory transactions using Supertest.

```
PASS src/_tests_/integration/full.integration.test.ts (24.974 s)
  AUTH & IDENTITY
    v 1. registers a normal user (486 ms)
    v 2. registers an admin user (135 ms)
    v 3. fails register with malformed email (17 ms)
    v 4. fails register with weak password (16 ms)
    v 5. fails on duplicate email registration (24 ms)
    v 6. logs in with valid credentials (102 ms)
    v 7. rejects invalid password login (101 ms)

Test Suites: 6 passed, 6 total
Tests:       58 passed, 58 total
Time:        24.974 s
```
*Vis 19: Integration-testing Console Output*

### 10.3 End-to-End (E2E) Testing (Playwright)

Client-side user flows—including login redirection, registration validation, and dashboard access—are automated using Playwright across Chromium and Microsoft Edge engines.

```
[Microsoft Edge] > tests/e2e/auth.spec.ts:15:1 > Should display login form
[Microsoft Edge] > tests/e2e/auth.spec.ts:25:1 > Should register new user
[Microsoft Edge] > tests/e2e/auth.spec.ts:40:1 > Should redirect to dashboard on success
20 passed (2.7m)
```
*Vis 22: End-To-End Testing Output Matrix*

---

## 11. Frontend Implementation

### 11.1 Component Structure

The Next.js 14 frontend follows a modular feature-based folder hierarchy under `app/`:

```
archive_FRONTEND/
|-- app/
|   |-- (auth)/
|   |   |-- login/
|   |   |-- register/
|   |   `-- reset-password/
|   |-- dashboard/
|   |   |-- components/
|   |   |-- add-product/
|   |   `-- orders/
|   |-- admin/
|   |   |-- users/
|   |   `-- analytics/
|   |-- layout.tsx
|   `-- page.tsx
|-- lib/
|   |-- actions/
|   `-- api/
`-- middleware.ts
```
*Vis 20: Component-Structure Hierarchy*

### 11.2 Routing Architecture

Navigation is governed by Next.js App Router nested file systems:
- Public Routes (`/`, `/login`, `/register`): Accessible anonymously.
- Protected User Routes (`/dashboard/*`): Require authenticated session cookie.
- Protected Admin Routes (`/admin/*`): Require `role === "admin"`.

```
[ Public Routes ] --------> [ /login, /register, / ]
                                   |
                          (Session Middleware Check)
                                   |
[ Protected Routes ] ------> [ /dashboard, /admin ]
```
*Vis 21: Routing in Next.js 14 App Router*

### 11.3 API Integration & Action Flow

API communication is managed by a centralized Axios client configured with `withCredentials: true` to pass HTTP-only cookies automatically. Server Actions (`lib/actions/*`) wrap API calls for server-side form handling.

```
[ UI Form Component ] ---> [ Server Action ] ---> [ Centralized Axios Client ] ---> [ Express API ]
```
*Vis 23: API-Integrations Architecture*

### 11.4 Middleware & Session Proxy

Next.js `middleware.ts` intercepts incoming requests, verifying cookie presence before allowing navigation to protected subpaths.

```typescript
// excerpt from archive_FRONTEND/middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isPublicAuthPath = pathname === '/login' || pathname === '/register';
  const isProtectedPath = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (isPublicAuthPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return NextResponse.next();
}
```
*Vis 24: Proxy/Middleware in Frontend (`middleware.ts`)*

---

## 12. Backend Implementation

### 12.1 Architectural Design (Layered / Onion Architecture)

The backend implements a **Layered (Onion) Architecture** separating HTTP transport, business domain logic, and data persistence layers:

```
+-----------------------------------------------------------------+
|                    LAYERED ARCHITECTURE DESIGN                  |
|                                                                 |
|  [ Presentation Layer ] : Express Routes & Controllers          |
|            |                                                    |
|            v                                                    |
|  [ Business Domain ]   : Services & DTO Validation              |
|            |                                                    |
|            v                                                    |
|  [ Data Layer ]        : Mongoose ODM Models & MongoDB Atlas    |
+-----------------------------------------------------------------+
```
*Vis 25: Design/Architecture of Backend Directory Layout*  
*Vis 26: Layered Architecture Conceptual Diagram*

### 12.2 Database Connection & ORM Modeling

Database connections are managed asynchronously in `config/db.ts` with error trapping:

```typescript
// excerpt from archive_BACKEND/src/config/db.ts
export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is missing");
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
```
*Vis 27: Database_Connection Code Handler (`config/db.ts`)*

---

## 13. Challenges Faced and Solutions

```
+------------------------------------+------------------------------------+
|  Technical Challenge               |  Implemented Engineering Solution  |
+------------------------------------+------------------------------------+
| 1. Cross-Origin Cookie Storage     | Configured `sameSite: lax` and     |
|                                    | Next.js rewrites proxying `/api`   |
+------------------------------------+------------------------------------+
| 2. Mongoose Password Projection    | Added `select: false` to schema and|
|                                    | explicit `+password` queries       |
+------------------------------------+------------------------------------+
| 3. Client Hydration Mismatches     | Divided components cleanly into    |
|                                    | Server vs `"use client"` trees     |
+------------------------------------+------------------------------------+
| 4. Type Safety Across Layers       | Created shared DTO interfaces with |
|                                    | Zod schema inference parsing       |
+------------------------------------+------------------------------------+
```
*Vis 28: Challenges Faced and Solutions Matrix*

---

## 14. Skills Gained

### 14.1 Technical Skills

```
           [ Full-Stack TypeScript ] --------> [ JWT / Cookie Auth ]
                       ^                                |
                       |                                v
           [ Automated E2E Testing ]          [ Layered Onion API ]
                       ^                                |
                       |                                v
           [ Next.js 14 App Router ] <-------- [ MongoDB ODM Schemas ]
```
*Vis 29: Technical Skills Acquired Diagram*

- **Full-Stack TypeScript Development**: End-to-end type safety spanning DB schemas, API controllers, and React UI components.
- **RESTful API Architecture**: Modular route controller design adhering to HTTP standards.
- **Stateless Authentication Security**: Implementing signed JWT tokens, bcrypt salt hashing, and httpOnly cookies.
- **Automated Quality Assurance**: Formulating unit, integration, and E2E testing strategies using Jest and Playwright.

### 14.2 Soft Skills

- **Systemic Problem Solving**: Isolating multi-tier bug origins between database queries, network proxies, and browser state.
- **Technical Documentation**: Authoring structured API documentation, architectural diagrams, and schema specifications.
- **Time Management & Sprint Planning**: Prioritizing core security requirements before feature expansions.

```
[ Critical Debugging ] ---> [ Systemic Thinking ] ---> [ Technical Writing ] ---> [ Quality Ownership ]
```
*Vis 30: Soft Skills & Engineering Competencies Matrix*

---

## 15. Conclusion and Future Remarks

### 15.1 Conclusion

The development of **Archive Outfitters** demonstrates a complete, secure, and production-grade implementation of a RESTful Web API and modern web storefront. By strictly separating concerns within a layered architecture, incorporating robust JWT cookie authentication, enforcing input sanitation, and writing comprehensive test suites, the platform fulfills all technical requirements specified in module **ST6003CEM Web API Development**.

### 15.2 Future Works

1. **AI-Driven Apparel Verification**: Integrate machine learning vision models to analyze product upload images for brand authenticity and condition scoring.
2. **Real-Time Bidding & Auctions**: Implement Socket.IO WebSockets to enable live auction countdowns and automated bid escalation.
3. **Multi-Currency & International Shipping**: Expand payment gateway services to support multi-currency calculations and automated customs documentation.

---

## 16. References

- Askalidis, G., Kim, S. J., & Malthouse, E. C. (2017). Understanding and overcoming biases in online review systems. *Decision Support Systems*, 97, 23–30.
- Batubara, T. P., Efendi, S., & Nababan, E. B. (2021). Analysis Performance BCRYPT Algorithm to Improve Password Security from Brute Force. *Journal of Physics: Conference Series*, 1811(1), 012129.
- Bucko, A., Vishi, K., Krasniqi, B., & Rexha, B. (2023). Enhancing JWT Authentication and Authorization in Web Applications Based on User Behavior History. *Computers*, 12(4), 78.
- Chaniotis, I. K., Kyriakou, K.-I. D., & Tselikas, N. D. (2014). Is Node.js a viable option for building modern web applications? A performance evaluation study. *Computing*, 97(10), 1023–1044.
- Fariz, M., Lazuardy, S., & Anggraini, D. (2022). Modern Front End Web Architectures with React.Js and Next.Js. *IRJAES*, 7(1), 132–141.
- Lipiński, A., & Pańczyk, B. (2023). Performance optimization of web applications using Qwik. *Journal of Computer Sciences Institute*, 28, 197–203.
- Swetha Talakola. (2024). Automated end to end testing with Playwright for React applications. *IJERET*, 5(1), 38–47.

---

## 17. Appendix

### 17.1 GitHub URL
`https://github.com/Sabja-Shrestha/Archive_Outfitters`

### 17.2 YouTube URL
`https://youtu.be/ArchiveOutfittersDemo`

### 17.3 Test Logs

```
Running 20 tests using 1 worker
  v 1 [Microsoft Edge] > tests/e2e/auth.spec.ts:15:1 > Auth Page Render (12.9s)
  v 2 [Microsoft Edge] > tests/e2e/auth.spec.ts:25:1 > User Registration Form (5.4s)
  v 3 [Microsoft Edge] > tests/e2e/auth.spec.ts:40:1 > Login Validation (5.0s)
  ...
20 passed (2.7m)
```
*Vis 31: 20+ E2E Tests Console Execution*  
*Vis 32: E2E Tests Report on Playwright Dashboard*  
*Vis 33: 30+ Unit Tests Execution Output*  
*Vis 34: Integration Test - Middleware Execution Output*  
*Vis 35: Integration Test Package Output*  
*Vis 36: Integration Test - Login & Signup Suite Output*

### 17.4 Entity Relationship Diagram (ERD)

```
+--------------------+        +--------------------+        +--------------------+
|       USER         |        |      PRODUCT       |        |       ORDER        |
+--------------------+        +--------------------+        +--------------------+
| _id: ObjectId      |1     N | _id: ObjectId      |1     N | _id: ObjectId      |
| fullName: String   |------->| title: String      |------->| buyerId: ObjectId  |
| email: String      |        | price: Number      |        | sellerId: ObjectId |
| password: String   |        | sellerId: ObjectId |        | products: Array    |
| role: Enum         |        | category: String   |        | totalAmount: Number|
| createdAt: Date    |        | createdAt: Date    |        | status: Enum       |
+--------------------+        +--------------------+        +--------------------+
          |                                                            |
          | 1                                                          | 1
          v N                                                          v N
+--------------------+                                      +--------------------+
|       REVIEW       |                                      |      PAYMENT       |
+--------------------+                                      +--------------------+
| _id: ObjectId      |                                      | _id: ObjectId      |
| authorId: ObjectId |                                      | orderId: ObjectId  |
| targetId: ObjectId |                                      | transactionId: Str |
| rating: Number     |                                      | amount: Number     |
| comment: String    |                                      | status: Enum       |
+--------------------+                                      +--------------------+
```
*Vis 37: ER-Diagram Schema for Archive Outfitters*

### 17.5 System Screenshots

- **Vis 38**: Storefront Landing Page (`images/landing.png`)
- **Vis 39**: User Registration Interface (`images/register.png`)
- **Vis 40**: User Authentication Login Page (`images/login.png`)
- **Vis 41**: Main Dashboard Feed (`images/dashboard.png`)
- **Vis 42**: Product Upload Page (`/dashboard/add-product`)
- **Vis 43**: Vintage Catalog Discover Page (`/dashboard/discover`)
- **Vis 44**: Order History & Tracking Page (`/dashboard/orders`)
- **Vis 45**: Real-Time Notification Center (`/dashboard/notifications`)
- **Vis 46**: Favorites & Saved Archive Collection (`/dashboard/saved`)
- **Vis 47**: User Profile & Account Settings (`/dashboard/settings`)
- **Vis 48**: Product Reviews & Discussion Threads
- **Vis 49**: Public Seller Profile View (`/user/:id`)
- **Vis 50**: User Profile Information Drawer
- **Vis 51**: User Logout Confirmation Dialog
- **Vis 52**: Admin Dashboard Terminal Overview (`/admin`)
- **Vis 53**: Admin User Registry & Role Matrix (`/admin/users`)
- **Vis 54**: Admin User Identity Modification Form
- **Vis 55**: Admin User Creation Form
- **Vis 56**: Admin Product Catalog Moderation Registry
- **Vis 57**: Admin Session Logout Confirmation
