# Portfolio Backend

Express + MongoDB API that serves all content for the portfolio site. The
entire site is stored as a single `Portfolio` document, plus an `Admin` account for editing
and a `Message` collection for contact-form submissions.

## Setup

```bash
cd backend
npm install
npm run seed   # creates the admin login
npm run dev    # starts the API on http://localhost:5000
```

Requires MongoDB running locally (`mongodb://127.0.0.1:27017` by default —
see `.env`). Fill in `CLOUDINARY_API_SECRET` in `.env` before uploading
images/résumé files through `/api/upload`.

To enable email notifications for the Lets Connect form, copy the SMTP
settings from `.env.example` into `.env` and replace the placeholder values
with your SMTP provider's credentials. Messages are still saved in MongoDB
if email delivery fails.

## Endpoints

| Method | Path                 | Auth  | Description                              |
| ------ | -------------------- | ----- | ----------------------------------------- |
| GET    | `/api/health`         | -     | Health check                              |
| GET    | `/api/portfolio`      | -     | Full portfolio content (what the site renders) |
| PATCH  | `/api/portfolio`      | admin | Update one or more sections               |
| POST   | `/api/auth/login`     | -     | Admin login → `{ token, admin }`          |
| GET    | `/api/auth/me`        | admin | Current admin profile                     |
| POST   | `/api/contact`        | -     | Submit the public contact form            |
| GET    | `/api/contact`        | admin | List contact-form submissions             |
| PATCH  | `/api/contact/:id/read` | admin | Mark a message read                    |
| DELETE | `/api/contact/:id`    | admin | Delete a message                          |
| POST   | `/api/upload`         | admin | Upload a file to Cloudinary (`multipart/form-data`, field `file`) |

Admin routes expect `Authorization: Bearer <token>` from `/api/auth/login`.

### Updating portfolio content

`PATCH /api/portfolio` accepts any subset of the portfolio's top-level
sections. Object sections (`meta`, `personal`, `hero`, `about`,
`personalInfoCard`, `skills`, `contact`, `resume`) are merged field-by-field.
Array sections (`stats`, `education`, `experience`, `certifications`,
`blogs`, `badges`, `hobbies`, `languages`, `socials`, `nav`) are replaced in full —
send the whole updated list.
