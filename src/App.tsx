/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./hooks/useAuth";
import { useState, useEffect } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard";
import UserMessages from "./components/UserMessages";
import AdminPanel from "./components/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import { CustomCursor } from "./components/CustomCursor";
import { Loader } from "./components/Loader";
import { Moon, Sun } from "lucide-react";
import { AnimatePresence } from "motion/react";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [isDark]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <CustomCursor />
        <AnimatePresence>
          {loading && <Loader onComplete={() => setLoading(false)} />}
        </AnimatePresence>
        
        <main className={`bg-surface-base selection:bg-zinc-200 overflow-x-hidden min-h-screen ${isDark ? 'invert hue-rotate-180' : ''}`}>
          {/* Subtle Grain */}
          <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />

          <button 
            onClick={() => setIsDark(!isDark)}
            className="fixed bottom-24 left-8 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50 cursor-pointer"
            style={{ filter: isDark ? 'invert(1) hue-rotate(180deg)' : 'none' }}
          >
            {isDark ? <Sun size={24} /> : <Moon size={24} />}
          </button>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <UserMessages />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}


