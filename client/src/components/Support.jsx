import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/dashboard.css";
import Navbar from "./Navbar";
import "../styles/FeeCalculator.css";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { db } from "../firebase";

const Support = () => {
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/signin");
      } else setAuthUser(user);
    });

    return () => {
      listen();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="dashboard body">
        <Navbar page={8} />
        <main>
          <div className="top">
            <h2>User Support</h2>
          </div>
        </main>
      </div>
      <div>
        <main className="calculator-container">
          <h4>Email: Sellerkin@gmail.com</h4>
        </main>
      </div>
    </>
  );
};

export default Support;
