import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-hot-toast";
import { Mail, Lock, LogIn, Github } from "lucide-react";

import { logActivity } from "../services/activityService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      // Activity logging will happen in onAuthStateChanged or after login
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login Error:", error);
      if (error.code === "auth/network-request-failed" || error.code === "auth/internal-error") {
        toast.error("Network error. Please ensure your Firebase Console has this domain (ais-dev-... or ais-pre-...) added to 'Authorized domains' under Authentication -> Settings.");
      } else {
        toast.error(error.message || "Failed to login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success("Logged in with Google!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      if (error.code === "auth/network-request-failed" || error.code === "auth/internal-error") {
        toast.error("Network error. Check if your domain is authorized in Firebase Console.");
      } else {
        toast.error(error.message || "Google login failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-black mb-2 uppercase">Welcome Back</h2>
          <p className="text-zinc-500 font-medium">Log in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-950 mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border border-zinc-200 rounded-xl py-4 pl-12 pr-4 focus:border-zinc-950 outline-none transition-all font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-950">Password</label>
                <Link to="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border border-zinc-200 rounded-xl py-4 pl-12 pr-4 focus:border-zinc-950 outline-none transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-900 transition-colors shadow-xl"
          >
            {loading ? "Logging in..." : <><LogIn size={20} /> Sign In</>}
          </motion.button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-white px-4 text-zinc-400 font-bold">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-zinc-200 text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </motion.button>
        </div>

        <p className="text-center text-zinc-500 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-black font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
