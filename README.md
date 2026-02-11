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

## 🗂️ Project Structure

Blood_Pressure/ │ ├── Middleware/ │ ├── Users_Mid.js │ ├──
Measurements_Mid.js │ └── Summary_Mid.js │ ├── Routers/ │ ├── Users_R.js
│ ├── Measurements_R.js │ └── Summary_R.js │ ├── public/ │ ├──
index.html │ ├── script.js │ └── style.css │ ├── database.js ├──
gen_params.js ├── index.js ├── swaggerConfig.js ├──
blood_pressure_tracker.sql ├── package.json ├── Dockerfile ├──
docker-compose.yml └── README.md

------------------------------------------------------------------------

## 🛠️ Database Setup

1.  Create a MySQL database: blood_pressure_tracker

2.  Import the file: blood_pressure_tracker.sql

------------------------------------------------------------------------

## 🚀 Run Locally (Without Docker)

1.  Install dependencies: npm install

2.  Start the server: node index.js

3.  Open browser: http://localhost:7291

Swagger documentation: http://localhost:7291/api-docs

------------------------------------------------------------------------

## 🐳 Docker Setup

### Where to put Docker files?

IMPORTANT: Dockerfile and docker-compose.yml must be placed in the ROOT
folder:

Blood_Pressure/ Dockerfile docker-compose.yml index.js package.json ...

NOT inside Middleware/ NOT inside Routers/ NOT inside public/

------------------------------------------------------------------------

### Example Dockerfile

FROM node:18

WORKDIR /app

COPY package\*.json ./ RUN npm install

COPY . .

EXPOSE 7291

CMD \["node", "index.js"\]

------------------------------------------------------------------------

### Example docker-compose.yml

version: '3.8'

services: app: build: . ports: - "7291:7291" depends_on: - db
environment: - HOST=db - USER=root - PASSWORD=root -
DATABASE=blood_pressure_tracker

db: image: mysql:8 restart: always environment: MYSQL_ROOT_PASSWORD:
root MYSQL_DATABASE: blood_pressure_tracker ports: - "3306:3306"

------------------------------------------------------------------------

## 🔄 Run With Docker

Build and run:

docker-compose up --build

Then open:

http://localhost:7291

------------------------------------------------------------------------

## 📘 API Endpoints

### Users

-   POST /users/create
-   GET /users/list
-   PUT /users/update
-   DELETE /users/delete

### Measurements

-   POST /measurements/add
-   GET /measurements/history/:userId

### Summary

-   GET /summary/monthly?month=YYYY-MM

------------------------------------------------------------------------

## 📌 Notes

-   Database uses foreign key with ON DELETE CASCADE
-   Swagger documentation available at /api-docs
-   Designed for DevOps academic project (Docker + CI/CD ready)

------------------------------------------------------------------------

Author: osayl
