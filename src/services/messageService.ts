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
    where("userId", "==", userId)
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Message[];
    
    // Sort client-side to avoid needing a Firestore composite index for (userId, createdAt)
    messages.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
      return timeB - timeA;
    });

    callback(messages);
  }, (error) => {
    console.error("Error fetching user messages:", error);
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

export interface Inquiry {
  id?: string;
  name: string;
  email: string;
  company: string;
  interest: string;
  status: "unread" | "read";
  createdAt: any;
}

export const submitInquiry = async (name: string, email: string, company: string, interest: string) => {
  const { db } = await getFirebase();
  if (!db) throw new Error("Firebase not initialized");

  await addDoc(collection(db, "inquiries"), {
    name,
    email,
    company,
    interest,
    status: "unread",
    createdAt: Timestamp.now()
  });
};

export const subscribeToAllInquiries = async (callback: (inquiries: Inquiry[]) => void) => {
  const { db } = await getFirebase();
  if (!db) return () => {};

  const q = query(
    collection(db, "inquiries"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const inquiries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Inquiry[];
    callback(inquiries);
  });
};

export const markInquiryAsRead = async (inquiryId: string) => {
  const { db } = await getFirebase();
  if (!db) return;
  const ref = doc(db, "inquiries", inquiryId);
  await updateDoc(ref, { status: "read" });
};

export const deleteInquiry = async (inquiryId: string) => {
  const { db } = await getFirebase();
  if (!db) return;
  const ref = doc(db, "inquiries", inquiryId);
  await deleteDoc(ref);
};
