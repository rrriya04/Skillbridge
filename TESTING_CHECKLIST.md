# SkillBridge – Comprehensive Testing Checklist

This checklist covers all manual and automated testing requirements to ensure complete functionality before presentation and submission.

---

## 1. Automated Test Suite Verification

Run the automated test runner in the `server` directory:
```bash
cd server
npm test
```

### Automated Test Matrix:
- [x] **API Health:** `GET /api/health` returns `200 OK`
- [x] **Registration Validation:** Rejects missing fields, invalid email format, and short passwords
- [x] **Duplicate Registration Prevention:** Rejects duplicate email with HTTP `400`
- [x] **Login Rejection:** Rejects invalid credentials with HTTP `401`
- [x] **Valid Login:** Generates and returns valid JWT token and student object
- [x] **Protected Route Verification:** `GET /api/auth/me` verifies `Bearer` token
- [x] **Project Validation:** Rejects projects with description < 20 characters or missing skills
- [x] **Project Creation:** Saves project and automatically assigns creator as `Project Lead`
- [x] **Public Exploration:** `GET /api/projects` lists all active projects
- [x] **Search & Filter:** Accurately filters by keyword and category
- [x] **Project Details Query:** `GET /api/projects/:id` populates members and creator
- [x] **Unauthorized Edit Block:** HTTP `403` returned when non-creator attempts project edit
- [x] **Authorized Edit:** Creator can update project duration and fields
- [x] **Self-Join Block:** Creator cannot send collaboration request to their own project
- [x] **Collaboration Request Creation:** Saves join proposal with HTTP `201`
- [x] **Duplicate Request Block:** Rejects second request from same student
- [x] **Received Requests Query:** Owner can view applicant profile, skills, and pitch
- [x] **Sent Requests Query:** Student can track their outgoing applications
- [x] **Request Acceptance:** Updates request status to `Accepted`
- [x] **Team Roster Synchronization:** Adds applicant to project team members array
- [x] **Project Deletion:** Creator can delete project and cascade-remove associated requests

---

## 2. Manual User Interface Testing Checklist

### A. Authentication & Session Flow
- [ ] Open `http://localhost:5173/` in browser; verify landing page renders with hero and stats.
- [ ] Navigate to `/register`; attempt submitting empty form; verify validation error messages appear under all fields.
- [ ] Enter mismatched passwords; verify error: *"Passwords do not match"*.
- [ ] Enter a valid registration; verify automatic redirection to `/dashboard`.
- [ ] Log out; verify localStorage items (`skillbridge_token` and `skillbridge_user`) are cleared.
- [ ] Navigate to `/login`; use the **Quick Demo Accounts** buttons to test autofill; verify one-click login works.
- [ ] Toggle password visibility icon (eye/eye-off); verify password characters show/hide.

### B. Explore Projects & Search
- [ ] Navigate to `/explore`.
- [ ] Type `"Plant"` in the search bar and click Search; verify only the *Plant Disease Detection* project appears.
- [ ] Click the `X` clear button in the search bar; verify full list restores.
- [ ] Filter by Domain: Select *"AI / Machine Learning"*; verify only AI projects appear.
- [ ] Filter by Collaboration: Select *"Online"*; verify only online projects appear.
- [ ] Click **Reset All** filters button; verify all filter selectors and query reset to default.

### C. Post a Project Flow
- [ ] Click **Post Project** in Navbar.
- [ ] Type skill name `"React"` and press Enter or click **Add**; verify `#React` badge appears.
- [ ] Click the `x` on a skill badge; verify it removes the tag.
- [ ] Fill all required fields and submit; verify notification banner and redirection to the new project's details page.
- [ ] Verify the creator is displayed in the team roster as **Project Lead**.

### D. Collaboration Request & Acceptance
- [ ] Log in as **Aarav Sharma**.
- [ ] Open Priya Patel's project (*AI-Based Plant Disease Detection System*).
- [ ] Click **Request to Join Team**; type a message in the modal and submit.
- [ ] Verify the button immediately updates to show **Request Pending** with a clock icon.
- [ ] Attempt clicking again; verify duplicate request cannot be sent.
- [ ] Log out, and log in as **Priya Patel**.
- [ ] Open `/requests` -> **Received Requests** tab.
- [ ] Verify Aarav's name, college, year, skills badges, and pitch message are visible.
- [ ] Click **Accept & Add to Team**; verify success toast.
- [ ] Navigate to the project details page; verify Aarav is now listed in the **Current Team Members** roster.

### E. Profile & Edit Profile
- [ ] Click user avatar in top-right navbar -> **View Profile**.
- [ ] Verify name, college, department, year, bio, skills, and links display accurately.
- [ ] Click **Edit Profile**; add a new skill tag (e.g., `#GraphQL`) and update bio.
- [ ] Save changes; verify user is returned to `/profile` with updated skills and bio.
- [ ] Verify name and avatar in top-right navbar update synchronously.

### F. Responsiveness & Cross-Device UI
- [ ] Open Developer Tools (F12) and toggle Mobile Device Toolbar (iPhone / iPad screen widths).
- [ ] Verify hamburger menu toggle appears on screens < 768px.
- [ ] Click hamburger menu; verify mobile drawer opens with clean links and actions.
- [ ] Verify project cards adapt to single-column layout on mobile screens without overflow.
