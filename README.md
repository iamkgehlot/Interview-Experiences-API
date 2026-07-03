<div align="center">

# 🚀 Interview Experiences API

A robust, type-safe, and highly scalable RESTful API built to share, manage, and explore technical interview experiences.

<div style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod">
</div>

**CLEAN CODE • FEATURE-BASED ARCHITECTURE • STRONGLY TYPED**

<div align="center">

---

<div align="center"> 
  
🟢 **Live API URL:** [https://interview-experiences-api.onrender.com/](https://interview-experiences-api.onrender.com/)

<div align="center">

---

## 💡 What is this?

The **Interview Experiences API** is a backend service designed to empower professionals and freshers to document and learn from technical interview encounters. Built with a strict **TypeScript** foundation, this API leverages **Express.js** for routing, **JWT** for authentication, **Prisma ORM** for seamless database interactions with **PostgreSQL**, and **Zod** for bulletproof data validation.

## ✨ Key Features

* **🔐 Secure Authentication:** JWT-based authentication with secure, HTTP-only cookie delivery and password hashing using `bcryptjs`.
* **🛡️ Strict Type Safety & Validation:** End-to-end type safety. Every request parameter, query, and body is rigorously validated at runtime using dedicated `Zod` middlewares.
* **🏗️ Feature-Driven MVC Architecture:** Code is logically grouped by feature (`auth`, `users`, `experiences`, `comments`, `tags`) rather than by generic types, promoting incredible scalability and maintainability.
* **🚦 Centralized Error Handling:** A global error handler that seamlessly intercepts and standardizes database errors, validation errors, and custom operational exceptions.

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Runtime / Core** | Node.js, TypeScript |
| **Web Framework** | Express.js (v5) |
| **Database & ORM** | PostgreSQL, Prisma |
| **Validation** | Zod |
| **Security & Auth** | JSON Web Tokens (JWT), bcryptjs, cookie-parser |

## 🚦 Request Processing Pipeline

The API operates a unidirectional pipeline to ensure no corrupt or unauthenticated execution blocks hit your business logic.

```mermaid
%%{init: {'themeVariables': { 'fontSize': '15px' }}}%%
graph TD
    subgraph MainFlow [ Main Flow ]
        direction LR
        A([ HTTP Request ]) --> B[ Express Router ]
        B --> C[ JWT Middleware ]
        C --> D[ Zod Validator ]
        D --> E[ Controller ]
        E --> F[ Service ]
        F --> G[ Repository ]
        G --> H[( PostgreSQL )]
    end

    I> Global Error Handler ]

    C -.->| Auth Error | I
    D -.->| Validation Error | I
    E -.->| App Error | I
    F -.->| App Error | I
    G -.->| Prisma Error | I

    style I fill:#fef2f2,stroke:#e11d48,stroke-width:2px,color:#be123c
```

## 🛡️ Data Validation & Error Handling

This API implements a resilient, crash-proof error-handling strategy directly tied into the pipeline above:

* **Zod Validation (`middlewares/zod.ts`)**: Automatically intercepts bad requests before they reach the controller, returning detailed field-level error messages (e.g., `400 Bad Request`).
* **Global Error Handler (`middlewares/error.handler.ts`)**: Catches all unhandled exceptions, formats Prisma database errors (like `P2002` unique constraint violations or `P2025` record not found), and ensures a standard JSON response structure is always returned to the client.
* **Custom `AppError`**: Thrown within services for business logic constraints (e.g., `403 Forbidden` if a user tries to edit an experience they don't own).

## 🗄️ Database Schema

The database is built on PostgreSQL with Prisma managing the relational integrity.

```mermaid
%%{init: {'themeVariables': { 'fontSize': '12px'}}}%%
erDiagram
    USER ||--o{ EXPERIENCE : creates
    USER ||--o{ COMMENT : writes
    USER ||--o{ TAG : creates
    EXPERIENCE ||--o{ COMMENT : has
    EXPERIENCE }o--o{ TAG : categorized_by

    USER {
        Int id PK
        String name
        String email UK
        String password
        Int age
        Int yearsOfExperience
        String current_role
        String industry
    }
    EXPERIENCE {
        Int id PK
        Int userId FK
        String company
        String role
        Int roundsCount
        Int difficulty
        Enum outcome
        String content
        DateTime interviewDate
    }
    COMMENT {
        Int id PK
        Int userId FK
        Int experienceId FK
        String comment
    }
    TAG {
        Int id PK
        String tagName UK
        Int createdByUserid FK
        DateTime addedOn
    }
```

## 🚀 Getting Started

### Prerequisites

* **Node.js** (v18 or higher recommended)
* **PostgreSQL** installed and running locally.

### Installation & Setup

**1. Clone & Install:**

```bash
git clone [https://github.com/iamkgehlot/interview-experiences-api.git](https://github.com/iamkgehlot/interview-experiences-api.git)
cd interview-experiences-api
npm install
```

**2. Database & Environment:**

Setup your `.env` file, then run migrations:

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

## 📡 API Endpoints Summary

All routes are prefixed with `/api`. *Note: Protected endpoints require a valid JWT token.*

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| **POST** | `/api/register` | Register a new user | ❌ |
| **POST** | `/api/login` | Login & receive JWT cookie | ❌ |
| **POST** | `/api/logout` | Clear auth cookies | ❌ |
| **GET** | `/api/users` | Fetch all users | 🔒 |
| **GET** | `/api/users/:id` | Fetch specific user | 🔒 |
| **PATCH** | `/api/users/:id` | Update user profile | 🔒 |
| **GET** | `/api/experiences` | Fetch all experiences | 🔒 |
| **GET** | `/api/experiences/:experienceId` | Fetch specific experience | 🔒 |
| **GET** | `/api/users/:userId/experiences` | Fetch user's experiences | 🔒 |
| **POST** | `/api/users/:userId/experiences` | Create a new experience | 🔒 |
| **PATCH** | `/api/experiences/:experienceId` | Update an experience | 🔒 |
| **GET** | `/api/experiences/:experienceId/comments` | Get comments for an experience | 🔒 |
| **GET** | `/api/users/:userId/comments` | Get all comments by user | 🔒 |
| **POST** | `/api/experiences/:experienceId/comments` | Add comment to an experience | 🔒 |
| **PATCH** | `/api/comments/:commentId` | Update a comment | 🔒 |
| **GET** | `/api/tags/` | Get all tags | 🔒 |
| **GET** | `/api/tags/:tagId` | Get tag by ID | 🔒 |
| **POST** | `/api/tags/` | Create a tag | 🔒 |
| **PATCH** | `/api/tags/:tagId` | Update a tag | 🔒 |
| **DELETE** | `/api/experiences/:experienceId` | Delete an experience | 🔒 |
| **DELETE** | `/api/comments/:commentId` | Delete a comment | 🔒 |
| **DELETE** | `/api/tags/:tagId` | Delete a tag | 🔒 |
| **DELETE** | `/api/users/:id` | Delete user profile | 🔒 |

<br>

<div align="center">
  <em>Engineered with Precision & Energy ⚡</em>
</div>
