import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { query, collection, where, getDocs } from "firebase/firestore";
import "../styles/dashboard.css";
import Navbar from "./Navbar";

import AddCredits from "./AddCredits";
import { handleAddCredits } from "../utils/handleAddCredits";

const Dashboard = () => {
  const [noOfCreditsUsed, setNoOfCreditsUsed] = useState(0);
  const [creditLimit, setCreditLimit] = useState(-1);
  const [authUser, setAuthUser] = useState(100);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");

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

  const setCredits = async (uid) => {
    const q = query(collection(db, "credits"), where("user_id", "==", uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("User profile not found.");
      return;
    }

    // We assume there's only one document matching the user_id, so we use the first one
    const userDoc = querySnapshot.docs[0];
    const currentCredits = userDoc.data().credits;
    const creditLimit = userDoc.data().credit_limit;

    setNoOfCreditsUsed(currentCredits);
    setCreditLimit(creditLimit);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="dashboard body">
      <Navbar page={1} />
      <main>
        <div className="top">
          <h2>Dashboard</h2>
        </div>
        <div>
          <div className="content">
            <div className="column-1">
              <div></div>
              <div className="credits-wrapper">
                <div>
                  <div>
                    <h4> Credits used: </h4>
                    <p>{`${noOfCreditsUsed}/${creditLimit}`}</p>
                    <svg
                      width="54"
                      height="55"
                      viewBox="0 0 54 55"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => (authUser ? setCredits(authUser.uid) : "")}
                    >
                      <path
                        d="M3.28276 18.7724C2.71654 19.7209 3.02637 20.9487 3.97478 21.5149C4.92319 22.0811 6.15103 21.7713 6.71724 20.8229L3.28276 18.7724ZM48.1544 21.7676C49.2424 21.9584 50.279 21.2312 50.4699 20.1433L53.5803 2.41404C53.7712 1.32608 53.0439 0.289394 51.956 0.0985251C50.868 -0.0923439 49.8313 0.634887 49.6405 1.72284L46.8757 17.4822L31.1164 14.7174C30.0284 14.5265 28.9917 15.2537 28.8009 16.3417C28.61 17.4296 29.3372 18.4663 30.4252 18.6572L48.1544 21.7676ZM6.71724 20.8229C9.92624 15.4478 15.7373 9.26565 22.6925 7.49858C26.0996 6.63296 29.8429 6.80534 33.8445 8.72444C37.8832 10.6613 42.2927 14.4316 46.8627 20.9462L50.1373 18.6491C45.3073 11.7637 40.4126 7.43818 35.5742 5.11776C30.6988 2.77958 25.9921 2.53321 21.7075 3.62175C13.2794 5.76302 6.74043 12.9808 3.28276 18.7724L6.71724 20.8229Z"
                        fill="black"
                      />
                      <path
                        d="M50.7172 35.8228C51.2835 34.8744 50.9736 33.6465 50.0252 33.0803C49.0768 32.5141 47.849 32.8239 47.2828 33.7723L50.7172 35.8228ZM5.8456 32.8276C4.75765 32.6368 3.72095 33.364 3.53009 34.452L0.419695 52.1812C0.228826 53.2691 0.956057 54.3058 2.04401 54.4967C3.13196 54.6876 4.16865 53.9603 4.35952 52.8724L7.12432 37.1131L22.8836 39.8779C23.9716 40.0687 25.0083 39.3415 25.1991 38.2535C25.39 37.1656 24.6628 36.1289 23.5748 35.938L5.8456 32.8276ZM47.2828 33.7723C44.0738 39.1474 38.2627 45.3296 31.3075 47.0966C27.9004 47.9623 24.1571 47.7899 20.1555 45.8708C16.1168 43.9339 11.7073 40.1636 7.13731 33.649L3.86269 35.9461C8.69274 42.8315 13.5874 47.157 18.4258 49.4775C23.3012 51.8156 28.0079 52.062 32.2925 50.9735C40.7206 48.8322 47.2596 41.6144 50.7172 35.8228L47.2828 33.7723Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <div>
                    {(100 * noOfCreditsUsed) / creditLimit}%
                    <div className="progress-bar">
                      <div
                        style={{
                          width: `${(100 * noOfCreditsUsed) / creditLimit}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="column-2">
              <div>
                <h4>Kickstart your journey</h4>
                <ul>
                  <li>
                    <span>URL Shortner</span>
                    <p>Shorten and analyze your long URLs in few seconds</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {showPopup && (
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
      </main>
    </div>
  );
};

export default Dashboard;
