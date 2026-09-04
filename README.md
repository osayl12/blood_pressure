# Blood Pressure Monitoring System

## 📌 Project Overview

Blood Pressure Monitoring Web Application built with:

-   Node.js
-   Express.js
-   MySQL
-   Swagger (API Documentation)
-   Docker & Docker Compose (for deployment)

The system allows: - Managing users - Adding blood pressure
measurements - Viewing measurement history - Generating monthly
summaries

------------------------------------------------------------------------

Blood_Pressure/
│
├── Middleware/
│   ├── Users_Mid.js
│   ├── Measurements_Mid.js
│   └── Summary_Mid.js
│
├── Routers/
│   ├── Users_R.js
│   ├── Measurements_R.js
│   └── Summary_R.js
│
├── public/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── database.js
├── gen_params.js
├── index.js
├── swaggerConfig.js
├── blood_pressure_tracker.sql
├── package.json
├── Dockerfile
├── docker-compose.yml
└── README.md

------------------------------------------------------------------------

## 🛠️ Database Setup

1.  Create a MySQL database: blood_pressure_tracker

2.  Import the file: blood_pressure_tracker.sql

------------------------------------------------------------------------

## 🚀 Run Locally (Without Docker)

1.  Install dependencies: npm install

2.  Copy .env.example to .env and set APP_PASSWORD and SESSION_SECRET
    (the server refuses to start without them)

3.  Start the server: node index.js

4.  Open browser: http://localhost:7291 — the app is viewable right away

Swagger documentation: http://localhost:7291/api-docs

------------------------------------------------------------------------

## 🔐 Authentication

Viewing is public — anyone with the URL can see patient names, history,
and monthly summaries with no login. Writing data (`POST /measurements/add`,
`POST /users/create`, `PUT /users/update`, `DELETE /users/delete`) requires
a session, gated by a single shared password (`APP_PASSWORD`, via
`POST /auth/login`). There's no per-user login — anyone with the password
can add readings and manage all patients.

------------------------------------------------------------------------

## 🐳 Docker Setup

### Where to put Docker files?

IMPORTANT: Dockerfile and docker-compose.yml must be placed in the ROOT
folder:

Blood_Pressure/ Dockerfile docker-compose.yml index.js package.json ...

NOT inside Middleware/ NOT inside Routers/ NOT inside public/

------------------------------------------------------------------------

### Dockerfile

FROM node:20-alpine

WORKDIR /app

COPY package\*.json ./
RUN npm install

COPY . .

EXPOSE 7291

CMD \["node", "index.js"\]

------------------------------------------------------------------------

###  docker-compose.yml

See `docker-compose.yml` in the repo root. It runs two containers:

- `pressure-node` – the Express app (container port 7291, published on 8082)
- `pressure-mysql` – MySQL 8, data persisted in the `db_data` volume,
  schema seeded from `db/blood_pressure_tracker.sql` on first boot

------------------------------------------------------------------------

## 🔄 Run With Docker

Build and run:

docker compose up --build

Then open:

http://localhost:8082

------------------------------------------------------------------------

##  🌍 Live Website

🔗 https://pressurecheck.duckdns.org/

Hosted on:

- Oracle Cloud (Ubuntu 22.04 VM), deploy dir `/var/www/blood_pressure`
- DuckDNS subdomain
- Docker Compose for the app + DB
- A shared Caddy container (part of the CarConnect stack) terminates TLS
  and reverse-proxies `pressurecheck.duckdns.org` to `pressure-node:7291`
  over the `pressurecheck_default` Docker network. Caddy obtains and
  renews the Let's Encrypt certificate automatically.

------------------------------------------------------------------------

## 📘 API Endpoints

🔒 = requires a signed-in session (`POST /auth/login`)

### Auth

-   POST /auth/login
-   POST /auth/logout
-   GET /auth/status

### Users

-   🔒 POST /users/create
-   GET /users/list
-   🔒 PUT /users/update
-   🔒 DELETE /users/delete

### Measurements

-   🔒 POST /measurements/add
-   GET /measurements/history/:userId

### Summary

-   GET /summary/monthly?month=YYYY-MM

------------------------------------------------------------------------

## ☁ Infrastructure

- Cloud Provider: Oracle Cloud
- VM OS: Ubuntu
- Deployment via SSH from GitHub Actions
  
------------------------------------------------------------------------

## 📌 Notes

-   Database uses foreign key with ON DELETE CASCADE
-   Swagger documentation available at /api-docs
-   Designed for DevOps academic project (Docker + CI/CD ready)

------------------------------------------------------------------------

## License

For educational use.
