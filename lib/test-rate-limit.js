// test-rate-limit.js
const http = require("http");

const BASE_URL = "http://localhost:3000";

console.log("\n==================================================");
console.log("  RATE LIMITING TEST - Proyecto Cumbre");
console.log("==================================================\n");

/**
 * Hace una petición HTTP POST
 */
async function makeRequest(path, body) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);

    const options = {
      hostname: "localhost",
      port: 3000,
      path: path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
      },
    };

    const req = http.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: responseData,
        });
      });
    });

    req.on("error", (error) => {
      resolve({
        statusCode: 0,
        headers: {},
        body: "",
        error: error.message,
      });
    });

    req.write(data);
    req.end();
  });
}

/**
 * Espera X milisegundos
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * TEST 1: Rate limiting en /api/members
 */
async function test1() {
  console.log("TEST 1: Rate Limiting en /api/members (limite: 5 req/min)");
  console.log("-----------------------------------------------------------\n");

  for (let i = 1; i <= 6; i++) {
    console.log(`Request ${i} de 6...`);

    const response = await makeRequest("/api/members", {
      email: "test@test.com",
      firstName: "Test",
      lastName: "User",
      dni: "12345678A",
      phone: "600000000",
      address: "Test Address",
      city: "Test City",
      province: "Test Province",
      postalCode: "29001",
      birthDate: "1990-01-01",
    });

    const remaining = response.headers["x-ratelimit-remaining"];

    if (response.statusCode === 429) {
      console.log("  └─ Status: 429 TOO MANY REQUESTS ✓");
      console.log("  └─ Rate limit funcionando correctamente!");
    } else if (response.statusCode === 0) {
      console.log("  └─ ERROR: No se pudo conectar al servidor");
    } else {
      console.log(`  └─ Status: ${response.statusCode}`);
      if (remaining) {
        console.log(`  └─ Requests restantes: ${remaining}`);
      }
    }

    console.log("");
    await sleep(300);
  }
}

/**
 * TEST 2: Webhook de Stripe - IP Whitelist
 */
async function test2() {
  console.log("==================================================\n");
  console.log("TEST 2: Webhook de Stripe - IP Whitelist");
  console.log("-----------------------------------------------------------\n");
  console.log("Intentando acceder al webhook sin IP de Stripe...");

  const response = await makeRequest("/api/webhooks/stripe", {
    test: true,
  });

  if (response.statusCode === 403) {
    console.log("  └─ Status: 403 FORBIDDEN ✓");
    console.log("  └─ IP whitelist funcionando correctamente!");
  } else if (response.statusCode === 0) {
    console.log("  └─ ERROR: No se pudo conectar al servidor");
  } else {
    console.log(`  └─ Status inesperado: ${response.statusCode}`);
    console.log("  └─ Esperado: 403 (Forbidden)");
  }

  console.log("");
}

/**
 * TEST 3: Rate limiting en /api/contact
 */
async function test3() {
  console.log("==================================================\n");
  console.log("TEST 3: Rate Limiting en /api/contact (limite: 5 req/min)");
  console.log("-----------------------------------------------------------\n");
  console.log("Enviando 3 requests al endpoint de contacto...\n");

  for (let i = 1; i <= 3; i++) {
    const response = await makeRequest("/api/contact", {
      name: "Test User",
      email: "test@test.com",
      message: "Test message",
    });

    const remaining = response.headers["x-ratelimit-remaining"];
    const status = response.statusCode === 0 ? "ERROR" : response.statusCode;

    console.log(
      `  Request ${i} - Status: ${status} - Remaining: ${remaining || "N/A"}`,
    );

    await sleep(200);
  }

  console.log("\n==================================================");
  console.log("  ✓ Tests completados!");
  console.log("==================================================\n");
}

/**
 * Ejecutar todos los tests
 */
async function runTests() {
  console.log("Verificando que el servidor está corriendo...");

  const healthCheck = await makeRequest("/", {});

  if (healthCheck.statusCode === 0) {
    console.log(
      "\n❌ ERROR: El servidor no está corriendo en http://localhost:3000",
    );
    console.log('Por favor, ejecuta "npm run dev" primero\n');
    process.exit(1);
  }

  console.log("✓ Servidor detectado\n");

  await test1();

  // ✅ ESPERAR 60 SEGUNDOS ANTES DE TEST 2
  console.log(
    "⏳ Esperando 60 segundos para que expire la ventana de rate limit...\n",
  );
  await sleep(60000);

  await test2();
  await test3();
}

// Ejecutar tests
runTests().catch((error) => {
  console.error("\n❌ Error ejecutando tests:", error.message);
  process.exit(1);
});
