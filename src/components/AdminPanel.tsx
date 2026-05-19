import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { subscribeToAllMessages, replyToMessage, deleteMessage, updateMessage, Message, subscribeToAllInquiries, deleteInquiry, markInquiryAsRead, Inquiry } from "../services/messageService";
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
  Check,
  Download
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import profileImg from "../assets/images/shashi_profile.jpg";

type PanelTab = "messages" | "inquiries" | "users" | "activity";

export default function AdminPanel() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  
  const quickReplies = [
    "Thanks for reaching out! Let's schedule a call.",
    "I'll review your project and get back to you.",
    "Could you share more details?",
    "Thanks, I'll take a look!"
  ];
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [activeTab, setActiveTab] = useState<PanelTab>("messages");
  const [messageFilter, setMessageFilter] = useState<"all" | "unread" | "replied">("all");

  useEffect(() => {
    if (isAdmin) {
      let isMounted = true;
      let unsubMessages: () => void;
      let unsubUsers: () => void;
      let unsubLogs: () => void;
      let unsubInquiries: () => void;

      subscribeToAllMessages(setMessages).then(unsub => {
        if (!isMounted) unsub();
        else unsubMessages = unsub;
      });
      subscribeToAllUsers(setUsers).then(unsub => {
        if (!isMounted) unsub();
        else unsubUsers = unsub;
      });
      subscribeToActivityLogs(setLogs).then(unsub => {
        if (!isMounted) unsub();
        else unsubLogs = unsub;
      });
      subscribeToAllInquiries(setInquiries).then(unsub => {
        if (!isMounted) unsub();
        else unsubInquiries = unsub;
      });

      return () => {
        isMounted = false;
        if (unsubMessages) unsubMessages();
        if (unsubUsers) unsubUsers();
        if (unsubLogs) unsubLogs();
        if (unsubInquiries) unsubInquiries();
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
    resumeDownloads: logs.filter(log => log.action === "Downloaded Resume").length,
    activeUsers: users.length // Placeholder, could be based on logs
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <nav className="bg-white border-b border-zinc-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-black transition-colors font-bold text-xs uppercase tracking-widest">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <div className="flex bg-zinc-100 p-1 rounded-xl">
           {(["messages", "inquiries", "users", "activity"] as PanelTab[]).map(tab => (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
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
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                 <Mail size={20} />
              </div>
              <h4 className="text-2xl font-bold">{inquiries.length}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Public Inquiries</p>
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
           <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
              <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4">
                 <Download size={20} />
              </div>
              <h4 className="text-2xl font-bold">{stats.resumeDownloads}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">CV Downloads</p>
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
                                 <p className="text-[10px] font-bold text-zinc-400 uppercase">{msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString() : new Date(msg.createdAt?.seconds ? msg.createdAt.seconds * 1000 : Date.now()).toLocaleString()}</p>
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
                             <div className="flex flex-wrap gap-2 mb-2">
                               {quickReplies.map(reply => (
                                 <button
                                   key={reply}
                                   onClick={() => setReplyText(prev => ({ ...prev, [msg.id!]: reply }))}
                                   className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-[10px] font-bold text-zinc-600 rounded-full transition-colors text-left"
                                 >
                                    {reply}
                                 </button>
                               ))}
                             </div>
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

              {activeTab === "inquiries" && (
                <motion.div 
                  key="inquiries-list"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                   {inquiries.length === 0 ? (
                      <div className="text-center py-12 text-zinc-400">No public inquiries found.</div>
                   ) : inquiries.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.company.toLowerCase().includes(searchTerm.toLowerCase())).map(inq => (
                     <div key={inq.id} className={`bg-white p-6 rounded-[2rem] border ${inq.status === 'unread' ? 'border-indigo-500 shadow-lg shadow-indigo-500/10' : 'border-zinc-100'} flex flex-col md:flex-row md:items-start justify-between gap-6`}>
                        <div>
                           <div className="flex flex-wrap items-center gap-3 mb-3">
                              <h4 className="font-bold text-lg">{inq.name}</h4>
                              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full">{inq.company || 'No Company'}</span>
                              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${inq.status === 'unread' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>{inq.status}</span>
                           </div>
                           <p className="text-sm font-medium text-zinc-500 mb-2 flex items-center gap-2"><Mail size={14} /> {inq.email}</p>
                           <div className="inline-block px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl mt-2">
                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mr-2">Interested In:</span>
                              <span className="text-sm font-bold text-zinc-800">{inq.interest}</span>
                           </div>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
                           <p className="text-[10px] font-bold text-zinc-400 uppercase">
                              {inq.createdAt?.toDate ? inq.createdAt.toDate().toLocaleString() : new Date(inq.createdAt?.seconds ? inq.createdAt.seconds * 1000 : Date.now()).toLocaleString()}
                           </p>
                           <div className="flex gap-2">
                              {inq.status === 'unread' && (
                                <button 
                                  onClick={() => markInquiryAsRead(inq.id!)}
                                  className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-colors flex items-center gap-2"
                                >
                                   <Check size={14} /> Mark Read
                                </button>
                              )}
                              <button 
                                onClick={async () => { if(window.confirm("Delete inquiry?")) await deleteInquiry(inq.id!); }}
                                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors flex items-center gap-2"
                              >
                                 <Trash2 size={14} /> Delete
                              </button>
                           </div>
                        </div>
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
                                         src={(u.email === "sk5251476@gmail.com" || u.email === "joker5251476@gmail.com") ? profileImg : `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid}`} 
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
                                    <Clock size={10} /> {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : new Date(log.timestamp?.seconds ? log.timestamp.seconds * 1000 : Date.now()).toLocaleString()}
                                 </p>
                              </div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="flex items-center gap-2 text-zinc-300">
                              <Calendar size={14} />
                              <span className="text-[10px] font-bold uppercase tracking-widest">{log.timestamp?.toDate ? log.timestamp.toDate().toLocaleDateString() : new Date(log.timestamp?.seconds ? log.timestamp.seconds * 1000 : Date.now()).toLocaleDateString()}</span>
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
