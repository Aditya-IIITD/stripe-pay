import React ,{useState,useEffect}from 'react'
import { Link, useNavigate } from "react-router-dom";
import userSignOut from '../utils/userSignOut';
import "../styles/GeneralSetting.css"
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const GeneralSetting = () => {
  const [authUser, setAuthUser] = useState(100);
  const navigate = useNavigate();
  const [plan_level, setPlan_level] = useState(null);

  useEffect(() => {
  
  
    const listen = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/signin");
      } else {
        setAuthUser(user);
        console.log("User signed in:", user);
    
      }
    });
  
    return () => {
      listen(); // Cleanup the auth state listener
    };
  }, [navigate]);



 


  return (
    <div className="Gesetting">
       <div className="currentuser">
        <p>Signed As</p>
        <p>{authUser.email}</p>
    
        <div className="changepass">
        <p>Reset Your Password</p>
        <button style={{ marginTop: "5px" }}>
                <Link to="/forgotpassword">Change Password</Link>
            </button>
        </div>
        
        </div>
    </div>
  )
}

export default GeneralSetting
