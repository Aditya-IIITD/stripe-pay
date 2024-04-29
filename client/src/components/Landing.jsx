import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "../firebase";
import "../styles/landing.css";
import { signInWithRedirect, signInWithEmailAndPassword } from "firebase/auth";
import { Hourglass } from "react-loader-spinner";
import image from "../Logos/Sellerkinblack2.png";

const Landing = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoading(true);
    const listen = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsLoading(false);
        setIsLoggedIn(false);
      } else {
        setIsLoading(false);
        setIsLoggedIn(true);
        navigate("/dashboard");
      }
    });

    return () => {
      listen();
    };
  }, []);

  const handleGoogleAuth = (e) => {
    e.preventDefault();
    signInWithRedirect(auth, provider)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
  };

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

  if (isLoading) {
    return (
      <div className="loader">
        <Hourglass color="#0056b3" />;
      </div>
    );
  }
  return (
    <div className="landing-body">
      <div className="content">
        <div className="left">
          <Link to="/" className="name">
            <img src={image} className="" id="logohome" />
          </Link>
          <h1>Sign in to Sellerkin</h1>
          <p className="desc">Welcome back!</p>
          <div className="buttons ">
            <button className="googleauth" onClick={handleGoogleAuth}>
              {" "}
              <img
                src="https://cdn-icons-png.flaticon.com/128/2702/2702602.png"
                style={{ height: "18px" }}
              />
              Continue with Google
            </button>
            <p>OR</p>
            <form className="formlogin" onSubmit={handleSignIn}>
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  onChange={handleEmailChange}
                  value={email}
                  id="email"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  onChange={handlePasswordChange}
                  value={password}
                  id="password"
                />
              </div>
              <button className=" signup" type="submit">
                Sign in with email
              </button>
            </form>
            <p>
              Didn't have an account?&nbsp;
              <Link to="/signup" className="link">
                <b>Sign up</b>
              </Link>
            </p>
          </div>
        </div>
        <div className="right">
          {/* <img src="/Sellerkin_mockup_1.png" /> */}
        </div>
      </div>
    </div>
  );
};

export default Landing;
