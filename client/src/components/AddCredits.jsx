import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { handleaddmembers } from "../utils/handleaddmembers";
import {
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import "../styles/AddCredits.css"

const fetchCredit = async (uid, setHaveCredits) => {
  try {
    const q = query(collection(db, "credits"), where("user_id", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const member1 = data.credit_limit || 100; // Get member_1 value
        const member2 = data.credits || 100; // Get member_2 value
        setHaveCredits(member1 - member2);
      });
    } else {
      console.log("No documents found.");
      setHaveCredits(0); // If no documents found, set credits to 0
    }
  } catch (error) {
    console.error("Error fetching credits:", error);
  }
};

const AddCredits = ({ uid, email, handleAddCredits }) => {
  const [creditsToAdd, setCreditsToAdd] = useState(0);
  const [haveCredits, setHaveCredits] = useState(0);
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/signin");
      } else {
        setAuthUser(user);
      }
    });

    return () => {
      listen();
    };
  }, []);

  useEffect(() => {
    if (authUser && authUser.uid) {
      fetchCredit(authUser.uid, setHaveCredits);
    }
  }, [authUser]);

  const handleCreditsChange = (e) => {
    setCreditsToAdd(e.target.value);
  };

  const handleAddClick = async () => {
   const checker= await handleAddCredits(uid, email, creditsToAdd)
    if(checker?.ok)
    {
      alert("Credits added successfully")
      console.log(checker)
    }
    else{
      alert("credits not added")
      console.log(checker)
    }
  };

  return (
    <div className="add-credits-popup">
      <h2>Add Credits: {email}</h2>
      <label>
        Credits:
        <input
          type="number"
          value={creditsToAdd}
          onChange={handleCreditsChange}
        />
      </label>
      <button onClick={handleAddClick}>Add Credits</button>
      <p style={{ alignSelf: "initial" }}>
        Note: The credits will be allocated from your {haveCredits} credits
      </p>
    </div>
  );
};

export default AddCredits;
