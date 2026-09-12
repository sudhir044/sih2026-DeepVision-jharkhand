/**
 * Comprehensive API Route Testing Suite for DeepVision Jharkhand Backend
 * Routes tested:
 *  - POST /api/auth/register
 *  - POST /api/auth/login
 *  - GET  /api/auth/me (Protected)
 *  - GET  /api/modules
 *  - GET  /api/modules/:id
 *  - POST /api/training/result (Protected 🔒)
 */

import { server } from "../server.js";

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

// Helper test reporter
let passedTests = 0;
let failedTests = 0;
const results = [];

function recordResult(route, testName, passed, details) {
  if (passed) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${testName}`);
    if (details) console.error(`     Details:`, details);
  }
  results.push({ route, testName, passed, details });
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const start = Date.now();
  const res = await fetch(url, {
    ...options,
    headers,
  });
  const duration = Date.now() - start;
  let body;
  try {
    body = await res.json();
  } catch (err) {
    body = null;
  }
  return { status: res.status, body, duration };
}

async function runTests() {
  console.log("\n" + "=".repeat(65));
  console.log("🚀 STARTING API ROUTE VERIFICATION SUITE");
  console.log(`Target: ${BASE_URL}`);
  console.log("=".repeat(65) + "\n");

  const timestamp = Date.now();
  const testEmail = `miner_${timestamp}@jharkhand-mines.org`;
  const testPassword = "Password@Safe2026";
  const testName = `Ramesh Soren ${timestamp.toString().slice(-4)}`;
  let authToken = null;
  let createdUserId = null;
  let targetModuleId = null;

  try {
    // -------------------------------------------------------------
    // 1. POST /api/auth/register
    // -------------------------------------------------------------
    console.log("📌 1. Testing POST /api/auth/register");

    // 1.1 Success case
    const regRes = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword,
      }),
    });

    const regSuccess =
      regRes.status === 201 &&
      regRes.body?.success === true &&
      regRes.body?.user?.email === testEmail;
    
    if (regSuccess) {
      createdUserId = regRes.body.user.id;
    }

    recordResult(
      "POST /api/auth/register",
      "Register new worker user (201 Created)",
      regSuccess,
      regRes.body
    );

    // 1.2 Duplicate email conflict (409 Conflict)
    const dupRes = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword,
      }),
    });
    recordResult(
      "POST /api/auth/register",
      "Prevent duplicate registration (409 Conflict)",
      dupRes.status === 409 && dupRes.body?.success === false,
      dupRes.body
    );

    // 1.3 Validation error: missing password (400 Bad Request)
    const missingFieldRes = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Incomplete User",
        email: "incomplete@test.com",
      }),
    });
    recordResult(
      "POST /api/auth/register",
      "Reject missing required fields (400 Bad Request)",
      missingFieldRes.status === 400 && missingFieldRes.body?.success === false,
      missingFieldRes.body
    );

    // -------------------------------------------------------------
    // 2. POST /api/auth/login
    // -------------------------------------------------------------
    console.log("\n📌 2. Testing POST /api/auth/login");

    // 2.1 Success login
    const loginRes = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    const loginSuccess =
      loginRes.status === 200 &&
      loginRes.body?.success === true &&
      Boolean(loginRes.body?.token);

    if (loginSuccess) {
      authToken = loginRes.body.token;
    }

    recordResult(
      "POST /api/auth/login",
      "Worker login with valid credentials (200 OK + JWT)",
      loginSuccess,
      { tokenReceived: Boolean(authToken), user: loginRes.body?.user }
    );

    // 2.2 Invalid password
    const wrongPassRes = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: testEmail,
        password: "IncorrectPassword123!",
      }),
    });
    recordResult(
      "POST /api/auth/login",
      "Reject invalid password (401 Unauthorized)",
      wrongPassRes.status === 401 && wrongPassRes.body?.success === false,
      wrongPassRes.body
    );

    // 2.3 Non-existent user
    const noUserRes = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: `nonexistent_${Date.now()}@unknown.org`,
        password: "anyPassword",
      }),
    });
    recordResult(
      "POST /api/auth/login",
      "Reject non-existent user (401 Unauthorized)",
      noUserRes.status === 401 && noUserRes.body?.success === false,
      noUserRes.body
    );

    // -------------------------------------------------------------
    // 3. GET /api/auth/me 🔒
    // -------------------------------------------------------------
    console.log("\n📌 3. Testing GET /api/auth/me 🔒");

    // 3.1 Authenticated request
    const meRes = await request("/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const meSuccess =
      meRes.status === 200 &&
      meRes.body?.success === true &&
      meRes.body?.user?.email === testEmail;

    recordResult(
      "GET /api/auth/me",
      "Fetch current authenticated user profile (200 OK)",
      meSuccess,
      meRes.body
    );

    // 3.2 Missing authorization header
    const meUnauthRes = await request("/api/auth/me", {
      method: "GET",
    });
    recordResult(
      "GET /api/auth/me",
      "Reject unauthenticated request without token (401 Unauthorized)",
      meUnauthRes.status === 401 && meUnauthRes.body?.success === false,
      meUnauthRes.body
    );

    // 3.3 Invalid token
    const meBadTokenRes = await request("/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: "Bearer invalid.jwt.token",
      },
    });
    recordResult(
      "GET /api/auth/me",
      "Reject request with invalid token (401 Unauthorized)",
      meBadTokenRes.status === 401 && meBadTokenRes.body?.success === false,
      meBadTokenRes.body
    );

    // -------------------------------------------------------------
    // 4. GET /api/modules
    // -------------------------------------------------------------
    console.log("\n📌 4. Testing GET /api/modules");

    const modulesRes = await request("/api/modules", {
      method: "GET",
    });

    const modulesSuccess =
      modulesRes.status === 200 &&
      modulesRes.body?.success === true &&
      Array.isArray(modulesRes.body?.modules) &&
      modulesRes.body.modules.length > 0;

    if (modulesSuccess) {
      targetModuleId = modulesRes.body.modules[0].id;
    }

    recordResult(
      "GET /api/modules",
      "Retrieve all training modules (200 OK)",
      modulesSuccess,
      { count: modulesRes.body?.modules?.length, sample: modulesRes.body?.modules?.[0] }
    );

    // -------------------------------------------------------------
    // 5. GET /api/modules/:id
    // -------------------------------------------------------------
    console.log(`\n📌 5. Testing GET /api/modules/:id (id: ${targetModuleId})`);

    // 5.1 Existing module
    const singleModuleRes = await request(`/api/modules/${targetModuleId}`, {
      method: "GET",
    });

    const singleModuleSuccess =
      singleModuleRes.status === 200 &&
      singleModuleRes.body?.success === true &&
      singleModuleRes.body?.module?.id === targetModuleId;

    recordResult(
      "GET /api/modules/:id",
      `Retrieve training module by ID #${targetModuleId} (200 OK)`,
      singleModuleSuccess,
      singleModuleRes.body?.module
    );

    // 5.2 Non-existent module
    const notFoundModuleRes = await request("/api/modules/999999", {
      method: "GET",
    });

    recordResult(
      "GET /api/modules/:id",
      "Return 404 Not Found for non-existent module ID",
      notFoundModuleRes.status === 404 && notFoundModuleRes.body?.success === false,
      notFoundModuleRes.body
    );

    // -------------------------------------------------------------
    // 6. POST /api/training/result 🔒
    // -------------------------------------------------------------
    console.log("\n📌 6. Testing POST /api/training/result 🔒");

    // 6.1 Authorized submission
    const trainingPayload = {
      moduleId: targetModuleId,
      score: 92,
      duration: 380, // 380 seconds
      correctActions: 9,
      wrongActions: 1,
      safetyViolations: 0,
      status: "passed",
    };

    const submitRes = await request("/api/training/result", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(trainingPayload),
    });

    const submitSuccess =
      submitRes.status === 201 &&
      submitRes.body?.success === true &&
      submitRes.body?.result?.score === 92 &&
      submitRes.body?.result?.user_id === createdUserId;

    recordResult(
      "POST /api/training/result 🔒",
      "Save worker AR training simulation result (201 Created)",
      submitSuccess,
      submitRes.body
    );

    // 6.2 Missing token (401 Unauthorized)
    const unauthSubmitRes = await request("/api/training/result", {
      method: "POST",
      body: JSON.stringify(trainingPayload),
    });

    recordResult(
      "POST /api/training/result 🔒",
      "Reject result submission without auth token (401 Unauthorized)",
      unauthSubmitRes.status === 401 && unauthSubmitRes.body?.success === false,
      unauthSubmitRes.body
    );

    // 6.3 Missing required field (score/status) (400 Bad Request)
    const missingFieldSubmitRes = await request("/api/training/result", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        moduleId: targetModuleId,
        // missing score and status
      }),
    });

    recordResult(
      "POST /api/training/result 🔒",
      "Reject submission with missing required fields (400 Bad Request)",
      missingFieldSubmitRes.status === 400 && missingFieldSubmitRes.body?.success === false,
      missingFieldSubmitRes.body
    );

    // 6.4 Non-existent module ID (404 Not Found)
    const invalidModuleSubmitRes = await request("/api/training/result", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        moduleId: 999999,
        score: 80,
        status: "passed",
      }),
    });

    recordResult(
      "POST /api/training/result 🔒",
      "Reject result with non-existent module ID (404 Not Found)",
      invalidModuleSubmitRes.status === 404 && invalidModuleSubmitRes.body?.success === false,
      invalidModuleSubmitRes.body
    );

  } catch (error) {
    console.error("\n💥 Unexpected error during test run:", error);
    failedTests++;
  } finally {
    console.log("\n" + "=".repeat(65));
    console.log(`📊 TEST SUMMARY: Total: ${passedTests + failedTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
    console.log("=".repeat(65) + "\n");

    // Cleanly close server
    if (server) {
      server.close(() => {
        process.exit(failedTests > 0 ? 1 : 0);
      });
    } else {
      process.exit(failedTests > 0 ? 1 : 0);
    }
  }
}

// Give server time to listen
setTimeout(runTests, 500);
