import express from "express";
import createError from "http-errors";
import logger from "morgan";
import mongoose from 'mongoose';
import fs from "node:fs/promises";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";

mongoose.connect('mongodb://localhost/express-api2');

const app = express();

app
  .use(logger("dev"))
  .use(express.json())
  .use(express.urlencoded({ extended: false }));

function prepareName(req, res, next) {
  req.name = "Alice";
  next();
}

function myMiddleware(req, res, next) {
  console.log(`Hello ${req.name}!`);
  // res.send('Hello World!');
  next();
}

app.use(prepareName, myMiddleware);

app.get('/files', async function (req, res) {
  const files = await fs.readdir('./');
  res.json(files);
});

app.post('/ping', function ping(req, res, next) {
  res.send('pong');
});

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Send the error status
  res.status(err.status || 500);
  res.send(err.message);
});

export default app;
