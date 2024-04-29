import React ,{useState,useEffect}from 'react'
import { Link, useNavigate } from "react-router-dom";
import userSignOut from '../utils/userSignOut';
import "../styles/GeneralSetting.css"
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const BillingSetting = () => {
  const [authUser, setAuthUser] = useState(100);
  const navigate = useNavigate();
  const [plan_level, setPlan_level] = useState(null);

  useEffect(() => {
    const fetchPlan = async (user) => {
      if (user) {
        const q = query(collection(db, "credits"), where("user_id", "==", user.uid));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot);
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const plan = data.plan_level;
            
            setPlan_level(plan);
            if(plan_level === undefined){
              setPlan_level("Old user without plan");
            }
            console.log(plan);
          });
        } else {
          console.log("No documents found.");
          alert("Please sign in again");
        }
      }
    };
  
    const listen = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/signin");
      } else {
        setAuthUser(user);
        console.log("User signed in:", user);
        await fetchPlan(user); // Pass the user to fetchPlan
      }
    });
  
    return () => {
      listen(); // Cleanup the auth state listener
    };
  }, [navigate]);



 


  return (
    <div className="Gesetting">
       <div className="currentuser">
        
        <p style={{fontWeight:"bold"}}>Current Plan</p>
        <p>{plan_level}</p>
        
        
        </div>
    </div>
  )
}

export default BillingSetting
