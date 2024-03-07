import "./App.css";
import bootstrap from "bootstrap";
import { loadStripe } from "@stripe/stripe-js";
function App() {
  const handleCheckout = async () => {
    const stripe = await loadStripe(
      "pk_test_51OquEsSHAdAnzs6T9GSja0NzChWFO8DaM0rpT5BmCHu5gcox4WiEMa39iBBJZnKOVCwMBpDYEMaiGgpIGGjz2Ruj00UxaPHneN"
    );

    try {
      const response = await fetch("http://localhost:8000/api/stripe", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedPlan: "MAX", bill: 499 }),
      });

      const session = await response.json();
      console.log(session);
      const result = stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });

      const pollStatus = async () => {
        const sessionStatusResponse = await fetch(
          `http://localhost:8000/session_status?session_id=${session.sessionId}`
        );
        const sessionStatusResult = await sessionStatusResponse.json();
        if (
          sessionStatusResult.status === "completed" &&
          sessionStatusResult.payment_status === "paid"
        ) {
          console.log(sessionStatusResult);
          console.log("User Email:", sessionStatusResult.customer_email);
        } else {
          // Continue polling until the status is completed
          setTimeout(pollStatus, 2000); // Adjust the polling interval as needed
        }
      };

      // Start polling
      pollStatus();
    } catch (err) {
      console.log("ERROR while fetching create session api: ", err.message);
    }
  };

  return (
    <div className="App">
      <button className="btn btn-success" onClick={handleCheckout}>
        Checkout
      </button>
    </div>
  );
}

export default App;
