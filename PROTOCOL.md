# Urja Meter Ops Portal Protocol Notes

## 1. Overview

This document records the portal behavior observed during manual investigation for the Flock Energy API assignment.

## 2. Authentication

- Login endpoint: `POST /login`
- The login request uses email and password form data.
- The observed login response included a redirect instruction to `/meters` with status `303`.
- The login response included a `Set-Cookie` header.
- The browser's authenticated requests included a session cookie named `__Secure-better-auth.session_token`.
- The session cookie value is sensitive and must not be stored in this document or committed to source control.

## 3. Observed Meter Endpoints

### 3.1 Energy readings

- Method: `GET`
- Path: `/portal/meters/{meterId}/energy`
- Example meter ID: `J100000`
- Observed browser response: `200 OK`
- Response format: JSON
- The response contains a `data` array with energy readings.
- Observed fields include `timestamp`, `kwh`, `kvah`, and `voltR`.
- Reading values were returned as strings in the observed response.

### 3.2 Geographic coordinates

- Method: `GET`
- Path: `/portal/meters/{meterId}/geo`
- Example meter ID: `J100001`
- Observed browser response: JSON containing a `data` object.
- Observed fields: `latitude` and `longitude`.
- Coordinate values were returned as strings in the observed response.

## 4. Authentication Investigation Status

The energy endpoint returned `200 OK` when accessed through the authenticated browser session.

The Node.js API client currently receives `403 Forbidden` when attempting to retrieve the same endpoint. The exact cause has not yet been identified.

Further investigation is required to determine the complete session setup and any additional request requirements.

## 5. Limitations

- The complete meter-list endpoint has not yet been identified.
- The full energy-reading schema has not yet been documented.
- The Node.js client's authentication flow has not yet been verified end to end.
- No undocumented endpoint behavior should be assumed without further observation.
