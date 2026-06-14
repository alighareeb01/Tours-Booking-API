# Tours-Booking-APIs

A scalable and secure RESTful API for a tour booking system built with Node.js, Express, and MongoDB. The project follows production-level backend architecture principles and is designed to be extended into a TypeScript-based system.

---

## 🚀 Overview

Tours-Booking-APIs is a full-featured backend application that manages tours, users, reviews, and bookings. It includes authentication, authorization, advanced database querying, geospatial features, and robust security practices.

The system is structured using the MVC architecture and follows best practices for building scalable REST APIs.

---

## 📚 API Documentation

The full API documentation (including all endpoints, request examples, and responses) is available on Postman:

👉 https://documenter.getpostman.com/view/52446600/2sBXwqrqek

You can use this documentation to explore and test all available API routes.

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Nodemailer
- Postman (API testing)
- Security Middleware (Helmet, Rate Limiting, Sanitization, HPP)

---

## 🚧 Future Improvements & Roadmap

This project is actively evolving. Planned enhancements include:

### 🔷 TypeScript Migration

- Refactor the entire codebase from JavaScript to TypeScript
- Improve type safety, maintainability, and scalability
- Introduce shared interfaces for models, services, and controllers

### 🌐 Server-Side Rendering (SSR)

- Add SSR capabilities for improved SEO and performance
- Integrate a frontend rendering layer (e.g., Next.js or Express-based templating)
- Optimize initial page load experience for users

### 📁 File Upload System

- Implement secure file upload functionality
- Support image uploads for tours, users, and reviews
- Integrate cloud storage (e.g., Cloudinary or AWS S3)

### 💳 Payment Integration

- Add secure payment processing for tour bookings
- Integrate payment gateways such as Stripe or PayPal
- Handle booking confirmation and transaction status

---

These improvements aim to evolve this project into a production-grade, full-stack travel booking platform.

## ✨ Features

### 🔐 Authentication & Authorization

- User signup and login
- JWT-based authentication system
- Role-based access control (user, admin, guide)
- Password reset via email token
- Secure password hashing (bcrypt)

### 🏞️ Tours Management

- Full CRUD operations for tours
- Advanced filtering, sorting, pagination, and field limiting
- Aggregation pipelines for statistics
- Geospatial queries (tours within radius & distance calculations)

### ⭐ Reviews System

- Users can create reviews for tours
- Nested routes for tour-based reviews
- Prevention of duplicate reviews per user
- Automatic rating aggregation per tour

### 👤 Users Management

- User profile management
- Update personal data and password
- Soft delete (deactivate account)
- Admin-level user control

### 🛡️ Security Features

- Data sanitization against NoSQL injection
- HTTP security headers using Helmet
- Rate limiting to prevent brute-force attacks
- Parameter pollution protection
- Secure environment variable handling

---

## 🧠 Architecture & Concepts

- MVC (Model–View–Controller) architecture
- RESTful API design principles
- Centralized global error handling
- Async error handling patterns
- Factory pattern for reusable controllers
- MongoDB aggregation framework
- Middleware-driven request lifecycle
- Advanced query handling system

---

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/your-username/Tours-Booking-APIs.git

# Install dependencies
npm install

# Run development server
npm run dev
```
