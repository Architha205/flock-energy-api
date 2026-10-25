
const axios = require("axios");

const BASE_URL = process.env.URJA_URL;

if (
  !BASE_URL ||
  !process.env.URJA_EMAIL ||
  !process.env.URJA_PASSWORD
) {
  throw new Error(
    "Missing Urja portal environment variables in .env"
  );
}

// Extract cookie names and values from Set-Cookie response headers.
// Never log or expose the actual cookie values.
function extractCookies(setCookieHeaders = []) {
  const headers = Array.isArray(setCookieHeaders)
    ? setCookieHeaders
    : [setCookieHeaders];

  return headers
    .map((cookie) => cookie.split(";")[0])
    .filter(Boolean);
}

// Combine cookies by name, keeping the latest value.
function mergeCookies(...cookieGroups) {
  const cookies = new Map();

  for (const cookie of cookieGroups.flat()) {
    const separator = cookie.indexOf("=");

    if (separator > 0) {
      const name = cookie.slice(0, separator).trim();
      cookies.set(name, cookie.trim());
    }
  }

  return [...cookies.values()].join("; ");
}

// Request the login page, submit credentials, and create an API client.
async function createUrjaClient() {
  try {
    // Step 1: Request the login page to obtain initial cookies.
    const initialResponse = await axios.get(
      `${BASE_URL}/login`,
      {
        headers: {
          Accept: "text/html,application/xhtml+xml",
        },
        maxRedirects: 0,
        validateStatus: (status) =>
          status >= 200 && status < 400,
        timeout: 15000,
      }
    );

    const initialCookies = extractCookies(
      initialResponse.headers["set-cookie"]
    );

    console.log("Login page status:", initialResponse.status);
    console.log(
      "Initial cookies received:",
      initialCookies.length > 0
    );

    // Step 2: Submit the login form using form URL encoding.
    const loginResponse = await axios.post(
      `${BASE_URL}/login`,
      new URLSearchParams({
        email: process.env.URJA_EMAIL,
        password: process.env.URJA_PASSWORD,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Origin: BASE_URL,
          Referer: `${BASE_URL}/login`,
          ...(initialCookies.length > 0
            ? { Cookie: initialCookies.join("; ") }
            : {}),
        },
        maxRedirects: 0,
        validateStatus: (status) =>
          status >= 200 && status < 400,
        timeout: 15000,
      }
    );

    console.log("Login status:", loginResponse.status);
    console.log(
      "Login redirect:",
      loginResponse.headers.location || "none"
    );

    const loginCookies = extractCookies(
      loginResponse.headers["set-cookie"]
    );

    const cookies = mergeCookies(
      initialCookies,
      loginCookies
    );

    console.log(
      "Login cookies received:",
      loginCookies.length > 0
    );

    if (!cookies) {
      throw new Error(
        "No session cookies received during login"
      );
    }

    // Step 3: Create a client for authenticated portal requests.
    return axios.create({
      baseURL: BASE_URL,
      headers: {
        Cookie: cookies,
        Accept: "application/json",
      },
      timeout: 15000,
    });
  } catch (error) {
    console.error(
      "Authentication request failed:",
      error.response
        ? `HTTP ${error.response.status}`
        : error.message
    );

    throw error;
  }
}

// Retrieve energy readings for a meter.
async function getMeterEnergy(meterId) {
  const client = await createUrjaClient();

  const response = await client.get(
    `/portal/meters/${encodeURIComponent(meterId)}/energy`
  );

  return response.data;
}

// Retrieve geographic coordinates for a meter.
async function getMeterGeo(meterId) {
  const client = await createUrjaClient();

  const response = await client.get(
    `/portal/meters/${encodeURIComponent(meterId)}/geo`
  );

  return response.data;
}

module.exports = {
  createUrjaClient,
  getMeterEnergy,
  getMeterGeo,
};
