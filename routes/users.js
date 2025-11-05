import bcrypt from "bcrypt";
import debug from "debug";
import express from "express";
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import User from "../models/user.js";
import { authenticate } from "./auth.js";
import * as config from "../config.js";

const signJwt = promisify(jwt.sign);

const log = debug("express-api:users");

const router = express.Router();

router.post('/', async (req, res, next) => {
  const costFactor = 10;
  const plainPassword = req.body.password;
  const passwordHash = await bcrypt.hash(plainPassword, costFactor);

  // Create a new document from the JSON in the request body
  const newUser = new User(req.body);
  newUser.passwordHash = passwordHash;

  // Save that document
  const savedUser = await newUser.save();

  log('Created new user', savedUser);

  // Send the saved document back as the response.
  res.send(savedUser);
});

router.get("/", authenticate, async function (req, res, next) {
  log('GET /users called by user with ID', req.currentUserId);

  const users = await User.find().sort('name').exec();

  res.send(users);
});

router.put("/:id", async function(req, res, next) {
  const user = await User.findById(req.params.id).exec();
  user.name = req.body.name;

  const updatedUser = await user.save();

  res.send(updatedUser);
});

router.post("/login", async function (req, res, next) {
  const user = await User.findOne({ name: req.body.name });
  if (!user) {
    return res.sendStatus(401); // Unauthorized
  }

  console.debug("User found:", user);
  console.debug("Password:", req.body.password);
  const valid = await bcrypt.compare(req.body.password, user.passwordHash);
  if (!valid) {
    return res.sendStatus(401); // Unauthorized
  }

  // 1 week expiration
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
  const token = await signJwt({ sub: user._id, exp: exp }, config.secretKey);

  // Login is valid.
  res.send({
    message: `Welcome ${user.name}!`,
    token
  });
});

export default router;
