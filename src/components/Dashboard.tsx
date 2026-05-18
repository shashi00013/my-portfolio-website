import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { LogOut, User as UserIcon, MessageSquare, Shield, Activity, BarChart3, Settings, X, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import profileImg from "../assets/images/shashi_profile.jpg";

export default function Dashboard() {
  const { user, userData, logout, isAdmin, updateProfileName } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || "");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileName(newName);
      setIsEditing(false);
      toast.success("Profile updated!");
    } catch (error: any) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Sidebar/Nav */}
      <nav className="bg-white border-b border-zinc-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-sm uppercase">User Panel</h1>
            <p className="text-[10px] font-bold text-zinc-400 truncate max-w-[150px]">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {isAdmin && (
            <Link 
              to="/admin" 
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-100 transition-all flex items-center gap-2"
            >
              <BarChart3 size={14} /> Admin Panel
            </Link>
          )}
          <button 
            onClick={() => logout()}
            className="text-zinc-500 hover:text-black transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <h2 className="text-4xl font-bold tracking-tight text-black">Welcome Back, {user?.displayName || 'User'}!</h2>
               {isAdmin && <span className="bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Admin</span>}
            </div>
            <p className="text-zinc-500 font-medium">Manage your profile and messages here.</p>
          </div>

          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Account status</p>
                <p className="text-xs font-bold text-green-600 uppercase">Verified Member</p>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-zinc-200 overflow-hidden border-2 border-white shadow-sm">
                <img 
                  src={(user?.email === "sk5251476@gmail.com" || user?.email === "joker5251476@gmail.com") ? profileImg : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Messages Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm space-y-6 flex flex-col"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <MessageSquare size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Messaging</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">View your chat history and connect with support or admins directly.</p>
            </div>
            <Link 
              to="/messages" 
              className="w-full py-4 bg-zinc-950 text-white rounded-2xl font-bold text-sm tracking-tight hover:bg-black transition-colors text-center shadow-xl"
            >
              Open Chat
            </Link>
          </motion.div>

          {/* Profile Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm space-y-6 flex flex-col"
          >
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
              <UserIcon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Account</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Manage your personal information, security, and preferences.</p>
            </div>
            <button 
              onClick={() => {
                setNewName(user?.displayName || "");
                setIsEditing(true);
              }}
              className="w-full py-4 bg-zinc-100 text-black rounded-2xl font-bold text-sm tracking-tight hover:bg-zinc-200 transition-colors"
            >
              Edit Account
            </button>
          </motion.div>

          {/* Activity Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm space-y-6 flex flex-col"
          >
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
              <Activity size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Insights</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Track your usage patterns and account activity across the platform.</p>
            </div>
            <button className="w-full py-4 bg-zinc-100 text-black rounded-2xl font-bold text-sm tracking-tight hover:bg-zinc-200 transition-colors">
              Activity History
            </button>
          </motion.div>
        </div>

        {/* Support Section */}
        <div className="mt-12 bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 p-12 rounded-[3rem] text-zinc-900 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-sm">
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Live Services</span>
              </div>
              <h3 className="text-4xl font-bold tracking-tighter mb-4 italic uppercase">Need help with<br />anything?</h3>
              <p className="text-zinc-500 max-w-sm mb-8 font-medium">Our support team is available to help you with any issues or feedback you have about the "Ship".</p>
              <Link to="/messages" className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                 Talk to us <MessageSquare size={14} />
              </Link>
           </div>
           
           <div className="relative z-10 grid grid-cols-2 gap-4">
              <div className="p-6 bg-white rounded-3xl border border-indigo-50 shadow-sm">
                 <p className="text-2xl font-black mb-1 text-indigo-950">24/7</p>
                 <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Support Availability</p>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-indigo-50 shadow-sm">
                 <p className="text-2xl font-black mb-1 text-indigo-950">100%</p>
                 <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Secure Protocol</p>
              </div>
           </div>

           {/* Decorative BG element */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Edit Profile Modal */}
        <AnimatePresence>
          {isEditing && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEditing(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
              >
                <button 
                  onClick={() => setIsEditing(false)}
                  className="absolute top-8 right-8 text-zinc-400 hover:text-black transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="mb-8">
                  <h3 className="text-3xl font-bold tracking-tighter uppercase mb-2">Edit Profile</h3>
                  <p className="text-zinc-500 font-medium">Update your public appearance</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Display Name</label>
                    <input 
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-6 focus:border-black outline-none transition-all font-bold"
                      placeholder="Enter new name"
                      autoFocus
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl"
                  >
                    <Save size={18} /> Save Changes
                  </button>
                </form>

                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
