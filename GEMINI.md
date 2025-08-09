# GEMINI Project Context

## Project Overview

This project is a real-time chat system that allows users to communicate with a single administrator. The system consists of a web-based interface for the admin and a JavaScript chat widget that can be embedded into any website.

The core technologies used are:

*   **Backend:** Node.js with Express.js
*   **Real-time Communication:** Socket.IO
*   **Frontend (Widget):** JavaScript, jQuery, and Handlebars.js for templating.
*   **Data Storage:** Chat history is stored in a PostgreSQL database (previously in CSV files).

## Building and Running

**1. Install Dependencies:**

```bash
npm install
```

**2. Run the Server:**

```bash
npm start
```

**TODO:** Verify the exact run command from `package.json`.

## Development Conventions

*   **Code Style:** The project follows standard JavaScript conventions.
*   **File Structure:** The project is organized into `public`, `src`, and `views` directories, separating static assets, server-side logic, and view templates.
*   **Data Handling:** Data is persisted in a PostgreSQL database. Earlier versions stored chat data in CSV files.
*   **Real-time Logic:** All Socket.IO related logic is handled in the `socketService.js` module.
