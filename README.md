# SkillBridge – Student Skill & Project Collaboration Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v26+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Mongoose-47a248.svg)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

A complete, functional, modern full-stack web application designed to solve college project teammate discovery. Built with **React (Vite)**, **Node.js**, **Express.js**, **MongoDB / Mongoose**, and **JWT Authentication**.

---

## 1. Problem Statement & Solution

### The Real-World College Problem
In colleges and universities, students possess diverse specialized skill sets (Frontend, Backend, AI/ML, UI/UX Design, IoT, Mobile Apps, Cybersecurity). However:
- Students struggle to find reliable teammates with complementary skills for hackathons, term projects, and final-year capstones.
- Great project ideas stall because the originator lacks specialists in other domains (e.g., an ML researcher needing a React frontend developer).
- There is no centralized campus platform to showcase technical portfolios or discover active project collaborations.

### The SkillBridge Solution
**SkillBridge** provides a dedicated collaborative ecosystem where students can:
1. **Showcase Skills & Portfolio**: Create student profiles with department, academic year, technical skills, GitHub, and LinkedIn links.
2. **Post Project Ideas**: Propose project concepts specifying target team size, domain category, required skills, and collaboration type (Online, Offline, Hybrid).
3. **Explore Opportunities**: Search and filter projects by domain, skill, collaboration mode, and recruitment status.
4. **Interactive Collaboration System**: Send join requests with personalized pitch messages; project creators can review applicant profiles and accept or reject with real-time roster updates.
5. **Manage Collaborations**: Track projects created, teams joined, and request statuses from a dynamic personalized student dashboard.

---

## 2. Technology Stack

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, React Router 6, Axios, Lucide React, Modern CSS | Fast single-page application with responsive UI and modern startup aesthetics |
| **Backend** | Node.js, Express.js, REST API, Morgan | Scalable, modular API server with robust error handling and input validation |
| **Database** | MongoDB Atlas, Mongoose ODM | Document database for flexible schematized user, project, and request models |
| **Authentication**| JWT (JSON Web Tokens), bcryptjs | Stateless authorization, password hashing, and protected route middleware |
| **Zero-Config Demo**| In-memory MongoDB fallback | Automatic zero-setup local demo capability for college viva examinations |

---

## 3. Application Architecture

```
                       ┌───────────────────────────────┐
                       │     React Frontend (Vite)     │
                       │  Port: 5173  (Proxy to /api)  │
                       └──────────────┬────────────────┘
                                      │ HTTP / Axios (Bearer JWT)
                                      ▼
                       ┌───────────────────────────────┐
                       │      Express.js Backend       │
                       │          Port: 5000           │
                       └──────────────┬────────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              ▼                       ▼                       ▼
    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
    │   Auth Routes    │    │  Project Routes  │    │  Request Routes  │
    │  JWT Validation  │    │ CRUD & Filtering │    │  Accept / Reject │
    └─────────┬────────┘    └─────────┬────────┘    └─────────┬────────┘
              │                       │                       │
              └───────────────────────┼───────────────────────┘
                                      │ Mongoose Models
                                      ▼
                       ┌───────────────────────────────┐
                       │   MongoDB Atlas / In-Memory   │
                       │  (Users, Projects, Requests)  │
                       └───────────────────────────────┘
```

---

## 4. Key Features & Pages

1. **Landing Page (`/`)**:
   - Modern hero section: *"Find Your Team. Build Something Great."*
   - Interactive platform statistics.
   - Dynamic featured project cards loaded from the database.
   - Interactive popular campus skills cloud.
   - 3-Step "How It Works" workflow guide.

2. **Student Authentication (`/register` & `/login`)**:
   - Secure registration with client-side & server-side validation (Name, College Email, College, Department, Year, Password confirmation).
   - Password hashing with `bcryptjs`.
   - JWT token issuance and persistent auth state via React Context API.
   - **Viva Quick-Fill Buttons**: One-click demo account switcher to test different student roles (Lead Dev, AI Researcher, UI Designer, IoT Specialist) instantly during college evaluations.

3. **Student Dashboard (`/dashboard`)**:
   - Welcome banner personalized to the logged-in student.
   - **4 Dynamic Stat Cards**: Projects Created, Projects Joined, Pending Requests, Accepted Collaborations.
   - Quick action shortcuts.
   - Dual-view cards for active projects and incoming collaborator applications.

4. **Explore Projects Directory (`/explore`)**:
   - Multi-parameter search (by title, description, or skill).
   - Filter dropdowns (Category, Collaboration Type, Project Status).
   - Sorting by newest or oldest.
   - Responsive card grid displaying capacity counters (`X / Y Members`), category tags, and creator info.

5. **Project Details (`/projects/:id`)**:
   - Comprehensive project overview, required tech stack badges, and capacity indicators.
   - Full team roster displaying current members and their assigned roles.
   - Creator profile card with contact and social links.
   - **Intelligent Collaboration Modal**:
     - Prevents creators from requesting to join their own projects.
     - Prevents duplicate requests.
     - Prevents join requests when the team is marked full.
     - Allows customized application pitch messages.

6. **Post a Project (`/create-project`)**:
   - Clean creation form with interactive skill tag builder.
   - Validates title, 20-character description minimum, team capacity (2-20), category, and mode.
   - Automatically registers the creator as the **Project Lead** in the roster.

7. **My Projects (`/my-projects`)**:
   - Tabbed view: *Projects I Created* and *Projects I Joined*.
   - Edit project details with live update modal.
   - Delete project with confirmation and cascade removal of requests.

8. **Collaboration Request Management (`/requests`)**:
   - **Received Requests**: View applicant's academic year, branch, listed skills, bio, and custom pitch message. One-click **Accept & Add to Team** or **Decline**.
   - **Sent Proposals**: Monitor status (*Pending*, *Accepted*, *Rejected*) in real time.

9. **Student Profile & Edit Profile (`/profile` & `/edit-profile`)**:
   - Custom avatar placeholder with student initials.
   - Academic information, bio, technical skills tags, areas of interest, GitHub & LinkedIn links.
   - Live synchronization across navbar and profile cards.

---

## 5. Folder Structure

```
skillbridge/
│
├── client/                             # React (Vite) Frontend
│   ├── public/                         # Public assets & favicons
│   ├── src/
│   │   ├── components/                 # Reusable UI Components
│   │   │   ├── Navbar.jsx              # Navigation with mobile responsive drawer
│   │   │   ├── Footer.jsx              # Professional footer
│   │   │   ├── ProjectCard.jsx         # Card with capacity counter & skills
│   │   │   ├── ProjectForm.jsx         # Create & Edit form with tag adder
│   │   │   ├── ProjectFilters.jsx      # Multi-criteria filter strip
│   │   │   ├── SearchBar.jsx           # Clean search input with clear button
│   │   │   ├── ProfileCard.jsx         # Student details and portfolio
│   │   │   ├── SkillTag.jsx            # Tag badge with remove callback
│   │   │   ├── RequestCard.jsx         # Collaboration request card with actions
│   │   │   ├── StatCard.jsx            # Metric card with gradient accents
│   │   │   ├── ProtectedRoute.jsx      # Auth verification wrapper
│   │   │   ├── ToastNotification.jsx   # Feedback alerts
│   │   │   ├── LoadingSpinner.jsx      # CSS spinner
│   │   │   └── EmptyState.jsx          # Illustrated empty state view
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # React Context for auth state
│   │   ├── pages/                      # 11 Main Application Pages
│   │   │   ├── LandingPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ExploreProjectsPage.jsx
│   │   │   ├── ProjectDetailsPage.jsx
│   │   │   ├── CreateProjectPage.jsx
│   │   │   ├── MyProjectsPage.jsx
│   │   │   ├── CollaborationRequestsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── EditProfilePage.jsx
│   │   ├── services/
│   │   │   └── api.js                  # Axios client & API endpoints
│   │   ├── utils/
│   │   │   └── helpers.js              # Formatting & styling helper functions
│   │   ├── App.jsx                     # Route configuration
│   │   ├── index.css                   # Custom global stylesheet (startup theme)
│   │   └── main.jsx                    # React DOM root
│   ├── package.json
│   ├── vite.config.js                  # Vite server & proxy configuration
│   ├── index.html
│   └── .env.example
│
├── server/                             # Node.js Express REST Backend
│   ├── config/
│   │   └── db.js                       # MongoDB Atlas & in-memory fallback
│   ├── controllers/
│   │   ├── authController.js           # Register, login, getMe
│   │   ├── userController.js           # Get user, update profile, search
│   │   ├── projectController.js        # Project CRUD, filtering, member queries
│   │   └── requestController.js        # Request join, accept, reject
│   ├── middleware/
│   │   ├── authMiddleware.js           # JWT Bearer verification
│   │   └── errorMiddleware.js          # Mongoose & 404 error handler
│   ├── models/
│   │   ├── User.js                     # Student schema & bcrypt pre-save
│   │   ├── Project.js                  # Project schema & roster
│   │   └── CollaborationRequest.js     # Request schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── projectRoutes.js
│   │   └── requestRoutes.js
│   ├── utils/
│   │   └── seedData.js                 # Realistic demo data (6 projects, 4 students)
│   ├── seed.js                         # Database seeder script
│   ├── test-suite.js                   # 24-point automated test suite
│   ├── run-tests.js                    # Test runner
│   ├── server.js                       # Express app entry point
│   ├── package.json
│   └── .env.example
│
├── PRESENTATION_PROJECT_EXPLANATION.md # College presentation guide
├── VIVA_QUESTIONS_AND_ANSWERS.md       # 20 in-depth viva questions & answers
├── TESTING_CHECKLIST.md                # Verification checklist
├── README.md                           # Master documentation
└── .gitignore
```

---

## 6. REST API Documentation

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new student account |
| `POST` | `/api/auth/login` | Public | Authenticate student and receive JWT |
| `GET` | `/api/auth/me` | Private | Get current authenticated student's profile |

