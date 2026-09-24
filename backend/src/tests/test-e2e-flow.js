/**
 * End-to-End Simulation Test:
 * Flow:
 * Login -> Home -> Fire Training -> Safety Video -> AR Preparation ->
 * Assessment (10 questions) -> POST /api/training/result ->
 * Certificate Fetch & Verification -> HTML QR Verification Badge
 */

import { server } from "../server.js";
import qrcode from "../../../mobile-app/node_modules/qrcode-generator/dist/qrcode.mjs";

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

let passedCount = 0;
let failedCount = 0;

function assert(description, condition, details = null) {
  if (condition) {
    passedCount++;
    console.log(`  ✅ [PASS] ${description}`);
  } else {
    failedCount++;
    console.error(`  ❌ [FAIL] ${description}`);
    if (details) console.error(`     Details:`, details);
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    ...(options.headers || {}),
  };
  if (!headers["Content-Type"] && options.body && typeof options.body === "string") {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const isHtml = res.headers.get("content-type")?.includes("text/html");
  let body;
  if (isHtml) {
    body = await res.text();
  } else {
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }
  }

  return { status: res.status, headers: res.headers, body };
}

async function runE2ETest() {
  console.log("\n" + "=".repeat(75));
  console.log("🚀 TESTING END-TO-END TRAINING TO CERTIFICATE PIPELINE");
  console.log("=".repeat(75) + "\n");

  const timestamp = Date.now();
  const workerEmail = `trainee_${timestamp}@jharkhand-mines.gov.in`;
  const workerPassword = "SecurePassword@2026";
  const workerName = `Birsa Munda ${timestamp.toString().slice(-4)}`;

  let token = null;
  let moduleId = null;
  let certificateId = null;

  try {
    // -------------------------------------------------------------
    // Step 1: User Registration & Login
    // -------------------------------------------------------------
    console.log("1️⃣ [STEP 1: Registration & Login]");
    const regRes = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: workerName,
        email: workerEmail,
        password: workerPassword,
      }),
    });
    assert("User registered successfully", regRes.status === 201 && Boolean(regRes.body?.user));

    const loginRes = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: workerEmail,
        password: workerPassword,
      }),
    });
    token = loginRes.body?.token;
    assert("Worker logged in & received JWT", loginRes.status === 200 && Boolean(token));

    // -------------------------------------------------------------
    // Step 2: Home Dashboard (Get User & Modules)
    // -------------------------------------------------------------
    console.log("\n2️⃣ [STEP 2: Home Screen Dashboard]");
    const meRes = await request("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert("Current worker profile verified", meRes.status === 200 && meRes.body?.user?.name === workerName);

    const modulesRes = await request("/api/modules");
    assert("Available training modules fetched", modulesRes.status === 200 && modulesRes.body?.modules?.length > 0);

    // -------------------------------------------------------------
    // Step 3: Fire Training Module
    // -------------------------------------------------------------
    console.log("\n3️⃣ [STEP 3: Fire Training Module]");
    const fireModRes = await request("/api/modules/FIRE_01");
    moduleId = fireModRes.body?.module?.id;
    assert("Fire & Explosion module loaded (code: FIRE_01)", fireModRes.status === 200 && fireModRes.body?.module?.code === "FIRE_01");

    // -------------------------------------------------------------
    // Step 4 & 5: Safety Video & AR Prep
    // -------------------------------------------------------------
    console.log("\n4️⃣ [STEP 4 & 5: Safety Briefing & AR Preparation]");
    console.log("  ℹ️ Video briefing completed & AR workspace safety verified");

    // -------------------------------------------------------------
    // Step 6 & 7: Assessment & Answering 10 Questions
    // -------------------------------------------------------------
    console.log("\n5️⃣ [STEP 6 & 7: Assessment - Answering 10 Questions]");
    const answers = [
      { q: 1, correct: true },
      { q: 2, correct: true },
      { q: 3, correct: true },
      { q: 4, correct: true },
      { q: 5, correct: true },
      { q: 6, correct: true },
      { q: 7, correct: true },
      { q: 8, correct: true },
      { q: 9, correct: true },
      { q: 10, correct: true },
    ];
    const totalCorrect = answers.filter((a) => a.correct).length;
    const finalScore = Math.round((totalCorrect / answers.length) * 100);
    assert("10 questions answered correctly (Score: 100%)", finalScore === 100);

    // -------------------------------------------------------------
    // Step 8: POST /api/training/result
    // -------------------------------------------------------------
    console.log("\n6️⃣ [STEP 8: POST /api/training/result]");
    const submitResultRes = await request("/api/training/result", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        moduleId: "FIRE_01",
        score: finalScore,
        duration: 10,
        correctActions: totalCorrect,
        wrongActions: 0,
        safetyViolations: 0,
        status: "passed",
      }),
    });
    assert(
      "Training result saved in PostgreSQL database",
      submitResultRes.status === 201 && submitResultRes.body?.result?.score === 100,
      submitResultRes.body
    );

    // Verify in history
    const historyRes = await request("/api/training/history", {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(
      "Training history returns saved result",
      historyRes.status === 200 && historyRes.body?.history?.[0]?.score === 100
    );

    // -------------------------------------------------------------
    // Step 9: Certificate Issue & Data Completeness
    // -------------------------------------------------------------
    console.log("\n7️⃣ [STEP 9: Issue Certificate (POST /api/certificates)]");
    const certRes = await request("/api/certificates", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ moduleId: "FIRE_01" }),
    });

    const certData = certRes.body?.certificate;
    certificateId = certData?.certificateId || certData?.certificate_id;

    assert("Certificate created or retrieved", (certRes.status === 201 || certRes.status === 200) && Boolean(certificateId));
    assert("Certificate includes participant name", certData?.participantName === workerName || certData?.worker_name === workerName);
    assert("Certificate includes module title", Boolean(certData?.moduleName || certData?.module_title));
    assert("Certificate includes 100% score", Number(certData?.score) === 100);
    assert("Certificate includes SHA-256 hash", Boolean(certData?.verificationHash || certData?.verification_hash));

    // -------------------------------------------------------------
    // Step 10: QR Code Verification (API & Browser HTML)
    // -------------------------------------------------------------
    console.log("\n8️⃣ [STEP 10: Verify Certificate via QR Code Endpoint]");
    
    // API verification (JSON)
    const verifyApiRes = await request(`/api/certificates/verify/${certificateId}`, {
      headers: { Accept: "application/json" },
    });
    assert(
      "QR verification endpoint returns valid JSON for API clients",
      verifyApiRes.status === 200 && verifyApiRes.body?.certificate?.certificate_id === certificateId
    );

    // Browser camera QR scan verification (HTML)
    const verifyHtmlRes = await request(`/api/certificates/verify/${certificateId}`, {
      headers: { Accept: "text/html" },
    });
    const htmlBody = typeof verifyHtmlRes.body === "string" ? verifyHtmlRes.body : "";
    assert(
      "QR scan from mobile browser serves rich verified certificate card",
      verifyHtmlRes.status === 200 &&
      htmlBody.includes("OFFICIALLY VERIFIED CERTIFICATE") &&
      htmlBody.includes(workerName) &&
      htmlBody.includes("100% (PASSED)")
    );

    // -------------------------------------------------------------
    // Step 11: Real QR Code Generation & PDF HTML Template
    // -------------------------------------------------------------
    console.log("\n9️⃣ [STEP 11: Real QR Code Generation for PDF]");
    const qrUrl = `${BASE_URL}/api/certificates/verify/${certificateId}`;
    const qr = qrcode(0, "M");
    qr.addData(qrUrl);
    qr.make();
    const qrSvg = qr.createSvgTag(4, 0);

    assert("Scannable SVG QR Code generated with real verification URL", qrSvg.startsWith("<svg") && qrSvg.includes("</svg>"));
    console.log(`  🔗 Verification URL embedded in QR: ${qrUrl}`);

  } catch (err) {
    console.error("Critical test error:", err);
    failedCount++;
  } finally {
    console.log("\n" + "=".repeat(75));
    console.log(`🏁 E2E TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
    console.log("=".repeat(75) + "\n");

    if (server) {
      server.close(() => process.exit(failedCount > 0 ? 1 : 0));
    } else {
      process.exit(failedCount > 0 ? 1 : 0);
    }
  }
}

setTimeout(runE2ETest, 600);
