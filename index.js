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
        connectSrc: ["'self'", "https://cdn.jsdelivr.net"],
      },
    },
  }),
);

app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));
// ================= SWAGGER =================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ================= DATABASE =================
let db_M = require("./database");
global.db_pool = db_M.pool;

// ================= VIEW ENGINE =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// ================= GLOBAL HELPERS =================
global.htmlspecialchars = require("htmlspecialchars");
const { addSlashes, stripSlashes } = require("slashes");
global.addSlashes = addSlashes;
global.stripSlashes = stripSlashes;

// ================= ROUTERS =================
const Users_R = require("./Routers/Users_R");
app.use("/users", Users_R);

const Measurements_R = require("./Routers/Measurements_R");
app.use("/measurements", Measurements_R);

const Summary_R = require("./Routers/Summary_R");
app.use("/summary", Summary_R);

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
