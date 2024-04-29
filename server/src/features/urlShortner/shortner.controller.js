const ShortnerRepository = require("./shortner.repository.js");

class ShortnerController {
  constructor() {
    this.repository = new ShortnerRepository();
  }

  async shortenLink(req, res) {
    try {
      const response = await this.repository.shortenLink(req.body);
      res.status(200).send(response);
    } catch (err) {
      console.log("Error: ", err);
      res.status(500).send({ status: false, msg: err.message });
    }
  }

  async getUserData(req, res) {
    try {
      res.send({ status: true, msg: "Shortening pls wait" });
    } catch (err) {
      console.log("Error: ", err);
      res.status(500).send({ status: false, msg: err.message });
    }
  }
}

module.exports = ShortnerController;
