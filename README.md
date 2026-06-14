# Blog Platform

A full-stack blog application with role-based access control, built as a portfolio project.

## Tech Stack

**Frontend:** React 19, React Router DOM, Axios, jwt-decode  
**Backend:** Node.js, Express.js  
**Database:** PostgreSQL  
**Auth:** JWT (JSON Web Tokens)

## Features

- User authentication with JWT (register / login / logout)
- Role-based access: Normal, Premium, and Admin tiers
- Create, read, update, and delete blog posts
- Protected routes based on user role
- RESTful API with Express.js

## Getting Started

1. Clone the repo and install dependencies:
```bash
   npm install
```
2. Set up your `.env` with DB credentials and JWT secret.
3. Run backend: `node server.js`
4. Run frontend: `npm start` (inside `src/`)
