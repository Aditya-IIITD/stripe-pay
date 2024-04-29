const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const shortnerRouter = require("./src/features/ListingAnalyzer/shortner.routes.js");
const { db } = require("./models/index.js");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/shortner", shortnerRouter);
app.use("/bit");

const PORT = process.env.PORT || 4100;

db.sequelize
  .sync()
  .then(() => {
    console.log("SQL connected...");
    app.listen(PORT, () => {
      console.log(`Server is listening at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while syncing models: ", err.message);
  });
