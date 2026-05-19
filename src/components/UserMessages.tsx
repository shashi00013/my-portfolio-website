import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { sendMessage, subscribeToUserMessages, Message } from "../services/messageService";
import { logActivity } from "../services/activityService";
import { Send, MessageSquare, ArrowLeft, Check, CheckCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

export default function UserMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      let isMounted = true;
      let unsubscribe: () => void;
      subscribeToUserMessages(user.uid, (msgs) => {
        // Reverse array so oldest messages are at the top, newest at bottom (WhatsApp style)
        if (isMounted) setMessages([...msgs].reverse());
      }).then(unsub => {
        if (!isMounted) unsub();
        else unsubscribe = unsub;
      });
      return () => {
        isMounted = false;
        if (unsubscribe) unsubscribe();
      };
    }
  }, [user]);

  const handleSend = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    try {
      await sendMessage(user.uid, user.displayName || user.email || "Anonymous", newMessage.trim());
      await logActivity(user.uid, user.displayName || user.email || "Anonymous", "Sent a new message");
      setNewMessage("");
    } catch (error: any) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (msg: Message) => {
    if (!msg.createdAt) return "";
    const date = msg.createdAt?.toDate ? msg.createdAt.toDate() : new Date(msg.createdAt?.seconds ? msg.createdAt.seconds * 1000 : Date.now());
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-zinc-900">
      {/* Top Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-zinc-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <Link to="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-black transition-colors font-bold text-xs uppercase tracking-widest">
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <MessageSquare size={18} />
          </div>
          <h1 className="font-bold tracking-tight text-sm uppercase">My Messages</h1>
        </div>
        <div className="w-16" /> {/* Spacer */}
      </nav>

      {/* Main Chat Interface */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 flex flex-col h-[calc(100vh-80px)]">
        <div className="flex-1 bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col overflow-hidden relative">
          
          {/* Chat History Section */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scroll-smooth">
            <AnimatePresence initial={false}>
              {messages.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4"
                >
                   <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-2">
                     <MessageSquare size={40} className="opacity-20" />
                   </div>
                   <p className="font-bold uppercase text-xs tracking-widest text-zinc-500">No messages yet</p>
                   <p className="text-sm font-medium">Send a message to start the conversation.</p>
                </motion.div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="space-y-6">
                    {/* Outgoing Message (User) */}
                    <motion.div
                      initial={{ opacity: 0, y: 10, originX: 1 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-end"
                    >
                      <div className="max-w-[85%] md:max-w-[70%] flex flex-col items-end gap-1">
                        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-5 rounded-2xl rounded-tr-sm shadow-md shadow-blue-500/10">
                          <p className="font-medium text-[15px] leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 px-1">
                          <span>{formatTime(msg)}</span>
                          {msg.status === 'replied' ? (
                            <CheckCheck size={14} className="text-blue-500" />
                          ) : (
                            <Check size={14} className="text-zinc-400" />
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Incoming Message (Admin Reply) */}
                    {msg.adminReply && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, originX: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="max-w-[85%] md:max-w-[70%] flex flex-col items-start gap-1">
                          <div className="bg-white border border-zinc-100 text-zinc-800 p-5 rounded-2xl rounded-tl-sm shadow-sm">
                            <p className="font-medium text-[15px] leading-relaxed whitespace-pre-wrap break-words">{msg.adminReply}</p>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 px-1">
                            <span>Admin Support</span>
                            <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                            <span>{formatTime(msg)}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="p-4 md:p-6 bg-white/80 backdrop-blur-xl border-t border-zinc-100">
            <form onSubmit={handleSend} className="flex items-end gap-3 max-w-4xl mx-auto relative">
              <div className="flex-1 bg-zinc-100/50 hover:bg-zinc-100 transition-colors rounded-3xl border border-zinc-200/50 focus-within:border-blue-500/30 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 overflow-hidden">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here... 🚀"
                  required
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  className="w-full bg-transparent p-4 max-h-32 focus:outline-none resize-none font-medium text-[15px] placeholder:text-zinc-500"
                  style={{ minHeight: '56px' }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading || !newMessage.trim()}
                className="w-14 h-14 bg-black disabled:bg-zinc-300 disabled:text-zinc-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-black/10 flex-shrink-0 transition-colors"
              >
                <Send size={20} className="ml-1" />
              </motion.button>
            </form>
            <p className="text-center mt-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest hidden md:block">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
          
        </div>
      </main>
    </div>
  );
}
