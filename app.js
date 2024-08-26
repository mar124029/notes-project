const config = require("./utils/config");
const express = require("express");
// const path = require("path");
const app = express();
const cors = require("cors");
const notesRouter = require("./controllers/notes.js");
const middleware = require("./utils/middleware.js");
const logger = require("./utils/logger.js");
const mongoose = require("mongoose");
const morgan = require("morgan");

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

// Cross-origin
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
// app.use(express.static(path.join(__dirname, "dist"))); // Sirve archivos estáticos desde la carpeta `dist`
app.use(middleware.requestLogger);
// app.use(
//   morgan(":method :url :status :res[content-length] - :response-time ms :body")
// );
app.use("/api/notes", notesRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

// Para ver los metodos HTTP
morgan.token("body", (req) => JSON.stringify(req.body));

module.exports = app;
