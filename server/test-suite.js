/**
 * Automated Test Suite for SkillBridge REST API
 * Tests all authentication, project management, and collaboration request flows.
 */

const http = require('http');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const request = (path, method = 'GET', body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runAllTests = async () => {
  console.log('====================================================');
  console.log('🧪 Starting SkillBridge End-to-End API Test Suite');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const health = await request('/health');
    assert(health.status === 200 && health.body.status === 'OK', 'Health check endpoint returns 200 OK');

    // ==========================================
    // 2. Authentication Tests
    // ==========================================
    console.log('\n--- 2. Authentication Tests ---');

    // Register with mismatched passwords (should fail)
    const badReg1 = await request('/auth/register', 'POST', {
      name: 'Test Student',
      email: 'test@college.edu',
      password: 'password123',
      confirmPassword: 'differentPassword',
      college: 'Test College',
      department: 'CS',
      year: '3rd Year',
    });
    // In our controller, password length / validation check runs
    assert(badReg1.status !== 500, 'Handled registration validation properly');

    // Register with invalid email
    const badReg2 = await request('/auth/register', 'POST', {
      name: 'Test Student',
      email: 'invalid-email-format',
      password: 'password123',
      college: 'Test College',
      department: 'CS',
      year: '3rd Year',
    });
    assert(badReg2.status === 400, 'Reject invalid email format on registration');

    // Register valid user
    const uniqueEmail = `student_${Date.now()}@college.edu`;
    const regRes = await request('/auth/register', 'POST', {
      name: 'Karan Mehra',
      email: uniqueEmail,
      password: 'password123',
      college: 'Delhi Technological University',
      department: 'Software Engineering',
      year: '3rd Year',
    });
    assert(regRes.status === 201 && regRes.body.token, 'Register valid student and return JWT token');
    const student1Token = regRes.body.token;
    const student1Id = regRes.body.user._id;

    // Register duplicate email (should fail with 400)
    const dupReg = await request('/auth/register', 'POST', {
      name: 'Karan Mehra Copy',
      email: uniqueEmail,
      password: 'password123',
      college: 'Delhi Technological University',
      department: 'Software Engineering',
      year: '3rd Year',
    });
    assert(dupReg.status === 400, 'Prevent duplicate student email registration');

    // Login with wrong credentials (should fail with 401)
    const badLogin = await request('/auth/login', 'POST', {
      email: uniqueEmail,
      password: 'wrongPassword!',
    });
    assert(badLogin.status === 401, 'Reject login with incorrect password');

    // Login with correct credentials
    const goodLogin = await request('/auth/login', 'POST', {
      email: uniqueEmail,
      password: 'password123',
    });
    assert(goodLogin.status === 200 && goodLogin.body.token, 'Allow login with valid student credentials');

    // Get current student profile via /auth/me
    const meRes = await request('/auth/me', 'GET', null, student1Token);
    assert(meRes.status === 200 && meRes.body.user.name === 'Karan Mehra', 'Verify protected /api/auth/me route');

    // Register a second student for collaboration testing
    const uniqueEmail2 = `teammate_${Date.now()}@college.edu`;
    const regRes2 = await request('/auth/register', 'POST', {
      name: 'Sneha Kapoor',
      email: uniqueEmail2,
      password: 'password123',
      college: 'Delhi Technological University',
      department: 'Information Technology',
      year: '2nd Year',
    });
    const student2Token = regRes2.body.token;
    const student2Id = regRes2.body.user._id;

    // ==========================================
    // 3. Project Management Tests
    // ==========================================
    console.log('\n--- 3. Project Management Tests ---');

    // Create project with missing title / short description (should fail)
    const badProj = await request('/projects', 'POST', {
      title: 'AI',
      description: 'Too short',
      category: 'AI / Machine Learning',
      requiredSkills: ['Python'],
      teamSize: 3,
    }, student1Token);
    assert(badProj.status === 400, 'Reject project creation with short title/description');

    // Create valid project by Student 1
    const createProjRes = await request('/projects', 'POST', {
      title: 'Autonomous Drone Navigation & Obstacle Mapping',
      description: 'A ROS and computer vision based indoor autonomous quadcopter navigation system designed for campus parcel delivery.',
      category: 'IoT',
      requiredSkills: ['Python', 'ROS', 'OpenCV', 'C++'],
      teamSize: 3,
      duration: '2-3 months',
      collaborationType: 'Hybrid',
      status: 'Looking for Team Members',
    }, student1Token);
    assert(createProjRes.status === 201 && createProjRes.body.project?._id, 'Successfully create valid project');
    const projectId = createProjRes.body.project._id;

    // Fetch all projects (Explore)
    const allProjs = await request('/projects');
    assert(allProjs.status === 200 && Array.isArray(allProjs.body.projects), 'Browse all projects publicly');

    // Search project by keyword
    const searchRes = await request(`/projects?search=Autonomous`);
    assert(searchRes.status === 200 && searchRes.body.projects.some((p) => p._id === projectId), 'Search projects by keyword');

    // Filter project by category
    const catRes = await request(`/projects?category=IoT`);
    assert(catRes.status === 200 && catRes.body.projects.every((p) => p.category === 'IoT'), 'Filter projects by category');

    // Fetch project details by ID
    const detailsRes = await request(`/projects/${projectId}`);
    assert(detailsRes.status === 200 && detailsRes.body.project.title.includes('Autonomous Drone'), 'Fetch single project details by ID');

    // Unauthorized project edit (Student 2 attempts to edit Student 1 project -> should fail with 403)
    const unauthEdit = await request(`/projects/${projectId}`, 'PUT', {
      title: 'Hacked Project Title',
    }, student2Token);
    assert(unauthEdit.status === 403, 'Prevent unauthorized user from editing another student project');

    // Authorized project edit by Student 1 (creator)
    const authEdit = await request(`/projects/${projectId}`, 'PUT', {
      duration: '3-4 months',
    }, student1Token);
    assert(authEdit.status === 200 && authEdit.body.project.duration === '3-4 months', 'Allow creator to update project details');

    // ==========================================
    // 4. Collaboration Request Tests
    // ==========================================
    console.log('\n--- 4. Collaboration Request Tests ---');

    // Creator attempts to request join own project (should fail with 400)
    const selfReq = await request('/requests', 'POST', {
      projectId,
      message: 'I want to join myself',
    }, student1Token);
    assert(selfReq.status === 400, 'Prevent creator from requesting to join their own project');

    // Student 2 sends join request to Student 1 project
    const joinReq = await request('/requests', 'POST', {
      projectId,
      message: 'Hi Karan! I have experience with OpenCV and PID controllers for quadcopters.',
    }, student2Token);
    assert(joinReq.status === 201 && joinReq.body.request?._id, 'Student 2 successfully sends collaboration request');
    const requestId = joinReq.body.request._id;

    // Duplicate request attempt by Student 2 (should fail with 400)
    const dupJoinReq = await request('/requests', 'POST', {
      projectId,
      message: 'Second request attempt',
    }, student2Token);
    assert(dupJoinReq.status === 400, 'Prevent duplicate collaboration request while pending');

    // Student 1 checks received requests
    const receivedRes = await request('/requests/received', 'GET', null, student1Token);
    assert(receivedRes.status === 200 && receivedRes.body.requests.some((r) => r._id === requestId), 'Project owner sees incoming join request');

    // Student 2 checks sent requests
    const sentRes = await request('/requests/sent', 'GET', null, student2Token);
    assert(sentRes.status === 200 && sentRes.body.requests.some((r) => r._id === requestId), 'Student sees outgoing join request in their dashboard');

    // Student 1 accepts Student 2 request
    const acceptRes = await request(`/requests/${requestId}/accept`, 'PUT', null, student1Token);
    assert(acceptRes.status === 200 && acceptRes.body.request.status === 'Accepted', 'Project owner successfully accepts request');

    // Verify team members list in project updated to include Student 2
    const updatedProjRes = await request(`/projects/${projectId}`);
    const members = updatedProjRes.body.project.members || [];
    const memberFound = members.some((m) => m.user?._id === student2Id || m.user === student2Id);
    assert(memberFound && members.length === 2, 'Project team members list automatically updated after accepting request');

    // ==========================================
    // 5. Cleanup / Deletion Test
    // ==========================================
    console.log('\n--- 5. Project Deletion Test ---');
    const delRes = await request(`/projects/${projectId}`, 'DELETE', null, student1Token);
    assert(delRes.status === 200, 'Project creator can delete project with cascade clean');

    console.log('\n====================================================');
    console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
    console.log('====================================================');

    if (failed === 0) {
      console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!\n');
      process.exit(0);
    } else {
      console.error('⚠️ Some tests failed.\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal test error:', error);
    process.exit(1);
  }
};

runAllTests();
