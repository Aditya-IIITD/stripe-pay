const express = require("express");
const ShortnerController = require("./shortner.controller.js");

const shortnerRouter = express.Router();
const shortController = new ShortnerController();

shortnerRouter.post("/shortenlink", (req, res) => {
  shortController.shortenLink(req, res);
});

shortnerRouter.post("/getuserdata", (req, res) => {
  shortController.getUserData(req, res);
});

module.exports = shortnerRouter;
