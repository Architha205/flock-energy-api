# Flock Energy API

A Node.js and Express REST API that provides structured access to meter energy readings and geographic information from the Urja Meter Ops portal.

## Features

- Health-check endpoint
- Meter energy readings endpoint
- Meter geographic information endpoint
- Input validation for meter IDs
- Environment-based configuration
- Upstream error handling
- OpenAPI 3.0.3 specification

## Tech Stack

- Node.js
- Express.js
- Axios
- dotenv


## Project Structure

```text
flock-energy-api/
├── src/
│   ├── app.js
│   ├── server.js
│   └── services/
│       └── urjaClient.js
├── .env.example
├── .gitignore
├── openapi.json
├── package.json
├── package-lock.json
├── PROTOCOL.md
└── README.md
```

- `src/app.js`: Defines API routes, validates meter IDs, and handles errors.
- `src/server.js`: Loads environment configuration and starts the server.
- `src/services/urjaClient.js`: Handles portal authentication and upstream API requests.
- `openapi.json`: Documents the API specification.
- `PROTOCOL.md`: Documents observed portal behavior and authentication.


## Prerequisites

- Node.js and npm installed
- Valid access credentials for the Urja Meter Ops portal

## Installation

Clone the repository and enter the project directory:

```bash
git clone https://github.com/Architha205/flock-energy-api.git
cd flock-energy-api
npm install
```

## Configuration

Create a `.env` file in the project root, or copy `.env.example` to `.env`.

Configure the following environment variables:

```env
PORT=5001
URJA_URL=https://urja-ops.flockenergy.tech
URJA_EMAIL=your_assignment_email
URJA_PASSWORD=your_assignment_password
```

Replace the placeholder values with your assigned portal credentials. Keep `.env` private and never commit it to Git.

## Running the API

Start the development server:

```bash
npm run dev
```

Alternatively, start the server normally:

```bash
npm start
```

The API will be available at `http://localhost:5001` when using the default configuration above.

## API Endpoints

### 1. Health Check

`GET /health`

Checks whether the API service is running.

Example response:

```json
{
  "status": "ok",
  "service": "Flock Energy API"
}
```

### 2. Get Meter Energy Readings

`GET /api/v1/meters/:meterId/energy`

Example:

```http
GET http://localhost:5001/api/v1/meters/J100000/energy
```

Returns the energy readings supplied by the upstream portal when the request succeeds.

### 3. Get Meter Geographic Information

`GET /api/v1/meters/:meterId/geo`

Example:

```http
GET http://localhost:5001/api/v1/meters/J100001/geo
```

Returns the geographic information supplied by the upstream portal when the request succeeds.

### API Documentation

The `openapi.json` file in the project root describes the available API endpoints and their responses. It can be imported into an OpenAPI-compatible tool for inspection.

## Error Handling

- `200 OK`: The request succeeded.
- `400 Bad Request`: The supplied meter ID has an invalid format.
- `502 Bad Gateway`: The API could not retrieve data from the upstream portal.

{
  "error": "Invalid meter ID format"
}


## Current Limitations

- The meter-list endpoint has not yet been identified.
- The API currently authenticates with the upstream portal when retrieving meter data; reusing an authenticated client could reduce repeated login requests.
- The OpenAPI specification documents the currently implemented endpoints; response schemas may be expanded as more details are verified.
- Automated tests have not yet been added.

## Security

- Portal credentials are loaded from environment variables.
- `.env` is excluded from Git using `.gitignore`.
- Session cookies and credentials must not be exposed in logs, documentation, or committed source code.

## Future Improvements

- Add automated tests for successful requests, invalid meter IDs, and upstream failures.
- Reuse authenticated sessions where appropriate.
- Improve structured error responses and request logging.
- Identify and document additional verified portal endpoints.
- Expand OpenAPI response schemas with verified data structures.

## Project Documentation

- `README.md`: Setup instructions and API usage.
- `PROTOCOL.md`: Observed upstream portal requests, responses, and protocol details.
- `openapi.json`: OpenAPI specification for the implemented API.
- `.env.example`: Example environment configuration using placeholders.


## Assumptions

- Meter identifiers follow the observed format, such as `J100000`, and are validated before forwarding requests to the upstream portal.
- The upstream portal remains the source of truth; this service retrieves its data rather than maintaining a separate database.
- The API preserves the upstream response structure for energy and geographic data to avoid introducing unsupported transformations.
- Credentials are provided through environment variables and are not hardcoded into the source code.

## Design Decisions and Trade-offs

- **Express.js:** Chosen for its simple routing and lightweight structure, which suit a small REST API.
- **Axios:** Used to make HTTP requests to the upstream portal and handle response data.
- **Separate upstream client:** Portal authentication and data retrieval are isolated in `src/services/urjaClient.js`, keeping the Express routes easier to read and maintain.
- **Input validation:** Invalid meter ID formats are rejected with HTTP 400 before making an upstream request.
- **Upstream error handling:** Failed upstream requests return HTTP 502 rather than exposing internal error details to API consumers.
- **Environment configuration:** Portal credentials and the server port are configured through environment variables.

The current implementation prioritizes a small, understandable service over a more complex architecture. It does not yet implement a reusable authenticated session, caching, retries, or a persistent data store.

## Intentionally Left Out

- **Meter-list and network hierarchy endpoints:** These were not implemented because the required portal behavior and endpoints had not been sufficiently established.
- **Caching and local indexing:** Omitted to keep the initial service simple and avoid introducing data freshness concerns.
- **Automated tests:** Not added in the current implementation; these would be an important next step.
- **Web frontend:** Omitted because the core requirement was a documented API service.
- **Authentication for API consumers:** The current service is intended for local assignment evaluation and does not yet implement its own access-control mechanism.

## Reflection

### What assumptions did you make?

I assumed the upstream portal should remain the source of truth and that the new API should expose its useful meter data without unnecessarily changing the response structure. I also assumed that validating meter IDs at the API boundary would help reject malformed requests early.

### Which part was the most difficult, and how did you get unstuck?

The most difficult part was reproducing the portal's authenticated requests from Node.js. Browser requests succeeded while an early programmatic request returned an authorization error. I compared the observed login and data requests, investigated the form encoding and session cookies, and adjusted the client until the API endpoints worked.

### If you had another day, what would you improve?

I would add automated tests for successful requests and failure cases, improve authenticated-session reuse and recovery, and expand the OpenAPI response schemas. I would also investigate the meter hierarchy and any supported bulk-data access paths.

### What mistake did you make while solving this?

An early version of the client did not reproduce the portal's authenticated request behavior correctly, resulting in a 403 response. I initially focused on retrieving the data before fully verifying the authentication flow. Comparing the browser and Node.js requests helped me narrow down and address the issue.

### If you were reviewing your own submission, what would you criticise?

The service covers the core endpoints but lacks automated tests, detailed response schemas, and robust session lifecycle handling. It also has limited coverage of the portal's broader data model because the meter-list endpoint and hierarchy have not been implemented. I would address these limitations before using the service in production.