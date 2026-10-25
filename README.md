# Flock Energy API

A Node.js and Express REST API designed to provide structured access to meter energy readings and geographic information from the Urja Meter Ops portal.

## Features

- Health-check endpoint
- Meter energy readings endpoint
- Meter geographic information endpoint
- Input validation for meter IDs
- Environment-based configuration
- Centralized handling of upstream portal errors

## Tech Stack

- Node.js
- Express.js
- Axios
- dotenv

## Prerequisites

- Node.js and npm installed
- Access credentials for the Urja Meter Ops portal

## Installation

Clone the repository and enter the project directory:

```bash
git clone YOUR_PUBLIC_REPOSITORY_URL
cd flock-energy-api
npm install
```

## Configuration

Create a `.env` file in the project root:

```env
PORT=5001
URJA_URL=https://urja-ops.flockenergy.tech
URJA_EMAIL=your_assignment_email
URJA_PASSWORD=your_assignment_password
```

Replace the placeholder credentials with your assignment credentials. Never commit `.env` to Git.

## Running the API

Start the development server:

```bash
npm run dev
```

Start the server normally:

```bash
npm start
```

## API Endpoints

### Health check

`GET /health`

Checks whether the API service is running.

### Get meter energy readings

`GET /api/v1/meters/:meterId/energy`

Example:

```http
GET /api/v1/meters/J100000/energy
```

Returns the upstream portal response when the request succeeds.

### Get meter geographic information

`GET /api/v1/meters/:meterId/geo`

Example:

```http
GET /api/v1/meters/J100001/geo
```

Returns the upstream portal response when the request succeeds.

## Error Handling

- `400 Bad Request`: Invalid meter ID format.
- `502 Bad Gateway`: The API could not retrieve data from the upstream portal.
- `200 OK`: The request succeeded.

## Current Limitations

- The portal authentication flow is still being investigated.
- The energy endpoint currently returns `403 Forbidden` when called through the Node.js client, although the authenticated browser request succeeds.
- The meter-list endpoint has not yet been identified.
- Automated tests and the OpenAPI specification still need to be completed.

## Security

- Portal credentials are stored in environment variables.
- The `.env` file must remain untracked by Git.
- Session cookies and credentials must never appear in logs, documentation, or committed source code.

## Future Improvements

- Complete and verify upstream authentication.
- Add automated tests.
- Publish an OpenAPI 3.x specification.
- Improve structured error responses and request logging.
- Document additional verified portal endpoints.
