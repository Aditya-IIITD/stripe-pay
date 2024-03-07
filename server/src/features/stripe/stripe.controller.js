import stripe from "stripe";
const stripeInstance = stripe(process.env.STRIPE_SKT);
import { SendEmail, randomPassword } from "../../config/email.js";

class StripeController {
  async createSession(req, res) {
    try {
      const user = req.body;
      console.log(user);
      const session = await stripeInstance.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "USD",
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
  }

  async getSession(req, res) {
    try {
      const session = await stripeInstance.checkout.sessions.retrieve(
        req.query.session_id
      );

      let customerData = {};
      if (session.customer) {
        const customer = await stripeInstance.customers.retrieve(
          session.customer
        );
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
  }

  async webHook(req, res) {
    const endpointSecret = process.env.ENDPOINT_SECRET;
    console.log("Inside webhook");
    const sig = req.headers["stripe-signature"];
    let event, email;
    try {
      event = stripeInstance.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );
      console.log("event: ", event);
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
      const customerEmail = session.customer_details.email;
      email = customerEmail;

      // Do something with the customerEmail (e.g., send a confirmation email)
      console.log("Customer Email:", customerEmail);
      const password = randomPassword();
      await SendEmail(customerEmail, password);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).send("operation completed");
  }

  RandomPassword(req, res) {
    const password = randomPassword();
    res.status(200).send({ status: true, password: password });
  }
}
export default StripeController;
