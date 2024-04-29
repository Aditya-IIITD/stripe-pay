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

export async function handleAddCredits(uid, email, token) {
  try {
    const q =  query(collection(db, "credits"), where("email", "==", email));
    const cq =   query(collection(db, "credits"), where("user_id", "==", uid));
    console.log(email)
    const querySnapshot = await getDocs(q);
    const cquerySnapshot = await getDocs(cq);
    console.log("querySnapshot:", querySnapshot);
    console.log("cquerySnapshot:", cquerySnapshot);

    if (querySnapshot.empty) {
      console.log("nUser profile not found.");
      return { ok: false, message: "nUser profile not found." };
    }

    if (cquerySnapshot.empty) {
      console.log("cUser profile not found.");
      return { ok: false, message: "cUser profile not found." };
    }


    const cuserDoc = cquerySnapshot.docs[0];
    const userDoc = querySnapshot.docs[0];
    
    const remainingTokens = cuserDoc.data().credit_limit - cuserDoc.data().credits;

    if (remainingTokens < token) {
      console.log("You don't have enough tokens to allocate.");
      return {
        ok: false,
        message: "Sorry, you don't have enough tokens to allocate.",
      };
    }


    console.log("userDoc:", userDoc);
    const addedMembers = userDoc.data().addedmembers || [];
    const addMembersCount = userDoc.data().addmembers || 0;
    console.log("addedMembers:", addedMembers);

    const docRef = doc(db, "credits", userDoc.id);
    const cdocRef=doc(db,"credits", cuserDoc.id)

    try {
      await updateDoc(cdocRef, { credits: increment(token) });
      await updateDoc(docRef, { credit_limit: increment(token) });

      return { ok: true, message: `added ${token} credits to ${email}` };
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
