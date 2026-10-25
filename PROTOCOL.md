# Urja Meter Ops Portal Protocol Notes

## 1. Overview

This document records the upstream portal behavior observed during manual investigation for the Flock Energy API assignment. It describes observed requests and responses and distinguishes verified behavior from unresolved details.

## 2. Authentication

- Login endpoint: `POST /login`.
- The login request uses `application/x-www-form-urlencoded` form data containing the email and password fields.
- During browser investigation, the login response included a redirect instruction to `/meters` with status `303`.
- The browser login response included a `Set-Cookie` header.
- The observed browser session cookie name was `__Secure-better-auth.session_token`.
- In the Node.js client investigation, a `GET /login` request returned `200 OK`.
- The subsequent Node.js login request returned `200 OK` and included a session cookie.
- The Node.js client uses the received cookies when requesting meter data.
- Cookie values and login credentials are sensitive and must not be stored in this document or committed to source control.

The browser and Node.js login responses differed in status and redirect behavior during testing. The implementation was adjusted, and the API's energy and geographic endpoints were subsequently tested successfully.

## 3. Observed Meter Endpoints

### 3.1 Energy readings

- Method: `GET`
- Path: `/portal/meters/{meterId}/energy`
- Example meter ID: `J100000`
- Observed browser response: `200 OK`
- Response format: JSON
- The response contains a `data` array with energy readings.
- Observed fields include `timestamp`, `kwh`, `kvah`, and `voltR`.
- The observed reading values were returned as strings.
- Readings were observed at 30-minute intervals in the sample response.

Example response structure:

```json
{
  "data": [
    {
      "timestamp": "23/06/2026 23:30",
      "kwh": "48438.74",
      "kvah": "52313.84",
      "voltR": "226"
    }
  ]
}
```

This is a representative structure based on an observed reading, not a complete schema for every possible response.

### 3.2 Geographic coordinates

- Method: `GET`
- Path: `/portal/meters/{meterId}/geo`
- Example meter ID: `J100001`
- Observed response: JSON containing a `data` object.
- Observed fields: `latitude` and `longitude`.
- Coordinate values were returned as strings.

Example response structure:

```json
{
  "data": {
    "latitude": "26.822136543835608",
    "longitude": "75.90718190602279"
  }
}
```

## 4. Authentication Investigation Status

The Node.js client was updated to perform a login request, collect the returned cookies, and use them for subsequent meter-data requests.

During testing, the client logged a successful login response (`200 OK`) and confirmed that a login cookie was received. The local API's energy and geographic endpoints were subsequently tested successfully.

Earlier requests from the Node.js client returned `403 Forbidden`. That issue was resolved during the investigation, although the complete reason for the earlier failure was not conclusively established.

## 5. Limitations

- The complete meter-list endpoint has not yet been identified.
- The full energy-reading schema has not yet been documented.
- Authentication behavior may differ between browser and programmatic requests.
- Further testing would be needed to establish session expiry, cookie renewal, and behavior when credentials are invalid.
- No undocumented endpoint behavior should be assumed without further observation.

