// const { urls } = require("../../../models");
const { db } = require("../../../models");
const urls = require("../../../models/urls.js")(db.sequelize);
const generateRandomKey = require("../../functions/shortCode.js");
class ShortnerRepository {
  async shortenLink(data) {
    const shortcode = generateRandomKey();
    await urls.create({
      user_id: data.uid,
      original_url: data.url,
      short_code: shortcode,
    });
    return { status: true, data: data };
  }
}

module.exports = ShortnerRepository;
