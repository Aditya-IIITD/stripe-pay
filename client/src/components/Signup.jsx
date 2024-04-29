import React, { useState, useEffect } from "react";
import { useNavigate , useLocation } from "react-router-dom";
import "../styles/login.css";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { Link } from "react-router-dom";

const Signup = () => {
  //   const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [showOverlay, setShowOverlay] = useState(false);



  
  
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

  const handleSignUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log(userCredential);
        alert("Account created!");
        const newMember = {
          email: email, // Email of the new member
          // Other relevant details of the new member
        };
        
        const creditsDocRef = await addDoc(collection(db, "credits"), {
          user_id: userCredential.user.uid,
          email: email,
          credits: 0,
          credit_limit: 100,
          addedmembers: [newMember], // Array containing details of added members
          addmembers:0,
          addmember_limit: 14,
          Product_finder:true,
          Listing_analyzer:true,
          keyword_finder:true,
          Fee_calculator:true,
          Shop_analysis:true,
          plan_level:"Basic"
        });
        console.log("Document updated with ID: ", creditsDocRef.id);
        navigate("/signin");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="signup-body">
        
      {authUser && (
        <Link to="/" id="home-link">
          Home
        </Link>
      )}
      <form onSubmit={handleSignUp}>
        <h2>Sign up</h2>
        <p>Hello! Sign up to start a free Sellerkin account. </p>

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

        <button>Create an Account</button>
        <div className="signup-option">
          or <Link to="/signin">Login</Link>
        </div>
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

export default Signup;
