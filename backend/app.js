const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
// const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const fs = require("fs");
const logger = require("morgan");

const app = express();

dotenv.config({
  path: ".env",
});

app.use(
  express.json({
    limit: "100mb",
  })
);

app.use(
  bodyParser.json({
    limit: "500mb",
  })
);

app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: "500mb",
  })
);

app.use(logger("dev"));
app.use(xss());

app.set("host", "127.0.0.1");
app.set("port", process.env.PORT);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.disable("x-powered-by");

// DEFINE ENDPOINTS
app.get(`/healthcheck`, (req, res) => {
  return res.send({ data: "alive" });
});

app.get(`/break`, (req, res) => {
  let unhandledError = "";
  Promise.reject(unhandledError);
  return res.status(400).json({ error: unhandledError });
});

//START APPLICATION
app.listen(app.get("port"), () => {
  console.log(
    "Audits App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );

  if (process.env.NODE_ENV === "development")
    console.log("  Press CTRL-C to stop\n");
});
