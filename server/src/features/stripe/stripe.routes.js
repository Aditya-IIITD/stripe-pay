import express from "express";
import StripeController from "./stripe.controller.js";

const stripeRouter = express.Router();

const stripecontroller = new StripeController();

stripeRouter.post(
  "/api/stripe",
  express.json(),
  stripecontroller.createSession
);

stripeRouter.get(
  "/session_status",
  express.json(),
  stripecontroller.getSession
);

stripeRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripecontroller.webHook
);

stripeRouter.get("/random", stripecontroller.RandomPassword);

export default stripeRouter;
