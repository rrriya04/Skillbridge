# SkillBridge – Student Skill & Project Collaboration Platform
## Academic Mini-Project Documentation

---

### 1. Aim
To design, develop, test, and deploy a secure, responsive, full-stack web application named **"SkillBridge – Student Skill & Project Collaboration Platform"** using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with JSON Web Token (JWT) authentication and RESTful API architecture, facilitating streamlined teammate discovery, complementary skill matching, and project recruitment for college students and hackathon participants.

---

### 2. Objectives
1. **User Authentication & Authorization:** Implement secure student registration and login utilizing `bcryptjs` for salted password hashing and stateless JSON Web Tokens (JWT) for protecting private routes.
2. **Student Profile & Technical Portfolio Management:** Enable students to create and maintain personalized profiles detailing their college, department, academic year, bio, technical and soft skills, and external GitHub/LinkedIn portfolios.
3. **Project Idea Publishing:** Provide an intuitive project creation interface allowing students to post project proposals specifying domain categories, duration, collaboration mode (Online, Offline, Hybrid), target team size (2–20), and dynamic required skill tags.
4. **Project Discovery & Multi-Parameter Filtering:** Build an explore directory featuring real-time keyword search (across titles, descriptions, and skills), domain filtering, collaboration type filters, and chronological sorting.
5. **Interactive Collaboration Request Workflow:** Develop a two-way collaboration system allowing students to send personalized join requests and project owners to review applicant profiles and accept or decline requests with automatic team roster updating and capacity enforcement.
6. **Dynamic Dashboard Analytics:** Create an analytical student dashboard dynamically computing active metrics: Projects Created, Projects Joined, Pending Applications, and Accepted Collaborations.
7. **Cloud-Native Deployment:** Host the decoupled application across cloud services: database on **MongoDB Atlas**, backend API on **Render**, frontend user interface on **Vercel**, and version control on **GitHub**.

---

### 3. Theory / Concept

#### A. Architectural Pattern: Decoupled Client-Server REST Architecture
The platform is built on a decoupled architecture where the React frontend and Express.js backend operate independently and communicate asynchronously over HTTP via a RESTful API using JSON data exchange.

#### B. Frontend Layer (React 18 & Vite):
- **Single Page Application (SPA):** Seamless user navigation without page reloads using React Router 6.
- **Component-Based Hierarchy:** Modular, reusable UI components (Cards, Forms, Filters, Modals, Spinners, Badges) adhering to the Single Responsibility Principle.
- **React Hooks & Context API:** 
  - `useState` for local form states and UI toggles.
  - `useEffect` for lifecycle side-effects (data retrieval on mount/filter updates).
  - `useContext` (`AuthContext`) for centralized, app-wide authentication state management without prop drilling.
- **Axios HTTP Client & Interceptors:** Pre-flight request interceptors inject the `Authorization: Bearer <token>` header on protected API calls, while response interceptors handle session expirations.

#### C. Backend Layer (Node.js & Express.js):
- **Event-Driven Non-Blocking I/O:** Node.js executes asynchronous operations efficiently, capable of handling concurrent collaboration requests.
- **Modular MVC Design:** Separation of concerns dividing logic into Routes, Controllers, Models, and Middleware.
- **Middleware Pipeline:** Built-in JSON body parsers, Cross-Origin Resource Sharing (`cors`), HTTP request logger (`morgan`), and centralized error-handling middleware.

#### D. Database Layer (MongoDB Atlas & Mongoose ODM):
- **Document-Oriented NoSQL Database:** Data is modeled as flexible JSON-like BSON documents, perfectly suited for hierarchical data like nested skill tags and team member arrays.
- **Mongoose ODM:** Enforces schema structure, validation constraints (e.g., minimum description lengths, team capacity limits), and relational population (`.populate()`) to link users and projects.

#### E. Security & Cryptography:
- **Salted Password Hashing:** `bcryptjs` applies a cryptographic one-way hashing function with 10 salt rounds to ensure plaintext passwords are never stored.
- **Token-Based Authentication (JWT):** The server issues a cryptographically signed token containing user claims (`id`) signed with a private secret (`JWT_SECRET`), eliminating server-side session memory overhead.

---

### 4. Procedure / Steps

1. **Step 1: System Analysis & Database Modeling:**
   - Defined schemas for `User`, `Project`, and `CollaborationRequest` with appropriate data types, defaults, and cross-collection references (`ObjectId`).
