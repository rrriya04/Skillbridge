# SkillBridge – 20 Viva Questions and Answers

Use this document to prepare for your college project viva, external examiner questions, and technical interviews.

---

### Q1: What is the primary objective of the SkillBridge application?
**Answer:**  
SkillBridge is designed to solve the college teammate discovery problem. In educational institutions, students with diverse skills (frontend, backend, AI/ML, IoT, UI/UX design) often struggle to find peers with complementary skills for hackathons, term assignments, and capstone projects. SkillBridge provides a centralized platform for students to showcase technical profiles, post project ideas, browse collaboration opportunities, and manage team applications in real time.

---

### Q2: What is the MERN stack and why did you choose it for this project?
**Answer:**  
The MERN stack consists of **MongoDB** (database), **Express.js** (backend web framework), **React** (frontend user interface), and **Node.js** (JavaScript runtime environment).  
I chose MERN because:
1. **Unified Language:** It uses JavaScript across both the frontend and backend, reducing context switching.
2. **Component Reusability:** React's component-based architecture makes building modern single-page applications efficient.
3. **Document-Oriented Database:** MongoDB stores data in flexible JSON-like documents, which matches naturally with JavaScript objects.
4. **Ecosystem & Performance:** Node.js and Express handle non-blocking asynchronous I/O efficiently for RESTful APIs.

---

### Q3: How is user authentication implemented in SkillBridge?
**Answer:**  
Authentication is implemented using **JSON Web Tokens (JWT)** and **bcryptjs**:
1. When a student registers or logs in, their password is verified against a hashed version stored in MongoDB using `bcrypt.compare()`.
2. Upon successful authentication, the backend signs a JWT containing the user's ID using a secure `JWT_SECRET` key and an expiration time (e.g., 30 days).
3. The frontend stores this token in `localStorage`.
4. An Axios request interceptor attaches the token as a `Bearer` token in the `Authorization` header of all subsequent API requests.
5. A backend middleware (`authMiddleware.js`) intercepts protected routes, verifies the token's cryptographic signature using `jwt.verify()`, and attaches the authenticated user document to `req.user`.

---

### Q4: Why shouldn't passwords be stored as plain text in the database?
**Answer:**  
Storing plain text passwords is a critical security vulnerability. If the database is compromised, attacker access would immediately expose all user credentials.  
In SkillBridge, passwords are encrypted using a one-way mathematical hashing algorithm (`bcryptjs`) with a salt factor of 10. Salting adds random data to the password before hashing, preventing Rainbow Table dictionary attacks. Because hashing is one-way, even database administrators cannot view the original password.

---

### Q5: What is the difference between SQL and NoSQL databases, and why did you select MongoDB?
**Answer:**  
- **SQL Databases** (e.g., MySQL, PostgreSQL) are relational, table-based, and enforce strict, rigid schemas with ACID transactions across tables.
- **NoSQL Databases** (e.g., MongoDB) are document-oriented, schema-flexible, and store data in BSON (Binary JSON) format.  
I selected MongoDB because:
1. Project data (such as nested arrays of required skills and embedded team member objects) is hierarchical and maps directly to JSON objects.
2. Mongoose provides schema validation on top of MongoDB, giving both structure and flexibility.
3. It scales horizontally and integrates seamlessly with Node.js.

---

### Q6: How does Mongoose ODM help in this application?
**Answer:**  
Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides:
1. **Schema Definition:** Defines strict data types, required constraints, and default values for `User`, `Project`, and `CollaborationRequest`.
2. **Middleware Hooks:** Pre-save hooks automatically hash passwords before saving (`userSchema.pre('save')`) and update timestamps (`updatedAt`).
3. **Validation:** Built-in and custom validators (e.g., ensuring project description is at least 20 characters and team size is between 2 and 20).
4. **Population:** The `.populate()` method replaces stored ObjectIds with actual referenced documents from other collections (e.g., populating `createdBy` and `members.user`).

---

### Q7: Explain the database relationship between Users, Projects, and Collaboration Requests.
**Answer:**  
1. **User to Project (One-to-Many & Many-to-Many):**
   - A User can create multiple Projects (`createdBy` references `User._id`).
   - A Project contains multiple team members stored as an array of subdocuments containing `user` (ref: `User`), `role`, and `joinedAt`.
2. **Project to CollaborationRequest (One-to-Many):**
   - Multiple collaboration requests can be sent for a single project (`projectId` references `Project._id`).
3. **User to CollaborationRequest:**
   - Each request has a `senderId` (the student applying) and a `receiverId` (the project owner).

---

### Q8: What prevents a student from submitting duplicate join requests to the same project?
**Answer:**  
In `requestController.js`, before creating a new request, the backend queries the `CollaborationRequest` collection:
```javascript
const existingRequest = await CollaborationRequest.findOne({
  projectId,
  senderId: userId,
  status: { $in: ['Pending', 'Accepted'] }
});
```
If an existing request is found with status `Pending` or `Accepted`, the API immediately returns HTTP status `400 Bad Request` with a descriptive error message.

---

### Q9: What happens when a project creator accepts a collaboration request?
**Answer:**  
When the creator clicks "Accept":
1. The backend verifies that the requester is indeed the project owner (`request.receiverId.toString() === req.user._id.toString()`).
2. It verifies the team capacity has not already been reached (`project.members.length < project.teamSize`).
3. The sender's ID is appended to the `project.members` array with the role of `"Collaborator"`.
4. If the new member count reaches `project.teamSize`, the project status is automatically updated to `"Team Complete"`.
5. The request's status is changed from `"Pending"` to `"Accepted"`.
6. Both the updated project and request are saved atomically.

---

