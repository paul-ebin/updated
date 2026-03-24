# Seller Hub - MERN Migration

This project has been migrated from a monolithic Next.js app to a decoupled MERN stack.

## How to Run

### 1. Backend (Express Server)
Open a terminal in the **root** directory and run:
```bash
node server.js
```
The server will run on `http://localhost:5000`.

### 2. Frontend (React + Vite)
Open a **new** terminal, navigate to the `client` directory, and run:
```bash
cd client
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Features Implemented
- **Global Currency Switching**: Change currency in the dashboard header.
- **Product Editing**: Fully updated CRUD with edit modal.
- **Native Image Uploads**: Upload images directly from your computer.

## Troubleshooting Authentication
If you are redirected back to login after a successful sign-in:
1. Ensure both Backend and Frontend are running simultaneously.
2. Clear your browser cookies for `localhost`.
3. Restart the `node server.js` terminal.
