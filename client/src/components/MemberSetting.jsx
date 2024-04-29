import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  query,
  collection,
  where,
  getDocs,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import DisplayUpdateAccess from "./DisplayUpdateacces";
import "../styles/dashboard.css";
import { handleremovemember } from "../utils/handleremovemember";
import AddCredits from "./AddCredits";
import { handleAddCredits } from "../utils/handleAddCredits";
import "../styles/MemberSetting.css"
import Addmember from "./Addmember";
import Addmemberdropdown from "./Addmemberdropdown";

const fetchAddedMembers = async (uid, setAddedMembers) => {
  try {
    const q = query(collection(db, "credits"), where("user_id", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      console.log(userDoc);
      const currentMembers = await userDoc.data().addedmembers;
      querySnapshot.forEach((doc) => {});
      setAddedMembers(currentMembers); // Set the added members array to state
      console.log(currentMembers);
    } else {
      console.log("No documents found.");
      setAddedMembers([]); // If no documents found, set empty array to state
    }
  } catch (error) {
    console.error("Error fetching added members:", error);
  }
};

const MemberSetting = () => {
  const [authUser, setAuthUser] = useState(100);
  const [addedMembers, setAddedMembers] = useState([]);
  const [Product_finder, setProduct_finder] = useState(false);
  const [Listing_analyzer, setListing_analyzer] = useState(false);
  const [keyword_finder, setKeyword_finder] = useState(false);
  const [fee_calculator, setFee_calculator] = useState(false);
  const [Shop_analysis, setShop_analysis] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [cshowPopup, setcShowPopup] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // setAuthUser(null);
        navigate("/signin");
      } else {
        setAuthUser(user);
        setCredits(user.uid);
        console.log("akjshfkjahfkjashf hi hio hi", user.uid);
      }
    });

    return () => {
      listen();
    };
  }, []);
  useEffect(() => {
    // Fetch added members when authUser exists

    if (authUser && authUser.uid) {
      console.log("hi");
      console.log(authUser.uid);
      fetchAddedMembers(authUser.uid, setAddedMembers);
      console.log("hi yo yo ");
      console.log(addedMembers);
    }
  }, [authUser]);
  const handleRemoveMember = async (uid, email) => {
    try {
      const response = await handleremovemember(uid, email);

      if (response.ok) {
        setAlertMessage(`Successfully removed ${email} from added members.`);
        window.location.reload(); // Refresh the page
      } else {
        setAlertMessage(response.message || "Error removing member.");
      }
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("An error occurred while removing the member.");
    }
  };

  const checkAccess = async (email) => {
    try {
      const q = query(collection(db, "credits"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("User profile not found.");
        alert("Please try again");
        return;
      }

      const userDoc = querySnapshot.docs[0];

      // Set access status based on fetched data
      setFee_calculator(await userDoc.data().Fee_calculator);
      setKeyword_finder(await userDoc.data().keyword_finder);
      setListing_analyzer(await userDoc.data().Listing_analyzer);
      setProduct_finder(await userDoc.data().Product_finder);
      setShop_analysis(await userDoc.data().Shop_analysis);
      console.log(userDoc);

      // Store the selected user for displaying in the pop-up
      setSelectedUser({ email, ...userDoc.data() });

      // Show the pop-up
      setShowPopup(true);
    } catch (error) {
      console.error("Error checking access:", error);
    }
  };

  const setCredits = async (uid) => {
    const q = query(collection(db, "credits"), where("user_id", "==", uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("User profile not found.");
      return;
    }
  };
  const handleCreditPlusClick = async (uid, email) => {
    setSelectedEmail(email);
    console.log(email);
    setcShowPopup(true);
  };
  const closePopup = () => {
    setcShowPopup(false);
  };
  const handleButtonClick = () => {
    setShowDropdown(!showDropdown); // Toggle the visibility of the dropdown on button click
  };

  return (
    <div>
      <div className="addmembers">
      
      
        <div className="dropdownContent">
          {/* Render your component here */}
          <Addmemberdropdown/>
        </div>

    </div>
      
      <div className="Access">
        {/* Display the names of added members and create buttons for each */}
        <h4>Current member</h4>
        <ul>
          {addedMembers.slice(1).map((addedUser, index) => (
            <li key={index}>
              {addedUser}
              <button onClick={() => checkAccess(addedUser)}>
                Check Access
              </button>
              <button
                 style={{backgroundColor:"green"}}
                onClick={() => handleCreditPlusClick(authUser.uid, addedUser)}
              >
                credits+
              </button>
              <button
               style={{backgroundColor:"red"}}
                onClick={() => handleRemoveMember(authUser.uid, addedUser)}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Show pop-up */}
      {showPopup && selectedUser && (
        <DisplayUpdateAccess
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          selectedUser={selectedUser}
        />
      )}
      {cshowPopup && (
        <div className="popup-background">
          <div className="popup-content">
            <button onClick={closePopup}>Back</button>
            <AddCredits
              email={selectedEmail}
              uid={authUser.uid}
              handleAddCredits={handleAddCredits}
            />
          </div>
        </div>
      )}
      
    </div>
  );
};

export default MemberSetting;
