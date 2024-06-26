/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

app.all("/application/**", async (req, res) => {
  try {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const targetUrl = `${backendUrl}${req.originalUrl}`;
    const backendResponse = await fetch(targetUrl, {
      method: req.method,
      headers: req.headers,
      body: req.method === "GET" ? null : req.body,
    });
    const data = await backendResponse.json();
    const status = backendResponse.status;

    res.status(status).json(data);
  } catch (error) {
    res.status(500).send("Error proxying request to backend.");
  }
});

exports.proxyToBackend = functions.https.onRequest(app);
