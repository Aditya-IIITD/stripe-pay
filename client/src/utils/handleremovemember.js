import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export async function handleremovemember(uid, email) {
  try {
    const q = query(collection(db, "credits"), where("user_id", "==", uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("User profile not found.");
      return { ok: false, message: "User profile not found." };
    }

    const userDoc = querySnapshot.docs[0];
    console.log("userDoc:", userDoc)
    const addedMembers = userDoc.data().addedmembers || [];
    const addMembersCount = userDoc.data().addmembers || 0;
    console.log("addedMembers:", addedMembers)

    const memberIndex = addedMembers.findIndex(member => {
      if (typeof member === 'object' && member.email) {
        return member.email === email;
      } else if (typeof member === 'string') {
        return member === email;
      }
      return false;
    });

    if (memberIndex === -1) {
      console.log("Email not found in added members.");
      return { ok: false, message: "Email not found in added members." };
    }

    const updatedMembers = [
      ...addedMembers.slice(0, memberIndex),
      ...addedMembers.slice(memberIndex + 1)
    ];

    const docRef = doc(db, "credits", userDoc.id);

    try {
      await updateDoc(docRef, {
        addedmembers: updatedMembers,
        addmembers: addMembersCount - 1, // Decrement count of currently added members
      });

      console.log(`Successfully removed ${email} from added members.`);
      return { ok: true, message: `Successfully removed ${email} from added members.` };
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
