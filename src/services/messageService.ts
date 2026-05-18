import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  onSnapshot,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { getFirebase } from "../lib/firebase";

export interface Message {
  id?: string;
  userId: string;
  userName: string;
  content: string;
  adminReply: string | null;
  status: "unread" | "replied";
  createdAt: any;
}

export const sendMessage = async (userId: string, userName: string, content: string) => {
  const { db } = await getFirebase();
  if (!db) throw new Error("Firebase not initialized");

  await addDoc(collection(db, "messages"), {
    userId,
    userName,
    content,
    adminReply: null,
    status: "unread",
    createdAt: Timestamp.now()
  });
};

export const subscribeToUserMessages = async (userId: string, callback: (messages: Message[]) => void) => {
  const { db } = await getFirebase();
  if (!db) return () => {};

  const q = query(
    collection(db, "messages"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Message[];
    callback(messages);
  });
};

export const subscribeToAllMessages = async (callback: (messages: Message[]) => void) => {
  const { db } = await getFirebase();
  if (!db) return () => {};

  const q = query(
    collection(db, "messages"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Message[];
    callback(messages);
  });
};

export const replyToMessage = async (messageId: string, reply: string) => {
  const { db } = await getFirebase();
  if (!db) throw new Error("Firebase not initialized");

  const messageRef = doc(db, "messages", messageId);
  await updateDoc(messageRef, {
    adminReply: reply,
    status: "replied"
  });
};

export const updateMessage = async (messageId: string, content: string) => {
  const { db } = await getFirebase();
  if (!db) throw new Error("Firebase not initialized");

  const messageRef = doc(db, "messages", messageId);
  await updateDoc(messageRef, {
    content
  });
};

export const deleteMessage = async (messageId: string) => {
  const { db } = await getFirebase();
  if (!db) throw new Error("Firebase not initialized");

  const messageRef = doc(db, "messages", messageId);
  await deleteDoc(messageRef);
};
