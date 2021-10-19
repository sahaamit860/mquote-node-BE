const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const basicAuth = require("basic-auth");
const fs = require("fs");

const connectDB = require("./config/db");
const main = require("./routes/index");

dotenv.config({ path: "./config/config.env" }); // Load config file
connectDB(); // connect MongoDB

// Http authentication
let auth = function (req, res, next) {
  let user = basicAuth(req);
  if (!user || !user.name || !user.pass) {
    res.set("WWW-Authenticate", "Basic realm=Authorization Required");
    res.sendStatus(401);
    return;
  }
  if (
    user.name === process.env.HTTPAuthUser &&
    user.pass === process.env.HTTPAuthPassword
  ) {
    next();
  } else {
    res.set("WWW-Authenticate", "Basic realm=Authorization Required");
    res.sendStatus(401);
    return;
  }
};

global.appRoot = path.resolve(__dirname);

const app = express();
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  let options = {
    customCss: ".swagger-ui .models { display: none }",
  };
  let mainSwaggerData = JSON.parse(fs.readFileSync("swagger.json"));
  mainSwaggerData.host = process.env.host;
  mainSwaggerData.basePath = process.env.baseApiUrl;

  const modules = "./app/modules";
  fs.readdirSync(modules).forEach((file) => {
    if (fs.existsSync(modules + "/" + file + "/swagger.json")) {
      const stats = fs.statSync(modules + "/" + file + "/swagger.json");
      const fileSizeInBytes = stats.size;
      if (fileSizeInBytes) {
        let swaggerData = fs.readFileSync(
          modules + "/" + file + "/swagger.json"
        );
        swaggerData = swaggerData
          ? JSON.parse(swaggerData)
          : { paths: {}, definitions: {} };
        mainSwaggerData.paths = {
          ...swaggerData.paths,
          ...mainSwaggerData.paths,
        };
        mainSwaggerData.definitions = {
          ...swaggerData.definitions,
          ...mainSwaggerData.definitions,
        };
      }
    }
  });
  if (process.env.isHTTPAuthForSwagger) {
    app.get("/docs", auth, (req, res, next) => {
      next();
    });
  }
  let swaggerDocument = mainSwaggerData;
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
}

app.use(express.json());

app.use("/api", main);
app.use(express.static(path.join(__dirname, "public")));

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
