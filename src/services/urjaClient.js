
const axios = require("axios");

const BASE_URL = process.env.URJA_URL;

if (!BASE_URL || !process.env.URJA_EMAIL || !process.env.URJA_PASSWORD) {
  throw new Error("Missing Urja portal environment variables in .env");
}


function extractCookies(setCookieHeaders = []) {
  return setCookieHeaders
    .map((cookie) => cookie.split(";")[0])
    .filter(Boolean)
    .join("; ");
}



async function createUrjaClient() {
  try {
    const response = await axios.post(
      `${BASE_URL}/login`,
      new URLSearchParams({
        email: process.env.URJA_EMAIL,
        password: process.env.URJA_PASSWORD,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400,
      }
    );

    console.log("Login status:", response.status);
    console.log("Login response type:", response.data?.type);
    console.log("Login redirect:", response.headers.location || "none");
    console.log(
      "Set-Cookie received:",
      Boolean(response.headers["set-cookie"])
    );

    const cookies = extractCookies(response.headers["set-cookie"]);

    if (!cookies) {
      throw new Error("Login response did not provide a session cookie");
    }

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
      "Login failed:",
      error.response
        ? `HTTP ${error.response.status}`
        : error.message
    );
    throw error;
  }
}


async function getMeterEnergy(meterId) {
  const client = await createUrjaClient();

  const response = await client.get(
    `/portal/meters/${encodeURIComponent(meterId)}/energy`
  );

  return response.data;
}


async function getMeterGeo(meterId) {
  const client = await createUrjaClient();

  const response = await client.get(
    `/portal/meters/${encodeURIComponent(meterId)}/geo`
  );

  return response.data;
}

module.exports = {
  getMeterEnergy,
  getMeterGeo,
};
