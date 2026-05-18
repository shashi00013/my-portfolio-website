import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { subscribeToAllMessages, replyToMessage, deleteMessage, updateMessage, Message } from "../services/messageService";
import { subscribeToAllUsers, UserProfile } from "../services/userService";
import { subscribeToActivityLogs, ActivityLog } from "../services/activityService";
import { 
  MessageSquare, 
  Clock, 
  User, 
  Reply, 
  Search, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  Users,
  Trash2,
  Activity,
  Calendar,
  Mail,
  Edit2,
  Check
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";

type PanelTab = "messages" | "users" | "activity";

export default function AdminPanel() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [activeTab, setActiveTab] = useState<PanelTab>("messages");
  const [messageFilter, setMessageFilter] = useState<"all" | "unread" | "replied">("all");

  useEffect(() => {
    if (isAdmin) {
      let unsubMessages: () => void;
      let unsubUsers: () => void;
      let unsubLogs: () => void;

      subscribeToAllMessages(setMessages).then(unsub => unsubMessages = unsub);
      subscribeToAllUsers(setUsers).then(unsub => unsubUsers = unsub);
      subscribeToActivityLogs(setLogs).then(unsub => unsubLogs = unsub);

      return () => {
        if (unsubMessages) unsubMessages();
        if (unsubUsers) unsubUsers();
        if (unsubLogs) unsubLogs();
      };
    }
  }, [isAdmin]);

  if (authLoading) return null;
  if (!isAdmin) return <Navigate to="/dashboard" />;

  const handleReplyStatus = async (messageId: string) => {
    const text = replyText[messageId];
    if (!text?.trim()) return;

    try {
      await replyToMessage(messageId, text);
      setReplyText(prev => ({ ...prev, [messageId]: "" }));
      toast.success("Reply sent!");
    } catch (error: any) {
      toast.error("Failed to reply");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteMessage(messageId);
      toast.success("Message deleted");
    } catch (error: any) {
      toast.error("Failed to delete message");
    }
  };

  const handleUpdateMessage = async (messageId: string) => {
    if (!editingContent.trim()) return;
    try {
      await updateMessage(messageId, editingContent);
      setEditingMessageId(null);
      toast.success("Message updated");
    } catch (error: any) {
      toast.error("Failed to update message");
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         msg.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = messageFilter === "all" || msg.status === messageFilter;
    return matchesSearch && matchesTab;
  });

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalMessages: messages.length,
    unreadMessages: messages.filter(m => m.status === 'unread').length,
    totalUsers: users.length,
    activeUsers: users.length // Placeholder, could be based on logs
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <nav className="bg-white border-b border-zinc-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-black transition-colors font-bold text-xs uppercase tracking-widest">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <div className="flex bg-zinc-100 p-1 rounded-xl">
           {(["messages", "users", "activity"] as PanelTab[]).map(tab => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
             >
               {tab}
             </button>
           ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <BarChart3 size={20} />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl w-full mx-auto p-6 md:p-12 space-y-12">
        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                 <MessageSquare size={20} />
              </div>
              <h4 className="text-2xl font-bold">{stats.totalMessages}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Messages</p>
           </div>
           <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                 <AlertCircle size={20} />
              </div>
              <h4 className="text-2xl font-bold">{stats.unreadMessages}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Unread Queries</p>
           </div>
           <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                 <Users size={20} />
              </div>
              <h4 className="text-2xl font-bold">{stats.totalUsers}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Registered Users</p>
           </div>
           <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
                 <Activity size={20} />
              </div>
              <h4 className="text-2xl font-bold">{logs.length}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">System Activities</p>
           </div>
        </div>

        {/* Tab Content Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <h2 className="text-3xl font-bold tracking-tighter uppercase">{activeTab} Management</h2>
           
           <div className="flex items-center gap-4 w-full md:w-auto">
             {activeTab === "messages" && (
                <div className="flex bg-white p-1 rounded-xl border border-zinc-100">
                  {(["all", "unread", "replied"] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setMessageFilter(f)}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${messageFilter === f ? 'bg-black text-white' : 'text-zinc-400'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
             )}
             
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search ${activeTab}...`}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-100 rounded-xl focus:border-zinc-950 outline-none transition-all font-medium text-xs"
                />
             </div>
           </div>
        </div>

        {/* Dynamic List Content */}
        <div className="space-y-6">
           <AnimatePresence mode="wait">
              {activeTab === "messages" && (
                <motion.div 
                  key="messages-grid"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                   {filteredMessages.map(msg => (
                     <div key={msg.id} className="bg-white rounded-[2rem] border border-zinc-100 p-8 flex flex-col gap-6">
                        <div className="flex items-start justify-between">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400">
                                 <User size={20} />
                              </div>
                              <div>
                                 <h5 className="font-bold">{msg.userName}</h5>
                                 <p className="text-[10px] font-bold text-zinc-400 uppercase">{msg.createdAt?.toDate().toLocaleString()}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${msg.status === 'unread' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                {msg.status}
                              </span>
                              <button 
                                onClick={() => {
                                  setEditingMessageId(msg.id!);
                                  setEditingContent(msg.content);
                                }}
                                className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all"
                              >
                                 <Edit2 size={14} />
                              </button>
                              <button 
                                onClick={() => handleDeleteMessage(msg.id!)}
                                className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                              >
                                 <Trash2 size={14} />
                              </button>
                           </div>
                        </div>
                        
                        {editingMessageId === msg.id ? (
                           <div className="space-y-3">
                              <textarea 
                                value={editingContent}
                                onChange={(e) => setEditingContent(e.target.value)}
                                className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-sm focus:border-black outline-none h-24 resize-none font-medium"
                              />
                              <div className="flex gap-2">
                                 <button 
                                   onClick={() => handleUpdateMessage(msg.id!)}
                                   className="flex-1 py-3 bg-black text-white rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                                 >
                                    <Check size={14} /> Save Edit
                                 </button>
                                 <button 
                                   onClick={() => setEditingMessageId(null)}
                                   className="px-6 py-3 bg-zinc-100 text-black rounded-xl font-bold text-[10px] uppercase tracking-widest"
                                 >
                                    Cancel
                                 </button>
                              </div>
                           </div>
                        ) : (
                          <div className="bg-zinc-50 p-4 rounded-xl text-zinc-600 text-sm font-medium italic">
                             "{msg.content}"
                          </div>
                        )}

                        {msg.adminReply ? (
                          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                             <p className="text-[10px] font-black text-green-500 uppercase mb-1">Response sent</p>
                             <p className="text-green-700 text-sm font-medium">"{msg.adminReply}"</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                             <textarea 
                               placeholder="Type reply..."
                               value={replyText[msg.id!] || ""}
                               onChange={(e) => setReplyText(prev => ({ ...prev, [msg.id!]: e.target.value }))}
                               className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-sm focus:border-indigo-600 outline-none h-20 resize-none font-medium"
                             />
                             <button 
                               onClick={() => handleReplyStatus(msg.id!)}
                               className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                             >
                                <Reply size={14} /> Reply Now
                             </button>
                          </div>
                        )}
                     </div>
                   ))}
                </motion.div>
              )}

              {activeTab === "users" && (
                <motion.div 
                  key="users-table"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-[2rem] border border-zinc-100 overflow-hidden"
                >
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-zinc-50 border-b border-zinc-100">
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">User</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Email</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Role</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                         {filteredUsers.map(u => (
                           <tr key={u.uid} className="hover:bg-zinc-50/50 transition-colors">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-100 shadow-sm">
                                       <img 
                                         src={(u.email === "sk5251476@gmail.com" || u.email === "joker5251476@gmail.com") ? "/src/assets/images/new_original_shashi_photo_1779121742145.png" : `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid}`} 
                                         alt="AV" 
                                         className="w-full h-full object-cover"
                                       />
                                    </div>
                                    <p className="font-bold text-sm tracking-tight">{u.displayName || 'Unnamed'}</p>
                                 </div>
                              </td>
                              <td className="px-8 py-6 text-sm font-medium text-zinc-500">{u.email}</td>
                              <td className="px-8 py-6">
                                 <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                    {u.role}
                                 </span>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <button className="text-zinc-400 hover:text-black transition-colors">
                                    <Trash2 size={16} />
                                 </button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </motion.div>
              )}

              {activeTab === "activity" && (
                <motion.div 
                  key="activity-list"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                   {logs.map(log => (
                     <div key={log.id} className="bg-white p-6 rounded-2xl border border-zinc-100 flex items-center justify-between group hover:border-zinc-200 transition-all">
                        <div className="flex items-center gap-6">
                           <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 group-hover:bg-black group-hover:text-white transition-all">
                              <Activity size={20} />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-black">{log.action}</p>
                              <div className="flex items-center gap-3">
                                 <p className="text-[10px] font-bold text-indigo-600 uppercase">By {log.userName}</p>
                                 <span className="w-1 h-1 bg-zinc-200 rounded-full" />
                                 <p className="text-[10px] font-medium text-zinc-400 flex items-center gap-1">
                                    <Clock size={10} /> {log.timestamp?.toDate().toLocaleString()}
                                 </p>
                              </div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="flex items-center gap-2 text-zinc-300">
                              <Calendar size={14} />
                              <span className="text-[10px] font-bold uppercase tracking-widest">{log.timestamp?.toDate().toLocaleDateString()}</span>
                           </div>
                        </div>
                     </div>
                   ))}
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
