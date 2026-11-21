# SkillBridge – Student Skill & Project Collaboration Platform
## Comprehensive Technical Project Report

---

## 1. Problem Statement & Motivation

### The Real-World Campus Problem
In engineering colleges and universities, students specialize in diverse, complementary technical domains—such as Frontend Development, Backend Architecture, Artificial Intelligence and Machine Learning (AI/ML), Mobile Application Engineering, UI/UX Design, Cybersecurity, and Internet of Things (IoT).

However, students consistently face fundamental hurdles:
1. **Isolated Skill Sets:** A machine learning student may develop a high-accuracy predictive algorithm but lack the frontend engineering skills to build an accessible web interface. Conversely, UI/UX designers and frontend developers frequently lack backend database architects or machine learning engineers to build data-driven systems.
2. **Inefficient Informal Teaming:** Students currently rely on fragmented, ad-hoc communication channels (WhatsApp groups, informal word-of-mouth, or physical bulletin notices). This leads to unbalanced teams with redundant skills, unvetted commitments, and mismatched academic schedules.
3. **Lack of Centralized Discovery:** There is no single institutional platform where students can showcase verified academic credentials, list concrete technical proficiencies, discover active projects seeking specific teammates, or pitch collaboration proposals.
4. **Project Abandonment:** Many innovative hackathon and capstone project ideas are abandoned before inception simply because the originator cannot assemble a balanced, multidisciplinary team in time.

### Motivation
**SkillBridge** was conceived to solve this institutional gap. By developing an accessible, cloud-native collaboration platform, SkillBridge provides a structured environment where students publish project ideas, specify exact technical requirements, browse collaboration opportunities through real-time multi-parameter search, and manage team recruitment workflows with automatic capacity enforcement.

---

## 2. Objectives

The primary objective of SkillBridge is to deliver a production-grade, secure, and user-friendly full-stack web application. The specific functional and technical objectives are:

1. **Secure Authentication & Session Management:**
   - Implement stateless authentication using JSON Web Tokens (JWT) and one-way password hashing using `bcryptjs` with salted rounds.
   - Protect private API routes and frontend pages via authentication middleware and route guards.
2. **Student Profile & Technical Portfolio System:**
   - Allow students to showcase academic branch, year of study, technical skills, areas of interest, biography, and external GitHub/LinkedIn profiles.
   - Provide real-time profile editing with dynamic synchronization across the platform.
3. **Project Idea Publishing & Specification:**
   - Enable project creators to define project titles, comprehensive problem statements (minimum 20 characters), domain categories, target team sizes (2 to 20 members), estimated duration, and collaboration types (Online, Offline, Hybrid).
   - Implement dynamic, interactive `#skill` tag builders for specifying required technologies.
4. **Multi-Criteria Search & Filtering Engine:**
   - Support case-insensitive text search querying across titles, descriptions, and required skill tags simultaneously.
   - Provide multi-parameter filtering by Category, Collaboration Mode, and Project Status, alongside chronological sorting (Newest / Oldest).
5. **Interactive Collaboration Request State Machine:**
   - Enable students to submit personalized application pitches to project creators.
   - Implement business logic safeguards preventing self-joining, blocking duplicate applications, enforcing team capacity limits, and automatically synchronizing the team roster upon acceptance.
6. **Dynamic Dashboard Analytics:**
   - Provide students with real-time statistics computed dynamically from database records (Projects Created, Projects Joined, Pending Requests, Accepted Collaborations).
7. **Cloud-Native Deployment & Continuous Delivery:**
   - Deploy the decoupled system across cloud services: database on **MongoDB Atlas**, backend on **Render**, frontend on **Vercel**, with source code version-controlled on **GitHub**.

---

## 3. Technologies Used & 3-Tier Architecture

SkillBridge is built on the industry-standard **MERN Stack** organized into a classical, decoupled **3-Tier Architecture**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION TIER (CLIENT)                      │
│     React 18 (Vite)  •  React Router 6  •  Axios  •  Lucide Icons      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / RESTful API (JSON + Bearer JWT)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     APPLICATION / LOGIC TIER (SERVER)                  │
│       Node.js Runtime  •  Express.js Framework  •  JWT & bcryptjs      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Mongoose ODM Driver (TCP / SSL)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          DATA TIER (DATABASE)                          │
│               MongoDB Atlas (Cloud NoSQL Document Cluster)             │
└────────────────────────────────────────────────────────────────────────┘
```

### Technology Breakdown

| Tier | Technology | Purpose in SkillBridge |
| :--- | :--- | :--- |
| **Presentation** | **React 18** | Declarative, component-driven UI with high performance via the Virtual DOM. |
| | **Vite** | Lightning-fast development server with Hot Module Replacement (HMR) and optimized Rollup production builds. |
| | **React Router 6** | Declarative client-side routing, protected route wrappers, and navigation management. |
| | **Axios** | Promise-based HTTP client equipped with request interceptors for automatic JWT token injection. |
| | **Lucide React** | Modern, lightweight, aesthetic SVG icon system for startup-grade visual polish. |
| | **Custom CSS** | Clean startup-themed design system using CSS variables, responsive grids, and subtle elevation shadows. |
| **Application** | **Node.js** | Asynchronous, event-driven JavaScript runtime executing server-side logic without thread-blocking. |
| | **Express.js** | Minimalist web framework providing RESTful routing, request parsing, and middleware chaining. |
| | **jsonwebtoken** | Cryptographic token generation and verification for stateless authentication. |
| | **bcryptjs** | Salted password hashing algorithm safeguarding credentials against dictionary and rainbow-table attacks. |
| | **CORS & Morgan** | Cross-Origin Resource Sharing enablement and automated development request logging. |
| **Data Tier** | **MongoDB Atlas** | Multi-region cloud NoSQL document database providing dynamic schema adaptability for nested rosters. |
| | **Mongoose ODM** | Object Data Modeling library enforcing schema constraints, data validation, and relational `.populate()`. |

---

## 4. System Architecture & Request Pipeline

### Detailed Architectural Diagram

```
[ Student Web Browser ]
        │
        │  1. Client sends HTTP Request (e.g. GET /api/projects)
        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Express.js Server Pipeline                       │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ Middleware 1: CORS Policy Handler (cors)                        │   │
│   └───────────────────────────────┬─────────────────────────────────┘   │
│                                   ▼                                     │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ Middleware 2: JSON Body Parser (express.json())                 │   │
│   └───────────────────────────────┬─────────────────────────────────┘   │
│                                   ▼                                     │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ Middleware 3: HTTP Request Logger (morgan)                      │   │
│   └───────────────────────────────┬─────────────────────────────────┘   │
│                                   ▼                                     │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ Middleware 4: JWT Authentication Guard (authMiddleware.protect)  │   │
│   │ - Extracts 'Bearer <token>' from Authorization Header           │   │
│   │ - Verifies signature with JWT_SECRET                            │   │
│   │ - Injects decoded student document into req.user                │   │
│   └───────────────────────────────┬─────────────────────────────────┘   │
│                                   ▼                                     │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ Route Dispatchers (/api/auth, /api/users, /api/projects, ...)   │   │
│   └───────────────────────────────┬─────────────────────────────────┘   │
│                                   ▼                                     │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ Controllers (Business Logic, Capacity Checks, Duplicate Checks) │   │
│   └───────────────────────────────┬─────────────────────────────────┘   │
│                                   ▼                                     │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ Mongoose Models & Schemas (User, Project, CollaborationRequest) │   │
│   └───────────────────────────────┬─────────────────────────────────┘   │
└───────────────────────────────────┼─────────────────────────────────────┘
                                    │
                                    │  2. Mongoose Driver Queries via TCP
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas Cloud Database Cluster                 │
│         [users]          •         [projects]       •     [requests]    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Project Structure

```
skillbridge/
├── client/                             # Frontend React Single-Page Application
│   ├── public/                         # Public assets & application icons
│   ├── src/
│   │   ├── components/                 # Reusable Modular UI Components
│   │   │   ├── Navbar.jsx              # Responsive header with desktop/mobile drawer
│   │   │   ├── Footer.jsx              # Academic footer, branding & domain links
│   │   │   ├── ProjectCard.jsx         # Card featuring team capacity progress & tags
│   │   │   ├── ProjectForm.jsx         # Reusable creation/edit form with tag builder
│   │   │   ├── ProjectFilters.jsx      # Multi-criteria filter strip (Domain, Mode, Sort)
│   │   │   ├── SearchBar.jsx           # Debounced search bar with clear action
│   │   │   ├── ProfileCard.jsx         # Student portfolio card with social badges
│   │   │   ├── SkillTag.jsx            # Removable hashtag skill badge
│   │   │   ├── RequestCard.jsx         # Request card with Accept/Reject controls
│   │   │   ├── StatCard.jsx            # Analytical metric card with gradient icon box
│   │   │   ├── ProtectedRoute.jsx      # Authentication route guard
│   │   │   ├── ToastNotification.jsx   # Animated alert notification banner
│   │   │   ├── LoadingSpinner.jsx      # CSS keyframe spinning indicator
│   │   │   └── EmptyState.jsx          # Illustrated fallback for empty queries
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Context API managing user session & token
│   │   ├── pages/                      # 11 Dedicated Application Views
│   │   │   ├── LandingPage.jsx         # Hero, platform metrics, featured projects
│   │   │   ├── RegisterPage.jsx        # Validated registration form
│   │   │   ├── LoginPage.jsx           # Authentication with 1-click viva demo selector
│   │   │   ├── DashboardPage.jsx       # Student command center with live stats
│   │   │   ├── ExploreProjectsPage.jsx # Public project discovery directory
│   │   │   ├── ProjectDetailsPage.jsx  # Detailed specifications & join request modal
│   │   │   ├── CreateProjectPage.jsx   # Project publishing form view
│   │   │   ├── MyProjectsPage.jsx      # Tabbed manager for created & joined projects
│   │   │   ├── CollaborationRequestsPage.jsx # Two-way request management interface
│   │   │   ├── ProfilePage.jsx         # Public/private student profile display
│   │   │   └── EditProfilePage.jsx     # Profile editing view with skill tag editor
│   │   ├── services/
│   │   │   └── api.js                  # Axios client with request/response interceptors
│   │   ├── utils/
│   │   │   └── helpers.js              # Formatting, badge styling, & initials helpers
│   │   ├── App.jsx                     # Route architecture and route definitions
│   │   ├── index.css                   # Custom global stylesheet (clean startup theme)
│   │   ├── main.jsx                    # React Virtual DOM root mounting
│   │   └── vercel.json                 # Vercel Single-Page Application rewrite rules
│   ├── package.json
│   └── vite.config.js                  # Vite bundler configuration & /api proxy
│
├── server/                             # Backend Node.js & Express RESTful API
│   ├── config/
│   │   └── db.js                       # Mongoose connection & in-memory fallback
│   ├── controllers/
│   │   ├── authController.js           # registerUser, loginUser, getMe
│   │   ├── userController.js           # getUserById, updateProfile, searchUsers
│   │   ├── projectController.js        # createProject, getProjects, getById, update, delete
│   │   └── requestController.js        # sendRequest, getSent, getReceived, accept, reject
│   ├── middleware/
│   │   ├── authMiddleware.js           # JWT verification & req.user injection
│   │   └── errorMiddleware.js          # Mongoose CastError, duplicate key & 404 handler
│   ├── models/
│   │   ├── User.js                     # Student schema with bcrypt pre-save hook
│   │   ├── Project.js                  # Project schema with embedded members roster
│   │   └── CollaborationRequest.js     # Request schema with status enum
│   ├── routes/
│   │   ├── authRoutes.js               # /api/auth endpoints
│   │   ├── userRoutes.js               # /api/users endpoints
│   │   ├── projectRoutes.js            # /api/projects endpoints
│   │   └── requestRoutes.js            # /api/requests endpoints
│   ├── utils/
│   │   └── seedData.js                 # 4 sample student profiles & 6 projects
│   ├── seed.js                         # Database seeder script
│   ├── test-suite.js                   # 24-point automated integration test suite
│   ├── run-tests.js                    # Cross-platform automated test runner
│   ├── server.js                       # Express app bootstrap & port binding
│   └── package.json
│
├── README.md                           # Master technical documentation
├── PRESENTATION_PROJECT_EXPLANATION.md # 5-minute presentation script & slide guide
├── VIVA_QUESTIONS_AND_ANSWERS.md       # 20 in-depth viva questions with complete answers
├── TESTING_CHECKLIST.md                # Verification test checklist
└── .gitignore
```

---

## 6. Major Features & Domain Logic

### 1. Landing Page (`/`)
- **Hero Presentation:** Clean value proposition: *"Find Your Team. Build Something Great."*
- **Dynamic Metrics Strip:** Live platform metrics (500+ Students, 150+ Projects, 350+ Collaborations, 98% Match Rate).
- **Featured Projects:** Automatically fetches top active projects from the database.
- **Popular Skills Cloud:** Interactive skill badges (`#React`, `#Python`, `#IoT`) that link directly to filtered explore queries.
- **3-Step Workflow:** Visual educational guide explaining Profile Creation -> Project Discovery -> Team Collaboration.

### 2. Authentication System (`/register` & `/login`)
- **Registration Form:** Validates Name, University Email, College, Branch, Year of Study, and Matching Passwords.
- **Password Encryption:** Passwords hashed with `bcryptjs` (salt factor 10).
- **Viva Demo Switcher:** 4 pre-configured buttons (*Aarav Sharma - Lead Dev*, *Priya Patel - AI Researcher*, *Rohan Verma - IoT*, *Ananya Iyer - UI/UX*) allowing instantaneous credential autofilling during evaluations.
- **Password Visibility:** Toggleable eye icon for password verification.

### 3. Student Dashboard (`/dashboard`)
- **Personalized Greeting:** Welcomes student by name and branch.
- **4 Analytical Stat Cards:** Real-time computation of Projects Created, Projects Joined, Pending Requests, and Accepted Collaborations.
- **Quick Action Bar:** One-click shortcuts to Create Project, Explore Projects, Edit Profile, and Manage Requests.
- **Dual Section Layout:** Left column displays projects; right column highlights incoming team requests and recent outgoing applications.

### 4. Explore Projects Directory (`/explore`)
- **Multi-Field Search:** Real-time keyword search inspecting title, description, and required skills via `$regex`.
- **Domain Filter:** Filter by Web Development, AI/ML, App Development, Cybersecurity, IoT, Data Science, Design, or Other.
- **Collaboration Mode Filter:** Filter by Online, Offline, or Hybrid.
- **Status Filter:** Filter by Looking for Team Members, In Progress, or Team Complete.
- **Sorting:** Chronological ordering (Newest / Oldest).

### 5. Project Details & Interactive Join Modal (`/projects/:id`)
- **Comprehensive View:** Full problem statement, category tag, creation timestamp, and required skills list.
- **Capacity Indicator:** Displays current members versus total capacity (e.g., `2 / 4 Members`).
- **Team Roster:** Lists all confirmed collaborators and their assigned roles (*Project Lead*, *UI Designer*, *Collaborator*).
- **Project Lead Profile:** Displays creator's academic year, college, bio, email, GitHub, and LinkedIn links.
- **Intelligent Collaboration Modal:** Opens customized proposal form, automatically disabling requests if the student is the creator, already a member, has a pending application, or if the team is full.

### 6. Project Idea Publishing (`/create-project`)
- **Interactive Form:** Title, minimum 20-character description, category, target team size (2–20), duration, and collaboration mode.
- **Dynamic Tag Builder:** Students type a skill name and press Enter to generate removable hashtag badges.
- **Automatic Roster Assignment:** Automatically appends the creator as the first team member with the role `"Project Lead"`.

### 7. My Projects Manager (`/my-projects`)
- **Tabbed Architecture:** *Created by Me* and *Joined as Teammate*.
- **In-Place Project Editing:** Opens modal allowing updates to title, description, skills, category, and recruitment status.
- **Delete with Cascade Removal:** Deletes the project and cleans up all associated collaboration requests.

### 8. Two-Way Collaboration Requests (`/requests`)
- **Received Requests:** Displays incoming applicant name, college, year, technical skills badges, and custom proposal pitch with one-click **Accept** and **Decline** actions.
- **Sent Proposals:** Allows students to monitor their outgoing project applications and current status (*Pending*, *Accepted*, *Rejected*).

### 9. Student Profile & Edit Profile (`/profile` & `/edit-profile`)
- **Profile Presentation:** Generates avatar initials badge, lists academic credentials, bio, technical skills tags, and external social links.
- **Interactive Profile Editor:** Real-time adding and removing of skill tags and interest tags with instant synchronization across the client session.

---

## 7. Database & Data Modeling (MongoDB)

SkillBridge utilizes **MongoDB Atlas** governed by **Mongoose ODM**. Below are the concrete schema definitions:

### 1. User Schema (`server/models/User.js`)
```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: [true, 'Please provide your college email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false // Excluded from query results by default
  },
  college: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  year: {
    type: String,
    required: true,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate', 'Other']
  },
  bio: {
    type: String,
    default: 'Student passionate about technology, collaboration, and building meaningful projects.',
    maxlength: 500
  },
  skills: { type: [String], default: [] },
  interests: { type: [String], default: [] },
  github: { type: String, default: '', trim: true },
  linkedin: { type: String, default: '', trim: true },
  createdAt: { type: Date, default: Date.now }
});
```

### 2. Project Schema (`server/models/Project.js`)
```javascript
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    minlength: 5,
    maxlength: 120
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    minlength: [20, 'Description must be at least 20 characters long']
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Web Development', 'AI / Machine Learning', 'App Development',
      'Cybersecurity', 'IoT', 'Data Science', 'Design', 'Other'
    ]
  },
  requiredSkills: {
    type: [String],
    required: true,
    validate: [v => v && v.length > 0, 'At least one skill is required']
  },
  teamSize: {
    type: Number,
    required: true,
    min: [2, 'Team size must be at least 2'],
    max: [20, 'Team size cannot exceed 20']
  },
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      role: { type: String, default: 'Collaborator' },
      joinedAt: { type: Date, default: Date.now }
    }
  ],
  duration: { type: String, default: '1-3 months', trim: true },
  collaborationType: {
    type: String,
    required: true,
    enum: ['Online', 'Offline', 'Hybrid'],
    default: 'Online'
  },
  status: {
    type: String,
    required: true,
    enum: ['Looking for Team Members', 'Team Complete', 'In Progress'],
    default: 'Looking for Team Members'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### 3. Collaboration Request Schema (`server/models/CollaborationRequest.js`)
```javascript
const collaborationRequestSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: {
    type: String,
    default: 'Hi! I am interested in collaborating on your project.',
    maxlength: 300
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  createdAt: { type: Date, default: Date.now }
});
```

### Entity-Relationship (ER) Diagram

```
┌───────────────────────────────┐                  ┌───────────────────────────────┐
│             USER              │                  │            PROJECT            │
├───────────────────────────────┤                  ├───────────────────────────────┤
│ _id (PK)         ObjectId     │1                *│ _id (PK)         ObjectId     │
│ name             String       │──────────────────│ createdBy (FK)   ObjectId     │
│ email            String (UQ)  │ (Creates)        │ title            String       │
│ password         String (Hash)│                  │ description      String       │
│ college          String       │1                *│ category         String       │
│ department       String       │──────────────────│ requiredSkills   Array[String]│
│ year             String       │ (Belongs To)     │ teamSize         Number       │
│ skills           Array[String]│                  │ collaborationType String      │
│ interests        Array[String]│                  │ status           String       │
│ github / linkedin String      │                  │ members          Array[SubDoc]│
└───────────────────────────────┘                  └───────────────────────────────┘
                │1                                                 │1
                │                                                  │
                │ * (Sends / Receives)                             │ * (Applied To)
                ▼                                                  ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                               COLLABORATION REQUEST                              │
├──────────────────────────────────────────────────────────────────────────────────┤
│ _id (PK)                      ObjectId                                           │
│ projectId (FK)                ObjectId (References Project._id)                  │
│ senderId (FK)                 ObjectId (References User._id)                     │
│ receiverId (FK)               ObjectId (References User._id)                     │
│ message                       String                                             │
│ status                        Enum ['Pending', 'Accepted', 'Rejected']           │
│ createdAt                     Date                                               │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Validation Rules & Safeguards

SkillBridge enforces strict validation at both the client and server tiers:

### 1. Client-Side Validations
- **Email Validation:** Regular expression format check (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
- **Password Constraints:** Enforces minimum 6 characters and verifies matching password confirmation.
- **Description Length:** Enforces at least 20 characters for project proposals to prevent low-effort spam.
- **Tag Validation:** Prevents duplicate skills from being added to the same project.

### 2. Server-Side Data Integrity & Security Safeguards
- **Password Salting:** Mongoose `pre('save')` hook hashes passwords with `bcryptjs`. Passwords are excluded from query results via `select: false`.
- **Self-Join Prevention:** The backend checks `project.createdBy.toString() === req.user._id.toString()`. Project owners attempting to join their own projects receive an HTTP 400 Bad Request error.
- **Duplicate Request Blocking:** The database queries for existing requests matching `{ projectId, senderId, status: { $in: ['Pending', 'Accepted'] } }`. Duplicate attempts are rejected immediately.
- **Capacity Enforcement:** Before accepting a request, `project.members.length` is verified against `project.teamSize`. If the team is full, the request cannot be accepted.
- **Automatic Status Transition:** When an accepted request brings `project.members.length === project.teamSize`, the project status automatically updates to `"Team Complete"`.
- **Authorization Checks on Modification:** When updating or deleting projects, the controller verifies ownership (`project.createdBy.toString() === req.user._id.toString()`), returning HTTP 403 Forbidden for unauthorized attempts.
- **Cascade Deletion:** Deleting a project automatically triggers a cascade removal of all associated collaboration requests.

---

## 9. Routing, GET & POST Handling

### REST API Route Table

| Category | Method | Endpoint | Access | Request Body / Params | Expected Response | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Public | `{ name, email, password, college, department, year }` | `201 Created` + JWT + User | Registers a new student account |
| | `POST` | `/api/auth/login` | Public | `{ email, password }` | `200 OK` + JWT + User | Authenticates credentials and issues token |
| | `GET` | `/api/auth/me` | Private | *None* (Header: `Bearer <token>`) | `200 OK` + User | Retrieves current authenticated student |
| **Users** | `GET` | `/api/users/:id` | Public | *Param:* `:id` | `200 OK` + User | Retrieves public student profile |
| | `PUT` | `/api/users/profile` | Private | `{ name, college, department, year, bio, skills, interests, github, linkedin }` | `200 OK` + Updated User | Updates current student profile |
| | `GET` | `/api/users/search` | Public | *Query:* `?q=keyword&skill=React` | `200 OK` + Users Array | Searches students by keyword or skill |
| **Projects** | `GET` | `/api/projects` | Public | *Query:* `?search=&category=&collaborationType=&status=&sort=` | `200 OK` + Projects Array | Multi-parameter project discovery query |
| | `POST` | `/api/projects` | Private | `{ title, description, category, requiredSkills, teamSize, duration, collaborationType, status }` | `201 Created` + Project | Creates project idea (auto-adds creator as lead) |
| | `GET` | `/api/projects/:id` | Public | *Param:* `:id` | `200 OK` + Project | Retrieves project with populated members |
| | `PUT` | `/api/projects/:id` | Private (Owner) | `{ title, description, category, requiredSkills, teamSize, duration, collaborationType, status }` | `200 OK` + Project | Updates project details |
| | `DELETE`| `/api/projects/:id` | Private (Owner) | *Param:* `:id` | `200 OK` + Success Message | Deletes project and cascade-removes requests |
| | `GET` | `/api/projects/my-projects` | Private | *None* | `200 OK` + Projects Array | Retrieves projects created by current student |
| | `GET` | `/api/projects/joined` | Private | *None* | `200 OK` + Projects Array | Retrieves projects student has joined as member |
| **Requests**| `POST` | `/api/requests` | Private | `{ projectId, message }` | `201 Created` + Request | Submits join request to project creator |
| | `GET` | `/api/requests/sent` | Private | *None* | `200 OK` + Requests Array | Retrieves outgoing applications |
| | `GET` | `/api/requests/received` | Private | *None* | `200 OK` + Requests Array | Retrieves incoming applications for owned projects |
| | `PUT` | `/api/requests/:id/accept` | Private (Owner) | *Param:* `:id` | `200 OK` + Request | Accepts request & appends member to team |
| | `PUT` | `/api/requests/:id/reject` | Private (Owner) | *Param:* `:id` | `200 OK` + Request | Declines a collaboration request |

---

## 10. Working of the Project (Execution Flow)

```
┌────────────────────────────────────────────────────────────────────────┐
│                   STEP 1: REGISTRATION & AUTHENTICATION                │
│  Student submits registration form -> bcrypt hashes password ->        │
│  User record saved in MongoDB -> JWT signed & returned to client ->     │
│  Axios stores token in localStorage & attaches to all future headers.  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   STEP 2: PROJECT PUBLISHING LIFECYCLE                 │
│  Student clicks 'Post Project' -> Enters title, description, & skills  │
│  tags -> Submits POST /api/projects -> Server sets createdBy to        │
│  student ID & appends student as 'Project Lead' in members array ->    │
│  Project immediately indexed in MongoDB Atlas.                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   STEP 3: DISCOVERY & FILTERING PIPELINE               │
│  Peers navigate to /explore -> Type query (e.g. 'TensorFlow') ->       │
│  Filter by category ('AI / Machine Learning') -> GET /api/projects     │
│  executes regex query -> Responsive project cards rendered.            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   STEP 4: COLLABORATION APPLICATION & REVIEW           │
│  Peer clicks 'Request to Join' on project details page ->              │
│  Enters personalized pitch message -> POST /api/requests submitted ->  │
│  Server validates no duplicate exists & team has vacancy ->            │
│  Request stored as 'Pending'.                                          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   STEP 5: TEAM ROSTER SYNCHRONIZATION                  │
│  Project Lead views /requests -> Reviews applicant's technical skills  │
│  & portfolio -> Clicks 'Accept & Add to Team' -> Server adds applicant │
│  to project.members with role 'Collaborator' -> If capacity reached,   │
│  status switches to 'Team Complete' -> Both dashboards update in sync. │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Output & UI Screenshots Guide

Capture the following 9 screenshots directly from your deployed web application:

- **Figure 1: Landing Page**  
  *Features:* SkillBridge logo, navigation bar, hero banner (*"Find Your Team. Build Something Great."*), real-time statistics counter, and featured project cards.
- **Figure 2: Student Authentication Interface (`/login` & `/register`)**  
  *Features:* Form validation messages, password visibility toggles, and the one-click demo credentials picker.
- **Figure 3: Student Dashboard (`/dashboard`)**  
  *Features:* Personalized greeting, 4 dynamic analytical cards (Projects Created, Projects Joined, Pending Requests, Collaborations), and quick action buttons.
- **Figure 4: Explore Projects Directory (`/explore`)**  
  *Features:* Search bar executing keyword lookups, domain category filter pills, collaboration mode selectors, and responsive project cards.
- **Figure 5: Project Details & Team Roster View (`/projects/:id`)**  
  *Features:* Full description, required skill badges, capacity indicator (`X / Y Members`), team member list with assigned roles, and the interactive "Request to Join" modal.
- **Figure 6: Collaboration Requests Management (`/requests`)**  
  *Features:* Received Requests tab showing applicant branch, listed skills, and Accept/Decline action buttons, alongside the Sent Proposals tab.
- **Figure 7: Student Profile & Edit Profile View (`/profile` & `/edit-profile`)**  
  *Features:* Avatar initials, biography, interactive technical skill tag management (adding/removing tags), and portfolio links.
- **Figure 8: Render Cloud Backend Dashboard**  
  *Features:* Service status showing `Deploy succeeded | Live` and log output `✅ MongoDB Connected`.
- **Figure 9: Vercel Production Deployment View**  
  *Features:* Production deployment screen displaying the live CDN URL.

---

## 12. Comprehensive Test Cases Matrix

Below is the verification matrix executed by the automated test suite (`npm test`) and manual verification:

| Test ID | Module | Test Description | Input Data | Expected Output | Actual Output | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | System | Health check endpoint verification | `GET /api/health` | HTTP 200, `status: 'OK'` | HTTP 200, `status: 'OK'` | **PASS** |
| **TC-02** | Auth | Register with invalid email format | `email: 'bad-email'` | HTTP 400 Validation Error | HTTP 400 Validation Error | **PASS** |
| **TC-03** | Auth | Register valid student account | Valid user object | HTTP 201 Created + JWT token | HTTP 201 Created + JWT token | **PASS** |
| **TC-04** | Auth | Register duplicate email address | Existing email | HTTP 400 Duplicate Error | HTTP 400 Duplicate Error | **PASS** |
| **TC-05** | Auth | Login with incorrect password | Wrong password string | HTTP 401 Unauthorized | HTTP 401 Unauthorized | **PASS** |
| **TC-06** | Auth | Login with valid credentials | Correct email & password | HTTP 200 OK + JWT token | HTTP 200 OK + JWT token | **PASS** |
| **TC-07** | Auth | Access protected route (`/api/auth/me`)| Valid Bearer JWT | HTTP 200 OK + Student Profile | HTTP 200 OK + Student Profile | **PASS** |
| **TC-08** | Projects | Project creation with short description | Description < 20 chars | HTTP 400 Validation Error | HTTP 400 Validation Error | **PASS** |
| **TC-09** | Projects | Valid project creation | Valid project payload | HTTP 201 Created + Project | HTTP 201 Created + Project | **PASS** |
| **TC-10** | Projects | Creator automatically assigned as Lead | Valid project payload | `members[0].role === 'Project Lead'` | `members[0].role === 'Project Lead'` | **PASS** |
| **TC-11** | Projects | Browse all active projects | `GET /api/projects` | HTTP 200 + Projects array | HTTP 200 + Projects array | **PASS** |
| **TC-12** | Projects | Search projects by keyword | `?search=Drone` | Returns matching drone project | Matching drone project returned | **PASS** |
| **TC-13** | Projects | Filter projects by category domain | `?category=IoT` | Returns only IoT projects | Only IoT projects returned | **PASS** |
| **TC-14** | Projects | Query single project by ObjectId | Valid project `:id` | HTTP 200 + populated project | HTTP 200 + populated project | **PASS** |
| **TC-15** | Projects | Unauthorized project edit attempt | Non-owner user token | HTTP 403 Forbidden | HTTP 403 Forbidden | **PASS** |
| **TC-16** | Projects | Authorized project update by creator | Project creator token | HTTP 200 + Updated project | HTTP 200 + Updated project | **PASS** |
| **TC-17** | Requests | Creator requests to join own project | Creator ID on own project | HTTP 400 Self-join rejected | HTTP 400 Self-join rejected | **PASS** |
| **TC-18** | Requests | Student submits join request | Valid `projectId` + message | HTTP 201 Created + Request | HTTP 201 Created + Request | **PASS** |
| **TC-19** | Requests | Duplicate join request attempt | Repeated request submission | HTTP 400 Duplicate rejected | HTTP 400 Duplicate rejected | **PASS** |
| **TC-20** | Requests | Owner views received applications | Owner user token | HTTP 200 + Received array | HTTP 200 + Received array | **PASS** |
| **TC-21** | Requests | Student views sent applications | Applicant user token | HTTP 200 + Sent array | HTTP 200 + Sent array | **PASS** |
| **TC-22** | Requests | Owner accepts collaboration request | Owner token + request ID | HTTP 200 `status: 'Accepted'` | HTTP 200 `status: 'Accepted'` | **PASS** |
| **TC-23** | Requests | Team roster updates upon acceptance | Query project after accept | Member count increments to 2 | Member count increments to 2 | **PASS** |
| **TC-24** | Projects | Creator deletes project cascade | Creator token + project ID | HTTP 200 OK + Requests cleaned | HTTP 200 OK + Requests cleaned | **PASS** |

---

## 13. Setup and Cloud Deployment

### A. Local Development Environment
1. **Repository Setup:**
   ```bash
   git clone https://github.com/rrriya04/Skillbridge.git
   cd Skillbridge
   ```
2. **Backend Setup:**
   ```bash
   cd server
   npm install
   # Configure server/.env: PORT=5000, JWT_SECRET=..., MONGODB_URI=...
   npm run dev
   ```
3. **Frontend Setup:**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```
   *Frontend launches on `http://localhost:5173` with Vite proxy routing `/api` to `http://localhost:5000`.*

### B. Production Cloud Architecture
- **Database (MongoDB Atlas):** Hosted on an AWS multi-tenant cloud cluster with network access allowed (`0.0.0.0/0`) and encrypted credential authorization.
- **Backend API (Render):** Deployed as a Linux Web Service connected to GitHub repository `rrriya04/Skillbridge` (Root Directory: `server`, Start Command: `node server.js`). Live URL: `https://skillbridge-7ae8.onrender.com`.
- **Frontend SPA (Vercel):** Deployed via Vercel Edge Network connected to GitHub repository `rrriya04/Skillbridge` (Root Directory: `client`, Build: `npm run build`, Output: `dist`). Equipped with `vercel.json` rewrite rules routing all URLs to `/index.html` for client-side navigation.

---

## 14. Limitations & Future Scope

### Current Limitations
1. **Stateless Polling:** Updates to request states or member rosters require page refresh or navigation, as HTTP REST APIs are request-response driven rather than bi-directional.
2. **Free-Tier Server Spin-Down:** On free-tier cloud hosting (Render), backend services spin down after 15 minutes of inactivity, resulting in a cold-start delay of approximately 30–50 seconds on initial load.
3. **Institutional Verification:** Student emails are validated by standard email syntax, but do not yet enforce active institutional domain verification via one-time passwords (OTP).

### Future Scope
1. **Real-Time WebSockets Communication:** Integrating `Socket.io` to provide real-time group chats and instant push notifications when a collaboration request is received or accepted.
2. **AI-Powered Recommendation Algorithm:** Implementing natural language embeddings and cosine similarity to automatically recommend projects matching a student's stated technical competencies.
3. **Institutional Single Sign-On (SSO):** Connecting university identity providers (OAuth 2.0 / SAML) for verified academic credentials.
4. **GitHub Commit Activity Synchronization:** Syncing team repositories to display live commit activity, burndown charts, and contribution graphs directly on project pages.
5. **Rating & Peer Endorsement System:** Allowing team leads and collaborators to endorse skills and submit peer reviews upon project completion.

---

## 15. Conclusion

The **SkillBridge – Student Skill & Project Collaboration Platform** was successfully designed, developed, tested, and deployed to production. The platform directly addresses the widespread challenge of isolated skills and uncoordinated team recruitment in college and university environments.

By leveraging the **MERN Stack** (MongoDB Atlas, Express.js, React 18, and Node.js), SkillBridge demonstrates the power of modern decoupled web architecture. It enforces rigorous security through salted `bcryptjs` password hashing and JSON Web Tokens, offers intuitive multi-criteria project exploration, provides dynamic analytics on personalized student dashboards, and manages team recruitment through a safeguarded collaboration state machine.

Passing all 24 automated integration test cases and achieving live cloud deployment on Render and Vercel confirms the platform's reliability, stability, and production readiness. SkillBridge bridges the campus gap between individual technical talent and ambitious collaborative innovation.
