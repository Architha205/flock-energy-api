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
