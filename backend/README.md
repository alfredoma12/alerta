# Stolen Car Backend

Simple backend built with Node.js, Express and TypeScript for a stolen car reporting app.

It uses a JSON file as a tiny database, so there is no authentication, no external database server, and almost no setup.

## Features

- `POST /reports` to create a stolen car report
- `GET /reports` to list all reports
- `GET /reports/:licensePlate` to search by license plate
- `POST /alerts` to simulate an alert when a plate is found
- CORS enabled so a frontend hosted on GitHub Pages can call the API
- File-based storage in `data/reports.json`
- `nodemon` for local development

## Project structure

```text
backend/
  data/
    reports.json
  src/
    server.ts
    store.ts
    types.ts
  package.json
  tsconfig.json
```

## Run locally

1. Open the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The API will run on:

```text
http://localhost:3000
```

## Production run

Build the TypeScript project:

```bash
npm run build
```

Start the compiled server:

```bash
npm start
```

## Environment variables

Optional:

```env
PORT=3000
```

If `PORT` is not set, the server uses `3000`.

This backend is ready to deploy on Render because it only needs Node.js and an optional `PORT` environment variable.

## API endpoints

### POST /reports

Creates a stolen car report.

Validation rules:

- `licensePlate` is required and must be a non-empty string
- `description` is required and must be a non-empty string
- `location` is required and must be a non-empty string
- `contact` is required and must be a non-empty string
- license plates are normalized to uppercase with spaces removed

Request body:

```json
{
  "licensePlate": "ABC123",
  "description": "Black sedan with broken rear window",
  "location": "Santiago Centro",
  "contact": "+56 9 1234 5678"
}
```

Notes:

- `date` is generated automatically by the server
- `licensePlate` is stored in uppercase to make searching easier

### GET /reports/:licensePlate

Returns all reports matching the given plate.

Search is case-insensitive because the server normalizes the plate before saving and before searching.

### GET /reports

Returns all stored reports.

Example:

```bash
curl http://localhost:3000/reports/ABC123
```

### POST /alerts

Simulates sending an alert by logging a message in the server console.

Request body:

```json
{
  "licensePlate": "ABC123",
  "seenLocation": "Valparaiso"
}
```

If a report exists, the server logs:

```text
ALERT: stolen car spotted | plate=ABC123 | seenLocation=Valparaiso | matches=1
```

If no report exists, the API returns a message saying no report was found.

## Example curl requests

Create a report:

```bash
curl -X POST http://localhost:3000/reports \
  -H "Content-Type: application/json" \
  -d '{
    "licensePlate": "ab c123",
    "description": "Black sedan with broken rear window",
    "location": "Santiago Centro",
    "contact": "+56 9 1234 5678"
  }'
```

Get all reports:

```bash
curl http://localhost:3000/reports
```

Search by license plate:

```bash
curl http://localhost:3000/reports/ABC123
```

Trigger an alert:

```bash
curl -X POST http://localhost:3000/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "licensePlate": "abc 123",
    "seenLocation": "Valparaiso"
  }'
```

## Example frontend fetch

```ts
await fetch('http://localhost:3001/reports', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    licensePlate: 'ABC123',
    description: 'Black sedan with broken rear window',
    location: 'Santiago Centro',
    contact: '+56 9 1234 5678',
  }),
});
```

## Notes

- Every request is logged with method and route.
- The server recreates `data/reports.json` if it does not exist.
- If `reports.json` is empty or corrupted, the server resets it to an empty array instead of crashing.
