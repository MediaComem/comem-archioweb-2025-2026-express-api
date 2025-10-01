import express from "express";
import User from "../models/user.js";

const router = express.Router();

router.post('/', async (req, res, next) => {
  // Create a new document from the JSON in the request body
  const newUser = new User(req.body);

  // Save that document
  const savedUser = await newUser.save();

  // Send the saved document back as the response.
  res.send(savedUser);
});

router.get("/", async function (req, res, next) {
  const users = await User.find().sort('name').exec();

  res.send(users);
});

export default router;
