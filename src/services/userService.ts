import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp
} from "firebase/firestore";
import { getFirebase } from "../lib/firebase";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: "user" | "admin";
  createdAt?: any;
}

export const subscribeToAllUsers = async (callback: (users: UserProfile[]) => void) => {
  const { db } = await getFirebase();
  if (!db) return () => {};

  const q = query(
    collection(db, "users"),
    orderBy("email", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => ({
      ...doc.data()
    })) as UserProfile[];
    callback(users);
  });
};