2. **Step 2: Backend RESTful API Development:**
   - Initialized Express server, configured MongoDB connection pooling, and built REST routes for authentication (`/api/auth`), profile management (`/api/users`), project CRUD (`/api/projects`), and request handling (`/api/requests`).
3. **Step 3: Security & Middleware Implementation:**
   - Implemented `authMiddleware.js` for JWT verification and `errorMiddleware.js` for intercepting bad ObjectIds, duplicate key errors, and validation exceptions.
4. **Step 4: Frontend Development with React & Vite:**
   - Scaffolded the frontend using Vite, established global CSS styling variables (clean startup theme), and built 14 reusable components and 11 distinct application pages.
5. **Step 5: Frontend-Backend Integration:**
   - Integrated Axios client with Vite development proxy (`/api -> http://localhost:5000`), connected authentication forms to JWT endpoints, and established dynamic data binding on the student dashboard.
6. **Step 6: Automated Testing & Verification:**
   - Executed a 24-point automated end-to-end integration test suite verifying authentication rules, duplicate request blocking, self-join prevention, and project roster updates.
7. **Step 7: Version Control & Production Deployment:**
   - Initialized Git repository, staged all project modules, and published to GitHub (`rrriya04/Skillbridge`).
   - Provisioned cloud database cluster on **MongoDB Atlas**.
   - Deployed the Express backend as a Web Service on **Render**.
   - Deployed the React single-page frontend on **Vercel** with SPA rewrite rules.

---

### 5. Output / Screenshots to Include in Report

*(Attach screenshots of the live application from your browser)*

1. **Figure 1: Landing Page** – Showing the SkillBridge logo, navigation bar, hero section (*"Find Your Team. Build Something Great."*), platform statistics strip, and featured project cards.
2. **Figure 2: Student Registration & Login Interface** – Showing input fields, client-side validation errors, password visibility toggle, and one-click demo credentials.
3. **Figure 3: Student Dashboard** – Displaying the 4 real-time metric cards (Projects Created, Projects Joined, Pending Requests, Accepted Collaborations) and recent project cards.
4. **Figure 4: Explore Projects Directory** – Demonstrating keyword search query execution, domain category filtering, and sorting dropdown.
5. **Figure 5: Project Details Page & Team Roster** – Showing full description, required skill badges, current team members list (`X / Y Members`), and the interactive "Request to Join Team" modal.
6. **Figure 6: Collaboration Requests Management** – Displaying Received Requests tab with applicant skill tags, custom proposal message, and Accept/Decline action buttons.
7. **Figure 7: Student Profile & Edit Profile Screen** – Demonstrating technical skill tag management (adding/removing tags), bio update, and social profile links.
8. **Figure 8: Render Backend Deployment Dashboard** – Showing `Deploy succeeded | Live` and log output `✅ MongoDB Connected`.
9. **Figure 9: Vercel Production Deployment Screen** – Showing the live deployment preview screen and production URL.

---

### 6. Result & Conclusion

#### Result:
The **SkillBridge – Student Skill & Project Collaboration Platform** was successfully engineered, rigorously verified through automated testing (24/24 test cases passed), and deployed to live production. The application achieves seamless real-time synchronization between the React client, Express API server, and MongoDB Atlas cloud database. The collaboration request workflow successfully enforces business constraints: preventing duplicate requests, prohibiting self-joins, updating team capacities, and reflecting member roles accurately across all dashboard views.

#### Conclusion:
SkillBridge delivers a practical, scalable, and modern software solution to the widespread problem of isolated student skills and ad-hoc project teaming in higher education. By combining a modern, accessible UI with robust RESTful APIs and secure JWT authentication, the platform fosters peer collaboration and multidisciplinary innovation. The project demonstrates the versatility, efficiency, and developer productivity of the MERN stack for modern full-stack web applications.

#### Future Scope:
1. **Real-Time Messaging:** Integrating Socket.io WebSockets for instant in-app group chats between confirmed project collaborators.
2. **AI-Powered Recommendation Engine:** Employing vector embeddings or cosine similarity algorithms to recommend projects based on a student's stated technical skill profile.
3. **Institutional Email Verification:** Integrating automated OTP verification restricted to valid university domain emails (`.edu`).
4. **GitHub Commit Activity Tracker:** Synchronizing project repositories to display live commit graphs and milestone roadmaps.
