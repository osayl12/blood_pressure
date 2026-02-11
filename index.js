// npm i express body-parser ejs htmlspecialchars mysql2  slashes@2.0.0
const port = 7291;
const express = require("express");
const app = express();
app.use(express.json());

//swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerConfig");
// Serve Swagger docs at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.urlencoded({ extended: false }));

let db_M = require("./database");
global.db_pool = db_M.pool;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use("/public", express.static(path.join(__dirname, "style")));
app.use("/public", express.static(path.join(__dirname, "script")));
app.use(express.static("public"));

global.htmlspecialchars = require("htmlspecialchars");
const { addSlashes, stripSlashes } = require("slashes");
global.addSlashes = addSlashes;
global.stripSlashes = stripSlashes;

//--- Routers ---
const Users_R = require("./Routers/Users_R");
app.use("/users", Users_R);

const Measurements_R = require("./Routers/Measurements_R");
app.use("/measurements", Measurements_R);

const Summary_R = require("./Routers/Summary_R");
app.use("/summary", Summary_R);

//
app.listen(port, () => {
  console.log(`Now listening on port http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
