import express from "express";

const router = express.Router();

function homePage(req, res, next) {
  res.send("Ignition!!!!!!!");
}

router.get("/", homePage);

export default router;
