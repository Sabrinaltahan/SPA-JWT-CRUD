# SPA with React, TypeScript & JWT Authentication

This project is a Single Page Application (SPA) built with **React + TypeScript** and a custom **Node.js/Express backend API**.

The application demonstrates:

- React Router navigation
- JWT-based authentication
- Protected routes
- Full CRUD functionality
- Responsive design
- TypeScript with defined interfaces
- Error handling and user feedback

## Tech Stack

### Frontend
- React
- TypeScript
- React Router
- Custom API client
- Context API for authentication
- Responsive CSS

### Backend
- Node.js
- Express
- JWT (jsonwebtoken)
- bcryptjs
- CORS
- In-memory database (for demo purposes)

##  Authentication

- Login endpoint: `POST /auth/login`
- JWT token returned in response
- Token stored in localStorage
- Protected routes require Authorization header
- Admin page accessible only when logged in

## Test credentials:
Email: admin@test.com
Password: admin123


## Features

### Public Area
- View all products
- View single product details (dynamic route)
- Login page

### Admin Area (Protected)
- Create product
- Update product
- Delete product
- View product list

---

## Installation

### 1️-Clone repository 
git clone

### 2-Install backend
cd backend 
npm install
npm run dev
Backend runs on: http://localhost:4000
### 3-Install frontend:
cd frontend
npm install
npm run dev 
Frontend runs on:http://localhost:5173
## API Endpoints
## Authentication
POST/auth /login
### Products
GET    /products 
GET    /products/:id
POST   /products        (protected) 
PUT    /products/:id    (protected) 
DELETE /products/:id    (protected)

---

## Responsive Design

- Mobile-friendly layout
- Responsive grid
- Hamburger menu for navigation

## Project Goal

- SPA architecture
- Authentication with JWT
- REST API integration
- Protected routes
- TypeScript best practices

## Developed : by Sabrin Altahan

Github link:
https://github.com/Sabrinaltahan/SPA-JWT-CRUD.git

Applikation link:
