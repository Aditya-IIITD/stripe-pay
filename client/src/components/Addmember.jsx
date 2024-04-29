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

const fetchcredit = async (uid, setHavecredits) => {
  try {
    const q = query(collection(db, "credits"), where("user_id", "==", uid));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const member1 =
          querySnapshot._snapshot.docs.keyedMap.root.value.data.value.mapValue
            .fields.credit_limit?.integerValue || 0; // Get member_1 value
        const member2 =
          querySnapshot._snapshot.docs.keyedMap.root.value.data.value.mapValue
            .fields.credits?.integerValue || 0; // Get member_2 value
        setHavecredits(member1 - member2);
        console.log(member1, member2);
      });
    } else {
      console.log("No documents found.");
      setHavecredits(); // If no documents found, set empty array to state
    }
  } catch (error) {
    console.error("Error fetching added members:", error);
  }
};

const Addmember = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);
  const [tokensToAllocate, setTokensToAllocate] = useState(0); // New state for allocated tokens
  const [Havecredits, setHavecredits] = useState(0);
  const [accessPermissions, setAccessPermissions] = useState({
    Product_finder: false,
    Listing_analyzer: false,
    keyword_finder: false,
    Fee_calculator: false,
    Shop_analysis: false,
  });

  useEffect(() => {
    // setAreCategoriesLoading(true);
    const listen = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // setAuthUser(null);
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
    // Fetch added members when authUser exists

    if (authUser && authUser.uid) {
      console.log("hi");
      console.log(authUser.uid);
      fetchcredit(authUser.uid, setHavecredits);
    }
  }, [authUser]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleTokensChange = (event) => {
    setTokensToAllocate(parseInt(event.target.value)); // Parse the input value to an integer or default to 0
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleAccessChange = (event) => {
    const { name, checked } = event.target;
    setAccessPermissions((prevPermissions) => ({
      ...prevPermissions,
      [name]: checked,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    if (authUser) {
      const creditUpdateResponse = await handleaddmembers(
        authUser.uid,
        email,
        tokensToAllocate,
        authUser.email
      );

      if (creditUpdateResponse?.ok) {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          console.log("usercredential", userCredential);
          alert("Member created and added!");

          const newMember = {
            email: email, // Email of the new member
            // Other relevant details of the new member
          };

          const creditsDocRef = await addDoc(collection(db, "credits"), {
            user_id: userCredential.user.uid,
            email: email,
            credits: 0,
            credit_limit: tokensToAllocate,
            addedmembers: [newMember], // Array containing details of added members
            addmembers: 0,
            addmember_limit: 0,
            Product_finder: accessPermissions.Product_finder,
            Listing_analyzer: accessPermissions.Listing_analyzer,
            keyword_finder: accessPermissions.keyword_finder,
            Fee_calculator: accessPermissions.Fee_calculator,
            Shop_analysis: accessPermissions.Shop_analysis,
            plan_level: "Member",
          });
          console.log("Document updated with ID: ", creditsDocRef.id);
          signOut(auth);
        } catch (error) {
          alert("member added");
          console.log(error);
        }
      } else {
        alert("Problem occured");
      }
    } else {
      navigate("/signin");
    }
  };

  const copyCredentials = () => {
    const credentials = `Email: ${email}\nPassword: ${password}`;
    navigator.clipboard
      .writeText(credentials)
      .then(() => {
        alert("Credentials copied!");
      })
      .catch((error) => {
        console.error("Failed to copy:", error);
      });
  };

  return (
    <div className="signup-body" style={{ font: "small-caption" }}>
      <Link to="/dashboard" id="home-link">
        Back
      </Link>
      <form onSubmit={handleSignUp}>
        <h2>Add Member</h2>
        <p>Hello! Let's add your Team</p>

        <label htmlFor="username">Email</label>
        <input
          onChange={handleEmailChange}
          value={email}
          type="text"
          placeholder="Enter your Email"
          id="username"
        />

        <label htmlFor="password">Password</label>
        <input
          onChange={handlePasswordChange}
          value={password}
          type="password"
          placeholder="Enter a dummy Password"
          id="password"
        />
        <p>
          Note:Pls give the access to required features while <br></br>"addinng
          new member to platform"
        </p>
        <div
          className="accessgiver"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="checkbox"
                name="Product_finder"
                checked={accessPermissions.Product_finder}
                onChange={handleAccessChange}
              />
              <span>Product Finder</span>
            </label>
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="checkbox"
                name="Fee_calculator"
                checked={accessPermissions.Fee_calculator}
                onChange={handleAccessChange}
              />
              <span>Fee Calculator</span>
            </label>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="checkbox"
                name="Listing_analyzer"
                checked={accessPermissions.Listing_analyzer}
                onChange={handleAccessChange}
              />
              <span>Listing Analyzer</span>
            </label>
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="checkbox"
                name="Shop_analysis"
                checked={accessPermissions.Shop_analysis}
                onChange={handleAccessChange}
              />
              <span>Shop Analysis</span>
            </label>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="checkbox"
                name="keyword_finder"
                checked={accessPermissions.keyword_finder}
                onChange={handleAccessChange}
              />
              <span>Keyword Finder</span>
            </label>
          </div>
        </div>

        <button onClick={copyCredentials}>
          Copy Credentials and Add Member
        </button>
        <p>
          Note:If the user is new After adding member you need<br></br> to
          signin again{" "}
        </p>
      </form>
    </div>
  );
};

export default Addmember;
