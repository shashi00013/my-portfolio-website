import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-hot-toast";
import { Mail, Lock, User, UserPlus } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password, name);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Signup Error:", error);
      if (error.code === "auth/network-request-failed" || error.code === "auth/internal-error") {
        toast.error("Network error. Make sure to add this domain to 'Authorized domains' in your Firebase Authentication settings.");
      } else {
        toast.error(error.message || "Failed to create account");
      }
    } finally {
      setLoading(false);
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
          <h2 className="text-4xl font-bold tracking-tight text-black mb-2 uppercase">Create Account</h2>
          <p className="text-zinc-500 font-medium">Join our community today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-950 mb-1 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border border-zinc-200 rounded-xl py-4 pl-12 pr-4 focus:border-zinc-950 outline-none transition-all font-medium"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-950 mb-1 block">Password</label>
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
            {loading ? "Creating Account..." : <><UserPlus size={20} /> Sign Up</>}
          </motion.button>
        </form>

        <p className="text-center text-zinc-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-bold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
