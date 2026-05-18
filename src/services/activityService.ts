import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp,
  limit
} from "firebase/firestore";
import { getFirebase } from "../lib/firebase";

export interface ActivityLog {
  id?: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: any;
}

export const logActivity = async (userId: string, userName: string, action: string) => {
  const { db } = await getFirebase();
  if (!db) return;

  await addDoc(collection(db, "activity_logs"), {
    userId,
    userName,
    action,
    timestamp: Timestamp.now()
  });
};

export const subscribeToActivityLogs = async (callback: (logs: ActivityLog[]) => void) => {
  const { db } = await getFirebase();
  if (!db) return () => {};

  const q = query(
    collection(db, "activity_logs"),
    orderBy("timestamp", "desc"),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ActivityLog[];
    callback(logs);
  });
};