### User Endpoints (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/:id` | Public | View a student's public profile |
| `PUT` | `/api/users/profile` | Private | Update current student's skills, bio, links |
| `GET` | `/api/users/search` | Public | Search students by name or skill |

### Project Endpoints (`/api/projects`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/projects` | Public | Query projects with search, filter, and sort |
| `POST` | `/api/projects` | Private | Create a new project idea (auto-adds creator as lead) |
| `GET` | `/api/projects/:id` | Public | Get full project details, members, and creator |
| `PUT` | `/api/projects/:id` | Private (Owner) | Update project details |
| `DELETE` | `/api/projects/:id` | Private (Owner) | Delete project and cascade-delete its requests |
| `GET` | `/api/projects/my-projects`| Private | Get all projects created by logged-in student |
| `GET` | `/api/projects/joined` | Private | Get projects where student is a confirmed collaborator |

### Collaboration Request Endpoints (`/api/requests`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/requests` | Private | Send a request to join a project |
| `GET` | `/api/requests/sent` | Private | View all requests sent by logged-in student |
| `GET` | `/api/requests/received` | Private | View requests received for projects owned by student |
| `PUT` | `/api/requests/:id/accept` | Private (Owner) | Accept request & automatically add to team roster |
| `PUT` | `/api/requests/:id/reject` | Private (Owner) | Decline a join request |

---

## 7. Step-by-Step Local Setup

### Prerequisites
- **Node.js** (v18 or higher recommended; tested on v26)
- **npm** (v9 or higher)
- Optional: MongoDB Atlas account (the app includes an automatic in-memory fallback for zero-setup demo)

### Step 1: Clone or Navigate to Project
```bash
cd skillbridge
```

### Step 2: Configure Environment Variables
In `server/.env`:
```env
PORT=5000
NODE_ENV=development
# Set your MongoDB Atlas connection string here, or leave blank for zero-setup in-memory database:
MONGODB_URI=
JWT_SECRET=skillbridge_super_secure_jwt_secret_token_2026
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

In `client/.env`:
```env
VITE_API_BASE_URL=/api
```

### Step 3: Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 4: Seed Sample Data (Optional if using MongoDB Atlas)
If you configure an external `MONGODB_URI`, populate realistic college projects and students:
```bash
cd server
npm run seed
```
*(Note: If `MONGODB_URI` is left blank, the server automatically populates sample projects on first startup!)*

### Step 5: Start Backend and Frontend
In terminal 1 (Backend):
```bash
cd server
npm run dev
```
Backend will run at: `http://localhost:5000`

In terminal 2 (Frontend):
```bash
cd client
npm run dev
```
Frontend will run at: `http://localhost:5173`

Open your browser and navigate to `http://localhost:5173`.

---

## 8. Seeded Demo Accounts for Viva Presentation

Use these pre-configured accounts during college demonstrations:

| Student Name | Role / Specialization | Email | Password |
| :--- | :--- | :--- | :--- |
| **Aarav Sharma** | Full-Stack Lead (React, Node, Mongo) | `aarav.sharma@college.edu` | `password123` |
| **Priya Patel** | AI/ML Researcher (Python, TensorFlow) | `priya.patel@college.edu` | `password123` |
| **Rohan Verma** | Mobile & IoT Developer (Flutter, C++) | `rohan.verma@college.edu` | `password123` |
| **Ananya Iyer** | UI/UX Designer & Frontend (Figma, CSS) | `ananya.iyer@college.edu` | `password123` |

*(Tip: On the Login page, click any of the "Quick Demo Accounts" pill buttons to autofill credentials in 1 second!)*

---

## 9. Running the Automated Test Suite

A comprehensive 24-point automated test script is provided in `server/`:

```bash
cd server
npm test
```

This verifies:
- Registration validations, password hashing, and duplicate checks.
- Invalid login rejections and valid JWT token issuance.
- Project creation, searching, category filtering, and unauthorized edit protections.
- Self-join request prevention, duplicate application prevention, and team size limit enforcements.
- Application acceptance, roster updating, and project deletion.

---

## 10. Production Deployment Guide

### A. Database (MongoDB Atlas)
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free Shared Cluster.
2. Under **Database Access**, create a database user (e.g., `skillbridge_admin`).
3. Under **Network Access**, add IP address `0.0.0.0/0` (allow access from anywhere) so cloud hosts can connect.
4. Click **Connect -> Drivers** and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/skillbridge?retryWrites=true&w=majority
   ```

### B. Backend Deployment (Render)
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com/) and click **New -> Web Service**.
3. Select your GitHub repository.
4. Configure service:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET`: `<Your Secret Key>`
   - `CLIENT_URL`: `<Your Vercel Frontend URL>`
6. Click **Deploy**. Note your backend URL (e.g., `https://skillbridge-backend.onrender.com`).

### C. Frontend Deployment (Vercel)
1. Sign in to [Vercel](https://vercel.com/) and click **Add New -> Project**.
2. Select your repository.
3. Configure settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://skillbridge-backend.onrender.com/api`
5. Click **Deploy**. Vercel will build and host your production frontend with a global CDN URL!
