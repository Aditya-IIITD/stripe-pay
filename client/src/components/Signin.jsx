import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/login.css";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { Link } from "react-router-dom";

const Signin = () => {
  //   const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authUser, setAuthUser] = useState(null);
  const [plan_level, setPlan_level] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [showOverlay, setShowOverlay] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.get("sid")) {
        const email = searchParams.get("email");
        const plan = searchParams.get("selectedPlan");
        const password = searchParams.get("password");
        if (plan === "1") {
          setPlan_level("Basic");
        } else if (plan === "2") {
          setPlan_level("Standard");
        } else if (plan === "3") {
          setPlan_level("Premium");
        }

        console.log(email, plan, password);
        setEmail(email);
        setPassword(password);

        setShowOverlay(true);
        const sid = searchParams.get("sid");
        console.log(sid);
        try {
          const response = await fetch(
            `https://sellerkinstripebe-qpcv.onrender.com/session_status?session_id=${sid}`
          );
          const session = await response.json();
          console.log(session);
          if (session.status === "complete") {
            if (session.payment_status === "paid") {
              console.log(session.payment_status);
              createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                  console.log(userCredential);

                  const newMember = {
                    email: email, // Email of the new member
                    // Other relevant details of the new member
                  };

                  const creditsDocRef = await addDoc(
                    collection(db, "credits"),
                    {
                      user_id: userCredential.user.uid,
                      email: email,
                      credits: 0,
                      credit_limit: 100,
                      addedmembers: [newMember], // Array containing details of added members
                      addmembers: 0,
                      addmember_limit: 14,
                      Product_finder: true,
                      Listing_analyzer: true,
                      keyword_finder: true,
                      Fee_calculator: true,
                      Shop_analysis: true,
                      plan_level: plan_level,
                    }
                  );
                  console.log("Document updated with ID: ", creditsDocRef.id);
                })
                .catch((error) => {
                  console.log(error);
                });

              fetch("https://sellerkinmainbe.onrender.com/sendemail", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
              })
                .then((response) => {
                  if (response.ok) {
                    // Request was successful (status code 2xx)
                    alert("Password sent!");
                    return response.json(); // If the response contains JSON data
                  } else {
                    // Handle errors or non-2xx status codes here
                    throw new Error("Network response was not ok.");
                  }
                })
                .then((data) => {
                  // Handle the data received from the server after a successful request
                  console.log(data);
                })
                .catch((error) => {
                  // Handle any errors that occurred during the fetch
                  console.error(
                    "There was a problem with the fetch operation:",
                    error
                  );
                });
              alert(
                "Payment successful!. Please check your email for password"
              );
              navigate("/signin");

              setShowOverlay(false);
            } else {
              console.log(session.payment_status);
              alert("Payment failed!");
            }
          }
        } catch (error) {
          console.error("Error fetching session status:", error);
        }
      }
    };

    fetchData(); // Call the async function here
  }, [location.search]);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      }
    });

    return () => {
      listen();
    };
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // console.log(userCredential.user?.email);
        alert(`logged in as ${userCredential.user?.email}`);
        console.log(userCredential);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="signup-body">
      {showOverlay && (
        <div className="overlay">
          <div
            className="overlay-message"
            style={{ display: "flex", flexDirection: "column" }}
          >
            Keep this page open and continue the payment process ,Once payement
            is done pls click
            <button
              className="overlay-message"
              onClick={() => {
                window.location.reload();
              }}
            >
              Check status
            </button>
          </div>
        </div>
      )}
      {authUser && (
        <Link to="/" id="home-link">
          Home
        </Link>
      )}
      <form onSubmit={handleSignIn}>
        <h2>Log in to Sellerkin</h2>
        <p>Welcome back! Please Enter your details to proceed. </p>
        <label for="username">Email</label>
        <input
          onChange={handleEmailChange}
          value={email}
          type="text"
          placeholder="Enter your Email"
          id="username"
        />
        <label for="password">Password</label>
        <input
          onChange={handlePasswordChange}
          value={password}
          type="password"
          placeholder="Enter your Password"
          id="password"
        />
        <Link to="/forgotpassword" id="forgot-password-link">
          Forgot password
        </Link>
        <button>Log In</button>
        <div className="signup-option">
          or <Link to="/signup">Create an account</Link>
        </div>
        {/* <div className="signup-option">
          or <Link to="/plans">Get a account</Link>
        </div> */}
        {/* <div class="social">
          <div class="go">
            <i class="fab fa-google"></i> Google
          </div>
          <div class="fb">
            <i class="fab fa-facebook"></i> Facebook
          </div>
        </div> */}
      </form>
    </div>
  );
};

export default Signin;
