import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { sendMessage, subscribeToUserMessages, Message } from "../services/messageService";
import { logActivity } from "../services/activityService";
import { Send, MessageSquare, Clock, User, Reply, Search, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

export default function UserMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      let unsubscribe: () => void;
      subscribeToUserMessages(user.uid, (msgs) => {
        setMessages(msgs);
      }).then(unsub => {
        unsubscribe = unsub;
      });
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    try {
      await sendMessage(user.uid, user.displayName || user.email || "Anonymous", newMessage);
      await logActivity(user.uid, user.displayName || user.email || "Anonymous", "Sent a new message");
      setNewMessage("");
      toast.success("Message sent successfully!");
    } catch (error: any) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <nav className="bg-white border-b border-zinc-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-black transition-colors font-bold text-xs uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
            <MessageSquare size={20} />
          </div>
          <h1 className="font-bold tracking-tight text-sm uppercase">My Messages</h1>
        </div>
        <div className="w-24" /> {/* Spacer */}
      </nav>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col gap-8">
        {/* Send Message Form */}
        <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
          <form onSubmit={handleSend} className="space-y-6">
            <div className="relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-950 mb-3 block">New Message</label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                required
                rows={4}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-6 focus:border-zinc-950 outline-none transition-all resize-none font-medium"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="px-8 py-4 bg-black text-white rounded-2xl font-bold text-sm tracking-tight flex items-center gap-3 hover:bg-zinc-900 transition-colors shadow-xl ml-auto"
            >
              {loading ? "Sending..." : "Send Message"}
              <Send size={18} />
            </motion.button>
          </form>
        </div>

        {/* Message History */}
        <div className="space-y-6 flex-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Message History</h3>
          
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-zinc-100 text-zinc-400">
                   <MessageSquare size={48} className="mx-auto mb-4 opacity-10" />
                   <p className="font-medium uppercase text-xs tracking-widest">No messages yet</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-3xl border border-zinc-100 overflow-hidden shadow-sm"
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-500">
                            <User size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold">{msg.userName}</p>
                            <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                               <Clock size={10} />
                               {msg.createdAt?.toDate().toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${msg.status === 'unread' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                          {msg.status}
                        </span>
                      </div>
                      <p className="text-zinc-600 font-medium leading-relaxed">{msg.content}</p>
                    </div>

                    {msg.adminReply && (
                      <div className="bg-zinc-50 p-6 border-t border-zinc-100 flex gap-4">
                         <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white shrink-0">
                            <Reply size={16} />
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Admin Response</p>
                            <p className="text-zinc-600 font-medium leading-relaxed italic">"{msg.adminReply}"</p>
                         </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
