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
import "../styles/Setting.css";
import { NavLink } from "react-router-dom";
import MemberSetting from "./MemberSetting";
import GeneralSetting from "./GeneralSetting";
import BonusSetting from "./BonusSetting";
import BillingSetting from "./BillingSetting";

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

const Setting = () => {
  const [authUser, setAuthUser] = useState(100);
  const [addedMembers, setAddedMembers] = useState([]);
  const [Product_finder, setProduct_finder] = useState(false);
  const [Listing_analyzer, setListing_analyzer] = useState(false);
  const [keyword_finder, setKeyword_finder] = useState(false);
  const [fee_calculator, setFee_calculator] = useState(false);
  const [Shop_analysis, setShop_analysis] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSection, setSelectedSection] = useState("General");
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
  const handleSectionClick = (section) => {
    setSelectedSection(section);
    console.log("Selected Section:", section);
  };

  const renderSectionContent = () => {
    switch (selectedSection) {
      case "General":
        return (
          <div>
            <h2 className="setHead">General Settings</h2>
            <GeneralSetting />
          </div>
        );
      case "Members":
        return (
          <div>
            <h2 className="setHead">Member Settings</h2>
            <MemberSetting />
          </div>
        );
      case "Bonus":
        return (
          <div>
            <h2 className="setHead">Bonus Settings</h2>
            <BonusSetting />
          </div>
        );
      case "Billing":
        return (
          <div>
            <h2 className="setHead">Billing Settings</h2>
            <BillingSetting />
          </div>
        );
      default:
        return null;
    }
  };

  const getButtonClass = (section) => {
    return selectedSection === section ? "active" : "";
  };

  return (
    <div className="settings-container">
      <nav className="snavbar" style={{ color: "white" }}>
        <ul>
          <li
            style={{ display: "flex", alignItems: "center", marginLeft: "3px" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="white"
              style={{ marginRight: "10px" }} // Adjust the margin as needed
            >
              <path d="M 22.205078 2 A 1.0001 1.0001 0 0 0 21.21875 2.8378906 L 20.246094 8.7929688 C 19.076509 9.1331971 17.961243 9.5922728 16.910156 10.164062 L 11.996094 6.6542969 A 1.0001 1.0001 0 0 0 10.708984 6.7597656 L 6.8183594 10.646484 A 1.0001 1.0001 0 0 0 6.7070312 11.927734 L 10.164062 16.873047 C 9.583454 17.930271 9.1142098 19.051824 8.765625 20.232422 L 2.8359375 21.21875 A 1.0001 1.0001 0 0 0 2.0019531 22.205078 L 2.0019531 27.705078 A 1.0001 1.0001 0 0 0 2.8261719 28.691406 L 8.7597656 29.742188 C 9.1064607 30.920739 9.5727226 32.043065 10.154297 33.101562 L 6.6542969 37.998047 A 1.0001 1.0001 0 0 0 6.7597656 39.285156 L 10.648438 43.175781 A 1.0001 1.0001 0 0 0 11.927734 43.289062 L 16.882812 39.820312 C 17.936999 40.39548 19.054994 40.857928 20.228516 41.201172 L 21.21875 47.164062 A 1.0001 1.0001 0 0 0 22.205078 48 L 27.705078 48 A 1.0001 1.0001 0 0 0 28.691406 47.173828 L 29.751953 41.1875 C 30.920633 40.838997 32.033372 40.369697 33.082031 39.791016 L 38.070312 43.291016 A 1.0001 1.0001 0 0 0 39.351562 43.179688 L 43.240234 39.287109 A 1.0001 1.0001 0 0 0 43.34375 37.996094 L 39.787109 33.058594 C 40.355783 32.014958 40.813915 30.908875 41.154297 29.748047 L 47.171875 28.693359 A 1.0001 1.0001 0 0 0 47.998047 27.707031 L 47.998047 22.207031 A 1.0001 1.0001 0 0 0 47.160156 21.220703 L 41.152344 20.238281 C 40.80968 19.078827 40.350281 17.974723 39.78125 16.931641 L 43.289062 11.933594 A 1.0001 1.0001 0 0 0 43.177734 10.652344 L 39.287109 6.7636719 A 1.0001 1.0001 0 0 0 37.996094 6.6601562 L 33.072266 10.201172 C 32.023186 9.6248101 30.909713 9.1579916 29.738281 8.8125 L 28.691406 2.828125 A 1.0001 1.0001 0 0 0 27.705078 2 L 22.205078 2 z M 23.056641 4 L 26.865234 4 L 27.861328 9.6855469 A 1.0001 1.0001 0 0 0 28.603516 10.484375 C 30.066026 10.848832 31.439607 11.426549 32.693359 12.185547 A 1.0001 1.0001 0 0 0 33.794922 12.142578 L 38.474609 8.7792969 L 41.167969 11.472656 L 37.835938 16.220703 A 1.0001 1.0001 0 0 0 37.796875 17.310547 C 38.548366 18.561471 39.118333 19.926379 39.482422 21.380859 A 1.0001 1.0001 0 0 0 40.291016 22.125 L 45.998047 23.058594 L 45.998047 26.867188 L 40.279297 27.871094 A 1.0001 1.0001 0 0 0 39.482422 28.617188 C 39.122545 30.069817 38.552234 31.434687 37.800781 32.685547 A 1.0001 1.0001 0 0 0 37.845703 33.785156 L 41.224609 38.474609 L 38.53125 41.169922 L 33.791016 37.84375 A 1.0001 1.0001 0 0 0 32.697266 37.808594 C 31.44975 38.567585 30.074755 39.148028 28.617188 39.517578 A 1.0001 1.0001 0 0 0 27.876953 40.3125 L 26.867188 46 L 23.052734 46 L 22.111328 40.337891 A 1.0001 1.0001 0 0 0 21.365234 39.53125 C 19.90185 39.170557 18.522094 38.59371 17.259766 37.835938 A 1.0001 1.0001 0 0 0 16.171875 37.875 L 11.46875 41.169922 L 8.7734375 38.470703 L 12.097656 33.824219 A 1.0001 1.0001 0 0 0 12.138672 32.724609 C 11.372652 31.458855 10.793319 30.079213 10.427734 28.609375 A 1.0001 1.0001 0 0 0 9.6328125 27.867188 L 4.0019531 26.867188 L 4.0019531 23.052734 L 9.6289062 22.117188 A 1.0001 1.0001 0 0 0 10.435547 21.373047 C 10.804273 19.898143 11.383325 18.518729 12.146484 17.255859 A 1.0001 1.0001 0 0 0 12.111328 16.164062 L 8.8261719 11.46875 L 11.523438 8.7734375 L 16.185547 12.105469 A 1.0001 1.0001 0 0 0 17.28125 12.148438 C 18.536908 11.394293 19.919867 10.822081 21.384766 10.462891 A 1.0001 1.0001 0 0 0 22.132812 9.6523438 L 23.056641 4 z M 25 17 C 20.593567 17 17 20.593567 17 25 C 17 29.406433 20.593567 33 25 33 C 29.406433 33 33 29.406433 33 25 C 33 20.593567 29.406433 17 25 17 z M 25 19 C 28.325553 19 31 21.674447 31 25 C 31 28.325553 28.325553 31 25 31 C 21.674447 31 19 28.325553 19 25 C 19 21.674447 21.674447 19 25 19 z"></path>
            </svg>
            <h2 style={{ margin: "0" }}>Settings</h2>
          </li>
          <li>
            <button onClick={() => navigate("/dashboard")}>DashBoard</button>
          </li>
          <li>
            <button
              className={getButtonClass("General")}
              onClick={() => handleSectionClick("General")}
            >
              General
            </button>
          </li>

          <li>
            <button
              className={getButtonClass("Members")}
              onClick={() => handleSectionClick("Members")}
            >
              {" "}
              Member
            </button>
          </li>

          <li>
            <button
              className={getButtonClass("Bonus")}
              onClick={() => handleSectionClick("Bonus")}
            >
              {" "}
              Bonus
            </button>
          </li>

          <li>
            <button
              className={getButtonClass("Billing")}
              onClick={() => handleSectionClick("Billing")}
            >
              Billing
            </button>
          </li>
        </ul>
      </nav>

      <div className="Setting_content">{renderSectionContent()}</div>
    </div>
  );
};

export default Setting;
