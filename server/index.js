const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SKT);

const app = express();
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

app.use(cors());

app.post("/api/stripe", express.json(), async (req, res) => {
  try {
    const user = req.body;
    console.log(user);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Sellerkin Plan- ${user.selectedPlan}`,
            },
            unit_amount: user.bill * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/",
      cancel_url: "http://localhost:3000/",
      metadata: {
        plan_name: user.selectedPlan, // Add plan name to metadata
      },
    });

    console.log(session.id);
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server Error");
  }
});

app.get("/session_status", express.json(), async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );

    let customerData = {};
    if (session.customer) {
      const customer = await stripe.customers.retrieve(session.customer);
      customerData = {
        customer_email: customer.email,
      };
    }

    console.log(customerData);
    res.send({
      status: session.status,
      payment_status: session.payment_status,
      ...customerData,
    });
  } catch (error) {
    console.error("Error retrieving session status:", error);
    res.status(500).send("Error retrieving session status");
  }
});

const endpointSecret = process.env.ENDPOINT_SECRET;
//webhook API
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event, email;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log("Err: ", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    console.log(2, event.type);

    if (event.type === "checkout.session.completed") {
      // Saving the payment details in the database
      const session = event.data.object;

      // Access the customer's email
      const customerEmail = session.customer_email;
      email = customerEmail;

      // Do something with the customerEmail (e.g., send a confirmation email)
      console.log("Customer Email:", customerEmail);

      try {
        // nodemailer transporter (for the credentials and authorization)
        // using Brevo for SMTP (visit its documentation for more details)
        let transporter = nodemailer.createTransport({
          host: "smtp-relay.brevo.com",
          // service: "Gmail",
          port: 587,
          // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_USER, // Your Brevo email
            pass: process.env.EMAIL_PASS, // Your Brevo password
          },
        });

        // HTML and CSS content for the email
        const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
      }
      .logo {
        width: 100px;
      }
      .content {
        text-align: center;
        padding: 20px 0;
      }
      .thank-you {
        font-size: 24px;
        font-weight: bold;
        color: #3498db;
      }
      .message {
        font-size: 16px;
        color: #333;
      }
      .button {
        display: inline-block;
        background-color: #3498db;
        color: #fff;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 20px;
      }
      .button:hover {
        background-color: #2780b9;
      }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
         
        </div>
        <div class="content">
          <p class="thank-you">Thank you for choosing Sellerkin!</p>
          <p class="message">
            We appreciate your trust in our Etsy analysis tool. We're excited to have you on board.
            <br>
            <br>
            Your Login Credentials:
            <br>
            Your Email(Username): <b>${customerEmail}</b>
            Your Password(Token): <b>"123456"</b>
          </p>
          <a class="button" href="https://sellerkin.com/">Click Here To Login To Your Premium Account</a>
        </div>
      </div>
    </body>
    </html>
    `;

        // sending email and providing data (what to send, whom to send, etc)
        let info = await transporter.sendMail({
          from: "janager8860000281@gmail.com", // Sender address
          to: customerEmail, // Recipient's email
          subject: "Password For Your Transaction", // Subject line
          text: emailContent, // Plain text body
        });

        // saving the user in firestore(by firebase) database after the mail is sent to the user
        // make sure to modify below block as per requirements

        // ...

        res.send("Mail sent.");
      } catch (error) {
        console.error("Error creating user:", error.message);
      }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).send(email);
  }
);

//Email API

app.post("/sendemail", express.json(), async (req, res) => {
  // fetch email from frontend
  const { email, password } = req.body;

  try {
    // nodemailer transporter (for the credentials and authorization)
    // using Brevo for SMTP (visit its documentation for more details)
    let transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      // service: "Gmail",
      port: 587,
      // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Your Brevo email
        pass: process.env.EMAIL_PASS, // Your Brevo password
      },
    });

    // HTML and CSS content for the email
    const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
      }
      .logo {
        width: 100px;
      }
      .content {
        text-align: center;
        padding: 20px 0;
      }
      .thank-you {
        font-size: 24px;
        font-weight: bold;
        color: #3498db;
      }
      .message {
        font-size: 16px;
        color: #333;
      }
      .button {
        display: inline-block;
        background-color: #3498db;
        color: #fff;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 20px;
      }
      .button:hover {
        background-color: #2780b9;
      }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
         
        </div>
        <div class="content">
          <p class="thank-you">Thank you for choosing Sellerkin!</p>
          <p class="message">
            We appreciate your trust in our Etsy analysis tool. We're excited to have you on board.
            <br>
            <br>
            Your Login Credentials:
            <br>
            Your Email(Username): <b>${email}</b>
            Your Password(Token): <b>${password}</b>
          </p>
          <a class="button" href="https://sellerkin.com/">Click Here To Login To Your Premium Account</a>
        </div>
      </div>
    </body>
    </html>
    `;

    // sending email and providing data (what to send, whom to send, etc)
    let info = await transporter.sendMail({
      from: "janager8860000281@gmail.com", // Sender address
      to: email, // Recipient's email
      subject: "Password For Your Transaction", // Subject line
      text: emailContent, // Plain text body
    });

    // confirmation of sent email
    console.log("Message sent: %s", info.messageId);

    // saving the user in firestore(by firebase) database after the mail is sent to the user
    // make sure to modify below block as per requirements

    // ...

    res.send("Mail sent.");
  } catch (error) {
    console.error("Error creating user:", error.message);
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("Server started on port 8000");
});
