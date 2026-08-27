<div align="center">

# Asad Zaidi — Portfolio

### A full-stack, content-driven developer portfolio

Modern React frontend backed by an Express/MongoDB API, with protected admin editing, contact-message management, Cloudinary uploads, and interactive Swagger documentation.

<p>
	<a href="http://localhost:3000">Frontend</a> ·
	<a href="http://localhost:5000/docs">API Docs</a> ·
	<a href="http://localhost:5000/api/health">API Health</a>
</p>

</div>

## Overview

This repository contains the complete portfolio application:

- **Frontend:** Responsive React portfolio with sections for the hero, about, experience, education, skills, certifications, badges, hobbies, languages, and contact.
- **Backend:** Express REST API that serves portfolio content from MongoDB.
- **Administration:** JWT-protected administrator endpoints for updating portfolio content and managing contact submissions.
- **Media:** Cloudinary-backed uploads for images and résumé files.
- **Documentation:** OpenAPI 3 documentation served through Swagger UI.

Portfolio content is stored in one MongoDB document and mirrors the structure of `frontend/src/data/data.json`, allowing the frontend to consume the API response without transformation.

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Create React App, Tailwind CSS, Lucide React, React Icons |
| Backend | Node.js, Express 5, Mongoose 9, MongoDB |
| Authentication | JWT, bcryptjs |
| File storage | Cloudinary, Multer |
| API documentation | OpenAPI 3, Swagger UI Express |
| Testing | React Testing Library, Jest |

## Repository structure

```text
.
├── backend/
│   ├── config/          Database and Swagger configuration
│   ├── controllers/     Request handlers
│   ├── middlewares/     Authentication and error handling
│   ├── models/          Mongoose models
│   ├── routes/          Express route modules
│   ├── seed/            Portfolio and admin seed logic
│   ├── services/        External services such as Cloudinary
│   └── server.js        Application entry point
├── frontend/
│   ├── public/           Static assets and web manifest
│   └── src/              React components, pages, hooks, and data
└── README.md
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB running locally or a MongoDB Atlas connection
- Cloudinary account for file uploads

## Getting started

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure the backend

Create `backend/.env` using the following template. Do not commit real credentials.

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

MONGODB_URI=mongodb://127.0.0.1:27017/portfolio

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=30d

ADMIN_NAME=Portfolio Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-password-of-at-least-6-characters
```

### 3. Seed the database

From `backend/`, seed the portfolio document and create the admin account:

```bash
npm run seed
```

The seed operation is safe to rerun. It upserts the portfolio and leaves an existing admin account unchanged.

### 4. Start the applications

Start the API in one terminal:

```bash
cd backend
npm run dev
```

Start the React application in another terminal:

```bash
cd frontend
npm start
```

Open [http://localhost:3000](http://localhost:3000). The API runs at [http://localhost:5000](http://localhost:5000).

## Frontend configuration

The frontend defaults to `http://localhost:5000/api`. To use another backend, create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

The Axios helper also supports `REACT_APP_API_BASE` when used by admin-facing features:

```env
REACT_APP_API_BASE=http://localhost:5000
```

Restart the frontend after changing environment variables.

## API documentation

With the backend running, visit:

- **Swagger UI:** [http://localhost:5000/docs](http://localhost:5000/docs)
- **OpenAPI JSON:** [http://localhost:5000/docs.json](http://localhost:5000/docs.json)
- **Status endpoint:** [http://localhost:5000/](http://localhost:5000/)
- **Health endpoint:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### API routes

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | Check API health |
| POST | `/api/auth/login` | Public | Authenticate an administrator |
| GET | `/api/auth/me` | Admin | Get the current administrator |
| GET | `/api/portfolio` | Public | Read portfolio content |
| PATCH | `/api/portfolio` | Admin | Update portfolio content |
| POST | `/api/contact` | Public | Submit a contact message |
| GET | `/api/contact` | Admin | List contact messages |
| PATCH | `/api/contact/:id/read` | Admin | Mark a message as read |
| DELETE | `/api/contact/:id` | Admin | Delete a message |
| POST | `/api/upload` | Admin | Upload a file to Cloudinary |

Admin routes require the header `Authorization: Bearer <token>`, where the token is returned by `/api/auth/login`.

### Updating portfolio content

`PATCH /api/portfolio` accepts any subset of the top-level portfolio sections.

- Object sections are shallow-merged: `meta`, `personal`, `hero`, `about`, `personalInfoCard`, `skills`, `contact`, and `resume`.
- Array sections are replaced in full: `stats`, `education`, `experience`, `certifications`, `badges`, `hobbies`, `languages`, `socials`, and `nav`.

When replacing an array, send the complete updated array rather than only one item.

## Available scripts

### Backend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |
| `npm start` | Start the API in normal mode |
| `npm run seed` | Seed portfolio data and the admin account |

### Frontend

| Command | Description |
| --- | --- |
| `npm start` | Start the development server |
| `npm test` | Run the test suite |
| `npm run build` | Create an optimized production build |

## Production checklist

- Use a managed MongoDB deployment or a secured production MongoDB instance.
- Set a strong, unique `JWT_SECRET` and production `JWT_EXPIRES_IN` value.
- Restrict `CLIENT_URL` to the deployed frontend origin.
- Keep Cloudinary and database credentials in the hosting provider's secret manager.
- Never commit `.env` files, API keys, passwords, or JWT secrets.
- Serve the API and frontend over HTTPS.
- Run `npm run build` and serve the generated frontend build through a production web server or hosting platform.

## Troubleshooting

### `Route not found: /docs`

Make sure the backend is running the current source and that you are opening the correct port. Swagger is available at `/docs`, while the machine-readable specification is at `/docs.json`.

### `Cannot find module ...`

Install dependencies from the relevant project directory:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### MongoDB connection errors

Confirm that MongoDB is running and that `MONGODB_URI` is present in `backend/.env`.

### Admin login failures

Run `npm run seed` after setting `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Existing admin credentials are not overwritten by the seed script.

## License

No license has currently been specified for this repository. Add a license file before distributing the project publicly.
