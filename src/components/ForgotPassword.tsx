import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-hot-toast";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { getFirebase } from "../lib/firebase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { auth: authInstance } = await getFirebase();
      if (!authInstance) throw new Error("Firebase not initialized");
      await sendPasswordResetEmail(authInstance, email);
      toast.success("Password reset link sent to your email!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 text-black">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-zinc-400 hover:text-black transition-colors text-[10px] font-black uppercase tracking-widest mb-6">
            <ArrowLeft size={14} /> Back to Login
          </Link>
          <h2 className="text-4xl font-bold tracking-tighter uppercase mb-2">Reset Password</h2>
          <p className="text-zinc-500 font-medium">Enter your email for the reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-950 mb-1 block">Your Email</label>
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

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-900 transition-colors shadow-2xl shadow-zinc-200"
          >
            {loading ? "Sending..." : <><Send size={18} /> Send Reset Link</>}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
