import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";

export async function handleaddmembers(uid, email, tokens,cemail) {
  try {

    if(cemail===email){
      console.log("You can't add yourself");
      return {
        ok: false,
        message: "You can't add yourself",
      };
    }
    const q = query(collection(db, "credits"), where("user_id", "==", uid));
    
    const eq = query(collection(db, "credits"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    const equerySnapshot = await getDocs(eq);

    if (!equerySnapshot.empty) {
      console.log("If every thing went right user was added to your members");
      
    }

    if (querySnapshot.empty) {
      console.log("User profile not found.");
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const currentMembers = await userDoc.data().addmembers ;
    const memberLimit = await userDoc.data().addmember_limit ;
    const remainingTokens = await userDoc.data().credit_limit - userDoc.data().credits;
    console.log("memberLimit:", memberLimit);
    console.log("currentMembers:", currentMembers);

    if (remainingTokens < tokens) {
      console.log("You don't have enough tokens to allocate.");
      return {
        ok: false,
        message: "Sorry, you don't have enough tokens to allocate.",
      };
    }

    if ((currentMembers-memberLimit)===0) {
      console.log("Sorry, you have reached the member limit.");
      return {
        ok: false,
        message: "Sorry, you have reached the member limit.",
      };
    }

    const addedMembers = userDoc.data().addedmembers || [];
    if (addedMembers.includes(email)) {
      console.log("The email already exists in the added members list.");
      return {
        ok: false,
        message: "The email already exists in the added members list.",
      };
    }

    const docRef = doc(db, "credits", userDoc.id);

    try {
      const updatedMembers = [...addedMembers, email];
      await updateDoc(docRef, { addmembers: increment(1), addedmembers: updatedMembers, credits: increment(tokens) });
      console.log("Member count and email added successfully.");

      return { ok: true, message: "" };
    } catch (error) {
      console.error("Error updating document:", error);
      return { ok: false, message: `Error updating document: ${error}` };
    }
  } catch (error) {
    console.error("Error processing service request:", error);
    return {
      ok: false,
      message: `Error processing service request: ${error}`,
    };
  }
}
