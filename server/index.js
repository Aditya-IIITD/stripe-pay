import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import stripeRouter from "./src/features/stripe/stripe.routes.js";

const app = express();

app.use(cors());

app.use("/", stripeRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("Server started on port 8000");
});
