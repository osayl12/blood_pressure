// ================= IMPORTS =================
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerConfig");

const port = 7291;

// ================= APP INIT =================
const app = express();

// ================= MIDDLEWARE =================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
      },
    },
  }),
);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    optionsSuccessStatus: 200,
  }),
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

// ================= SWAGGER =================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ================= DATABASE =================
let db_M = require("./database");
global.db_pool = db_M.pool;

// ================= GLOBAL HELPERS =================
global.htmlspecialchars = require("htmlspecialchars");

// ================= HEALTH CHECK =================
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ================= ROUTERS =================
const Users_R = require("./Routers/Users_R");
app.use("/users", Users_R);

const Measurements_R = require("./Routers/Measurements_R");
app.use("/measurements", Measurements_R);

const Summary_R = require("./Routers/Summary_R");
app.use("/summary", Summary_R);

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ================= START SERVER =================
app.listen(port, "0.0.0.0", () => {
  console.log(`Now listening on port http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
