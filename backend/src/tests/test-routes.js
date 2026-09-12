/**
 * Comprehensive API Route Testing Suite for SafeAR Jharkhand Backend
 * Complete Checklist:
 * 
 * SERVER
 * [x] GET /
 * 
 * MODULES
 * [x] GET /api/modules
 * [x] GET /api/modules/FIRE_01
 * [x] GET /api/modules/GAS_01
 * 
 * AUTH
 * [x] POST /api/auth/register
 * [x] POST /api/auth/login
 * [x] GET /api/auth/me
 * [x] /me without token -> 401
 * 
 * TRAINING
 * [x] POST /api/training/result
 * [x] GET /api/training/history
 * 
 * CERTIFICATE
 * [x] POST /api/certificates
 * [x] GET /api/certificates/verify/:id
 * [x] SHA-256 hash exists
 * 
 * ADMIN
 * [x] GET /api/admin/dashboard
 * [x] GET /api/admin/workers
 * [x] GET /api/admin/results
 * [x] Worker accessing admin -> 403
 */

import { server } from "../server.js";
import sql from "../config/db.js";

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

let passedTests = 0;
let failedTests = 0;
const report = [];

function recordResult(category, item, passed, details = null) {
  if (passed) {
    passedTests++;
    console.log(`  ✅ [PASS] ${item}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${item}`);
    if (details) console.error(`     Error details:`, details);
  }
  report.push({ category, item, passed, details });
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

async function runAllTests() {
  console.log("\n" + "=".repeat(70));
  console.log("🚀 EXECUTING COMPLETE ENDPOINT CHECKLIST SUITE");
  console.log(`Host: ${BASE_URL}`);
  console.log("=".repeat(70) + "\n");

  const timestamp = Date.now();
  const workerEmail = `worker_${timestamp}@jharkhand-mines.gov.in`;
  const adminEmail = `admin_${timestamp}@jharkhand-mines.gov.in`;
  const password = "Password@Safe2026";

  let workerToken = null;
  let adminToken = null;
  let workerUserId = null;
  let fireModuleId = null;
  let generatedCertId = null;

  try {
    // =============================================================
    // 1. SERVER
    // =============================================================
    console.log("📂 [SERVER]");
    const serverRes = await request("/");
    recordResult(
      "SERVER",
      "GET /",
      serverRes.status === 200 && serverRes.body?.status === "success",
      serverRes.body
    );

    // =============================================================
    // 2. MODULES
    // =============================================================
    console.log("\n📂 [MODULES]");
    
    // GET /api/modules
    const modulesRes = await request("/api/modules");
    const hasModules = modulesRes.status === 200 && Array.isArray(modulesRes.body?.modules) && modulesRes.body.modules.length > 0;
    recordResult("MODULES", "GET /api/modules", hasModules, { count: modulesRes.body?.modules?.length });

    // GET /api/modules/FIRE_01
    const fireRes = await request("/api/modules/FIRE_01");
    const firePassed = fireRes.status === 200 && fireRes.body?.module?.code === "FIRE_01";
    if (firePassed) {
      fireModuleId = fireRes.body.module.id;
    }
    recordResult("MODULES", "GET /api/modules/FIRE_01", firePassed, fireRes.body);

    // GET /api/modules/GAS_01
    const gasRes = await request("/api/modules/GAS_01");
    const gasPassed = gasRes.status === 200 && gasRes.body?.module?.code === "GAS_01";
    recordResult("MODULES", "GET /api/modules/GAS_01", gasPassed, gasRes.body);

    // =============================================================
    // 3. AUTH
    // =============================================================
    console.log("\n📂 [AUTH]");

    // POST /api/auth/register (worker)
    const regRes = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: `Ramesh Soren ${timestamp.toString().slice(-4)}`,
        email: workerEmail,
        password: password,
      }),
    });
    const regPassed = regRes.status === 201 && regRes.body?.user?.email === workerEmail;
    if (regPassed) {
      workerUserId = regRes.body.user.id;
    }
    recordResult("AUTH", "POST /api/auth/register", regPassed, regRes.body);

    // POST /api/auth/login
    const loginRes = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: workerEmail,
        password: password,
      }),
    });
    const loginPassed = loginRes.status === 200 && Boolean(loginRes.body?.token);
    if (loginPassed) {
      workerToken = loginRes.body.token;
    }
    recordResult("AUTH", "POST /api/auth/login", loginPassed, { tokenLength: workerToken?.length });

    // GET /api/auth/me
    const meRes = await request("/api/auth/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${workerToken}` },
    });
    const mePassed = meRes.status === 200 && meRes.body?.user?.email === workerEmail;
    recordResult("AUTH", "GET /api/auth/me", mePassed, meRes.body);

    // /me without token → 401
    const meNoTokenRes = await request("/api/auth/me");
    const meNoTokenPassed = meNoTokenRes.status === 401 && meNoTokenRes.body?.success === false;
    recordResult("AUTH", "/me without token → 401", meNoTokenPassed, meNoTokenRes.body);

    // =============================================================
    // 4. TRAINING
    // =============================================================
    console.log("\n📂 [TRAINING]");

    // POST /api/training/result
    const trainingResultRes = await request("/api/training/result", {
      method: "POST",
      headers: { Authorization: `Bearer ${workerToken}` },
      body: JSON.stringify({
        moduleId: fireModuleId || 1,
        score: 95,
        duration: 350,
        correctActions: 9,
        wrongActions: 0,
        safetyViolations: 0,
        status: "passed",
      }),
    });
    const trainingPassed = trainingResultRes.status === 201 && trainingResultRes.body?.result?.score === 95;
    recordResult("TRAINING", "POST /api/training/result", trainingPassed, trainingResultRes.body);

    // GET /api/training/history
    const historyRes = await request("/api/training/history", {
      method: "GET",
      headers: { Authorization: `Bearer ${workerToken}` },
    });
    const historyPassed = historyRes.status === 200 && Array.isArray(historyRes.body?.history) && historyRes.body.history.length > 0;
    recordResult("TRAINING", "GET /api/training/history", historyPassed, { count: historyRes.body?.history?.length });

    // =============================================================
    // 5. CERTIFICATE
    // =============================================================
    console.log("\n📂 [CERTIFICATE]");

    // POST /api/certificates
    const certRes = await request("/api/certificates", {
      method: "POST",
      headers: { Authorization: `Bearer ${workerToken}` },
      body: JSON.stringify({
        moduleId: fireModuleId || 1,
      }),
    });
    const certPassed = (certRes.status === 201 || certRes.status === 200) && Boolean(certRes.body?.certificate);
    if (certPassed) {
      generatedCertId = certRes.body.certificate.certificate_id;
    }
    recordResult("CERTIFICATE", "POST /api/certificates", certPassed, certRes.body);

    // GET /api/certificates/verify/:id
    const verifyRes = await request(`/api/certificates/verify/${generatedCertId}`);
    const verifyPassed = verifyRes.status === 200 && verifyRes.body?.certificate?.certificate_id === generatedCertId;
    recordResult("CERTIFICATE", "GET /api/certificates/verify/:id", verifyPassed, verifyRes.body);

    // SHA-256 hash exists
    const certHash = verifyRes.body?.certificate?.verification_hash;
    const sha256Valid = typeof certHash === "string" && certHash.length === 64 && /^[a-f0-9]+$/i.test(certHash);
    recordResult("CERTIFICATE", "SHA-256 hash exists", sha256Valid, { hash: certHash });

    // =============================================================
    // 6. ADMIN
    // =============================================================
    console.log("\n📂 [ADMIN]");

    // Register admin user directly
    const adminRegRes = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Admin Inspector",
        email: adminEmail,
        password: password,
      }),
    });
    if (adminRegRes.status === 201) {
      // Elevate to admin role in database
      await sql`UPDATE users SET role = 'admin' WHERE id = ${adminRegRes.body.user.id}`;
      // Login as admin to get token with role = 'admin'
      const adminLoginRes = await request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: adminEmail,
          password: password,
        }),
      });
      adminToken = adminLoginRes.body?.token;
    }

    // GET /api/admin/dashboard
    const adminDashRes = await request("/api/admin/dashboard", {
      method: "GET",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminDashPassed = adminDashRes.status === 200 && Boolean(adminDashRes.body?.dashboard);
    recordResult("ADMIN", "GET /api/admin/dashboard", adminDashPassed, adminDashRes.body?.dashboard);

    // GET /api/admin/workers
    const adminWorkersRes = await request("/api/admin/workers", {
      method: "GET",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminWorkersPassed = adminWorkersRes.status === 200 && Array.isArray(adminWorkersRes.body?.workers);
    recordResult("ADMIN", "GET /api/admin/workers", adminWorkersPassed, { count: adminWorkersRes.body?.workers?.length });

    // GET /api/admin/results
    const adminResultsRes = await request("/api/admin/results", {
      method: "GET",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminResultsPassed = adminResultsRes.status === 200 && Array.isArray(adminResultsRes.body?.results);
    recordResult("ADMIN", "GET /api/admin/results", adminResultsPassed, { count: adminResultsRes.body?.results?.length });

    // Worker accessing admin → 403
    const workerForbiddenRes = await request("/api/admin/dashboard", {
      method: "GET",
      headers: { Authorization: `Bearer ${workerToken}` },
    });
    const forbiddenPassed = workerForbiddenRes.status === 403 && workerForbiddenRes.body?.success === false;
    recordResult("ADMIN", "Worker accessing admin → 403", forbiddenPassed, workerForbiddenRes.body);

  } catch (error) {
    console.error("Critical test execution error:", error);
    failedTests++;
  } finally {
    console.log("\n" + "=".repeat(70));
    console.log(`📊 FINAL RESULTS: ${passedTests} PASSED, ${failedTests} FAILED (TOTAL: ${passedTests + failedTests})`);
    console.log("=".repeat(70) + "\n");

    if (server) {
      server.close(() => process.exit(failedTests > 0 ? 1 : 0));
    } else {
      process.exit(failedTests > 0 ? 1 : 0);
    }
  }
}

setTimeout(runAllTests, 600);
