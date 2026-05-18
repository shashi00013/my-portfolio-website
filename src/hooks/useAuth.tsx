import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  User, 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  Auth
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Shield } from "lucide-react";
import { getFirebase, googleProvider } from "../lib/firebase";

import { logActivity } from "../services/activityService";

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, pass: string, name: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  updateProfileName: (name: string) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(true);

  const fetchUserData = async (uid: string) => {
    const { db } = await getFirebase();
    if (!db) return;
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      setUserData(userDoc.data() as UserData);
    }
  };

  useEffect(() => {
    let unsubscribe: () => void;
    
    getFirebase().then(({ auth: authInstance }) => {
      if (!authInstance) {
        setIsFirebaseConfigured(false);
        setLoading(false);
        return;
      }
      
      setAuth(authInstance);
      unsubscribe = onAuthStateChanged(authInstance, async (user) => {
        setUser(user);
        if (user) {
          await fetchUserData(user.uid);
          // Log returning session
          await logActivity(user.uid, user.displayName || user.email || "User", "Accessing dashboard");
        } else {
          setUserData(null);
        }
        setLoading(false);
      });
    });
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mx-auto animate-pulse">
            <Shield size={40} />
          </div>
          <h2 className="text-3xl font-bold uppercase tracking-tighter">Firebase Setup Required</h2>
          <p className="text-zinc-400 font-medium leading-relaxed">
            Please click the <span className="text-white font-bold">"Set up Firebase"</span> button in the AI Studio side panel to enable authentication and the messaging system.
          </p>
          <div className="pt-4">
             <div className="inline-block p-1 rounded-full bg-zinc-900 border border-zinc-800">
                <div className="px-6 py-2 rounded-full bg-zinc-800 text-[10px] font-black uppercase tracking-widest">
                   Waiting for configuration...
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  const loginWithGoogle = async () => {
    if (!auth || !googleProvider) throw new Error("Firebase not initialized. Please complete setup in the side panel.");
    const { user } = await signInWithPopup(auth, googleProvider);
    const { db } = await getFirebase();
    if (db) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        const { collection, getDocs, limit, query } = await import("firebase/firestore");
        const usersRef = collection(db, "users");
        const q = query(usersRef, limit(1));
        const querySnapshot = await getDocs(q);
        const isFirstUser = querySnapshot.empty;
        const isAdminEmail = user.email === "sk5251476@gmail.com";

        const newUserData: UserData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: (isFirstUser || isAdminEmail) ? "admin" : "user"
        };
        await setDoc(userDocRef, newUserData);
        setUserData(newUserData);
        await logActivity(user.uid, user.displayName || user.email || "User", "Joined via Google Auth");
      } else {
        setUserData(userDoc.data() as UserData);
        await logActivity(user.uid, user.displayName || user.email || "User", "Logged in via Google");
      }
    }
  };

  const signup = async (email: string, pass: string, name: string) => {
    if (!auth) throw new Error("Firebase not initialized. Please complete setup in the side panel.");
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(res.user, { displayName: name });
    
    const { db } = await getFirebase();
    if (db) {
      const { collection, getDocs, limit, query } = await import("firebase/firestore");
      const usersRef = collection(db, "users");
      const q = query(usersRef, limit(1));
      const querySnapshot = await getDocs(q);
      const isFirstUser = querySnapshot.empty;
      const isAdminEmail = email === "sk5251476@gmail.com";

      const newUserData: UserData = {
        uid: res.user.uid,
        email: email,
        displayName: name,
        role: (isFirstUser || isAdminEmail) ? "admin" : "user"
      };
      await setDoc(doc(db, "users", res.user.uid), newUserData);
      setUserData(newUserData);
      await logActivity(res.user.uid, name, "Created new account");
    }
  };

  const login = async (email: string, pass: string) => {
    if (!auth) throw new Error("Firebase not initialized. Please complete setup in the side panel.");
    await signInWithEmailAndPassword(auth, email, pass);
    // User data is fetched in onAuthStateChanged
  };

  const logout = async () => {
    if (!auth) throw new Error("Firebase not initialized. Please complete setup in the side panel.");
    if (user) {
      await logActivity(user.uid, user.displayName || user.email || "User", "Signed out");
    }
    await signOut(auth);
  };

  const updateProfileName = async (name: string) => {
    if (!auth || !auth.currentUser) throw new Error("Not authenticated");
    await updateProfile(auth.currentUser, { displayName: name });
    
    // Also update in Firestore
    const { db } = await getFirebase();
    if (db) {
      await setDoc(doc(db, "users", auth.currentUser.uid), { displayName: name }, { merge: true });
    }
    
    // Force user state update locally
    setUser({ ...auth.currentUser, displayName: name } as any);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      loading, 
      loginWithGoogle, 
      logout, 
      signup, 
      login,
      updateProfileName,
      isAdmin: userData?.role === "admin"
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
