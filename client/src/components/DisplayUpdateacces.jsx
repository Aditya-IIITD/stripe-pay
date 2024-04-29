import "../styles/DisplayUpdateacces.css";
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
import "../styles/dashboard.css";

const DisplayUpdateAccess = ({ isOpen, onClose, selectedUser }) => {
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [updatedAccess, setUpdatedAccess] = useState({
    Product_finder: selectedUser.Product_finder,
    Listing_analyzer: selectedUser.Listing_analyzer,
    keyword_finder: selectedUser.keyword_finder,
    Fee_calculator: selectedUser.Fee_calculator,
  });

  const handleUpdate = () => {
    setShowCheckboxes(true);
  };

  const handleCheckboxChange = (field) => {
    setUpdatedAccess({
      ...updatedAccess,
      [field]: !updatedAccess[field],
    });
  };

  const handleCancelUpdate = () => {
    setShowCheckboxes(false);
    // Reset checkboxes to the original status
    setUpdatedAccess({
      Product_finder: selectedUser.Product_finder,
      Listing_analyzer: selectedUser.Listing_analyzer,
      keyword_finder: selectedUser.keyword_finder,
      Fee_calculator: selectedUser.Fee_calculator,
      Shop_analysis: selectedUser.Shop_analysis,
    });
  };

  const handleApplyUpdate = async () => {
    // Logic to apply the updated access settings
    // This can involve sending the updatedAccess object to your backend or updating the state as required
    // For demonstration purposes, log the updated access
    const q = query(
      collection(db, "credits"),
      where("email", "==", selectedUser.email)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No documents found.");
      alert("pls try again");
      return;
    }
    const userDoc = querySnapshot.docs[0];
    console.log(userDoc);

    const userDocRef = doc(db, "credits", userDoc.id);
    await updateDoc(userDocRef, {
      Product_finder: updatedAccess.Product_finder,
      Listing_analyzer: updatedAccess.Listing_analyzer,
      keyword_finder: updatedAccess.keyword_finder,
      Fee_calculator: updatedAccess.Fee_calculator,
      Shop_analysis: updatedAccess.Shop_analysis,
    });

    console.log("Updated access:", updatedAccess);
    setShowCheckboxes(false);
    onClose();
  };

  return (
    <div className={`popup ${isOpen ? "active" : ""}`}>
      <div className="popup-overlay">
        <div className="popup-content">
          <h2>User Access Status</h2>
          <strong>Email:</strong> {selectedUser && selectedUser.email}
          {selectedUser && (
            <div className="access-details">
              {!showCheckboxes ? (
                <>
                  <p>
                    <strong>Product Finder:</strong>{" "}
                    {selectedUser.Product_finder ? "Enabled" : "Disabled"}
                  </p>
                  <p>
                    <strong>Listing Analyzer:</strong>{" "}
                    {selectedUser.Listing_analyzer ? "Enabled" : "Disabled"}
                  </p>
                  <p>
                    <strong>Keyword Finder:</strong>{" "}
                    {selectedUser.keyword_finder ? "Enabled" : "Disabled"}
                  </p>
                  <p>
                    <strong>Fee Calculator:</strong>{" "}
                    {selectedUser.Fee_calculator ? "Enabled" : "Disabled"}
                  </p>
                  <p>
                    <strong>Shop analyzer:</strong>{" "}
                    {selectedUser.Shop_analysis ? "Enabled" : "Disabled"}
                  </p>

                  <button className="update-btn" onClick={handleUpdate}>
                    Update
                  </button>
                  <button className="close-btn" onClick={onClose}>
                    Close
                  </button>
                </>
              ) : (
                <div
                  className="checkboxes"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={updatedAccess.Product_finder}
                      onChange={() => handleCheckboxChange("Product_finder")}
                    />
                    Product Finder
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={updatedAccess.Listing_analyzer}
                      onChange={() => handleCheckboxChange("Listing_analyzer")}
                    />
                    Listing_analyzer
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={updatedAccess.keyword_finder}
                      onChange={() => handleCheckboxChange("keyword_finder")}
                    />
                    Keyword Finder
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={updatedAccess.Fee_calculator}
                      onChange={() => handleCheckboxChange("Fee_calculator")}
                    />
                    Fee calculator
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={updatedAccess.Shop_analysis}
                      onChange={() => handleCheckboxChange("Shop_analysis")}
                    />
                    Shop analyzer
                  </label>
                  {/* Add similar checkbox elements for other fields */}
                  {/* ... */}
                  <button className="apply-btn" onClick={handleApplyUpdate}>
                    Apply
                  </button>
                  <button className="cancel-btn" onClick={handleCancelUpdate}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayUpdateAccess;