### Q10: How do Protected Routes work in React?
**Answer:**  
In `ProtectedRoute.jsx`, the component accesses the authentication state (`isAuthenticated` and `loading`) from `AuthContext`:
- If `loading` is true, it displays a loading spinner while checking the session.
- If `isAuthenticated` is false, it uses React Router's `<Navigate to="/login" replace state={{ from: location }} />` to redirect the user to the login page while preserving their intended destination.
- If authenticated, it renders the child component (e.g., `<DashboardPage />` or `<CreateProjectPage />`).

---

### Q11: What is the purpose of Axios Interceptors in your frontend?
**Answer:**  
Axios interceptors let us intercept HTTP requests or responses before they are handled:
1. **Request Interceptor:** Automatically reads the JWT from `localStorage` and adds `Authorization: Bearer <token>` to every outgoing request so individual component API calls do not need to manually pass headers.
2. **Response Interceptor:** Intercepts `401 Unauthorized` responses. If a token expires or becomes invalid, it clears `localStorage` to ensure client state consistency.

---

### Q12: How does client-side search and filtering work on the Explore page?
**Answer:**  
The Explore page supports multi-parameter filtering using query parameters sent to `GET /api/projects`:
- `search`: Matches against project `title`, `description`, or `requiredSkills` using case-insensitive regular expressions (`$regex`, `'i'`).
- `category`: Matches projects by exact domain (e.g., `AI / Machine Learning`).
- `collaborationType`: Filters by `Online`, `Offline`, or `Hybrid`.
- `status`: Filters by recruitment state (e.g., `Looking for Team Members`).
- `sort`: Orders results using Mongoose `.sort({ createdAt: -1 })` for newest or `.sort({ createdAt: 1 })` for oldest.

---

### Q13: What is CORS and how did you configure it?
**Answer:**  
**CORS** stands for **Cross-Origin Resource Sharing**. Browsers enforce the Same-Origin Policy, preventing a frontend running on `http://localhost:5173` from making requests to a backend on `http://localhost:5000` unless the backend explicitly authorizes it.  
In SkillBridge:
1. In development, Vite provides a local reverse proxy (`/api -> http://localhost:5000`), avoiding cross-origin requests.
2. In production, the Express backend uses the `cors` middleware configured with `origin: process.env.CLIENT_URL || '*'`.

---

### Q14: How are errors handled throughout the application?
**Answer:**  
SkillBridge implements multi-layered error handling:
1. **Client-Side:** Forms validate required fields, email formatting, and password lengths before dispatching requests, showing inline error messages.
2. **Server-Side (`errorMiddleware.js`):**
   - Catches unhandled routes with a `notFound` 404 handler.
   - A centralized `errorHandler` translates Mongoose `ValidationError`, `CastError` (invalid ObjectId), and duplicate key code `11000` into clean, human-readable JSON error responses.

---

### Q15: What React hooks are used in this project and why?
**Answer:**  
- `useState`: For local component state (form inputs, modal visibility, filter parameters).
- `useEffect`: For lifecycle side-effects (fetching project data on mount or when filters change).
- `useContext`: For consuming global authentication state (`useAuth()`) without prop drilling.
- `useNavigate`: For programmatic page transitions (e.g., redirecting to dashboard after login).
- `useLocation` & `useSearchParams`: For reading URL query parameters and redirect states.

---

### Q16: How did you ensure the project is responsive across mobile, tablet, and desktop?
**Answer:**  
Responsiveness is achieved through:
1. CSS Grid layouts with `repeat(auto-fit, minmax(280px, 1fr))` for fluid card grids.
2. Mobile navigation drawer with hamburger toggle button visible on screens narrower than `768px`.
3. Flexible containers with `max-width: 1240px` and responsive padding.
4. Relative typography using `clamp()` for smooth title scaling across screen sizes.

---

### Q17: What is the significance of the seed script (`seed.js`)?
**Answer:**  
In real-world development and academic presentations, starting with an empty database makes evaluating the application difficult.  
The `seed.js` script populates realistic sample data:
- 4 student profiles with varied skills and branches.
- 6 realistic college projects (e.g., Plant Disease Detection, Campus Lost & Found, Smart Expense Tracker).
- Existing team memberships and sample collaboration requests.
This guarantees that evaluators can test filtering, searching, and request handling immediately.

---

### Q18: What is the difference between stateless and stateful authentication?
**Answer:**  
- **Stateful Authentication (Sessions):** The server creates a session record in memory or a database for each logged-in user and sends back a Session ID cookie. For every request, the server must query its session store.
- **Stateless Authentication (JWT):** The server issues a cryptographically signed token containing user claims. The server does not store the token; it simply verifies the signature using its secret key on each request.  
SkillBridge uses stateless JWT authentication, which improves scalability and simplifies deployment across distributed cloud hosts.

---

### Q19: If an unauthorized user tries to delete another student's project, how does your backend stop them?
**Answer:**  
In `projectController.js`:
```javascript
const project = await Project.findById(req.params.id);
if (project.createdBy.toString() !== req.user._id.toString()) {
  return res.status(403).json({
    success: false,
    message: 'Unauthorized: You can only delete projects you created.',
  });
}
```
The backend explicitly compares the project's creator ID against the authenticated student's ID extracted from the verified JWT. If they do not match, it returns HTTP 403 Forbidden.

---

### Q20: How can this application be deployed to production?
**Answer:**  
The application is architected for modern cloud deployment:
1. **Frontend:** Deployed to **Vercel** with the command `npm run build`, outputting to the `dist` folder.
2. **Backend:** Deployed to **Render** as a Node.js web service running `node server.js`.
3. **Database:** Hosted on **MongoDB Atlas** (cloud cluster) with network access granted via whitelisted IPs.
4. Connection between frontend and backend is configured using the environment variable `VITE_API_BASE_URL`.
