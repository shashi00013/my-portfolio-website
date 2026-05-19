import { motion } from "motion/react";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { useState, useEffect } from "react";

const staticArticles = [
  {
    title: "Why Next.js App Router is the Future of Web Architecture",
    excerpt: "Exploring the shift from Pages to App Router, server components, and how it dramatically improves initial load times and SEO for complex applications.",
    date: "May 15, 2026",
    readTime: "5 min read",
    category: "Architecture",
    url: "#"
  },
  {
    title: "Integrating Gemini AI in React Applications",
    excerpt: "A practical guide to securely connecting Google's GenAI API to a React frontend using a custom Node.js server to prevent API key exposure.",
    date: "May 10, 2026",
    readTime: "7 min read",
    category: "Artificial Intelligence",
    url: "#"
  },
  {
    title: "Mastering Tailwind CSS for Brutalist Design",
    excerpt: "How to leverage Tailwind's utility classes to create high-contrast, premium brutalist designs without writing complex custom CSS.",
    date: "April 28, 2026",
    readTime: "4 min read",
    category: "Design Systems",
    url: "#"
  }
];

export function Blogs() {
  const [articles, setArticles] = useState<any[]>(staticArticles);

  useEffect(() => {
    fetch("https://dev.to/api/articles?username=shashi00013&per_page=3")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(article => ({
            title: article.title,
            excerpt: article.description || "Read full article on Dev.to",
            date: new Date(article.published_at).toLocaleDateString(),
            readTime: `${article.reading_time_minutes} min read`,
            category: article.tag_list[0] || "Engineering",
            url: article.url
          }));
          setArticles(formatted);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="blog" className="py-32 bg-white border-t border-zinc-100 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <span className="text-xs font-bold tracking-[0.4em] text-zinc-400 mb-6 block uppercase">Technical Writing</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-black leading-[0.9]">
              THOUGHTS &<br/>ARTICLES
            </h2>
          </div>
          <a href="https://dev.to/shashi00013" target="_blank" rel="noreferrer" className="flex items-center gap-2 font-bold text-sm text-indigo-600 hover:text-black transition-colors group">
            View All Posts on Dev.to
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <motion.a
              key={idx}
              href={article.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer flex flex-col h-full"
            >
              <div className="p-8 border border-zinc-200 bg-zinc-50 rounded-[2.5rem] flex-grow flex flex-col group-hover:bg-black group-hover:border-black transition-all duration-500">
                <div className="mb-8 flex items-center justify-between">
                  <span className="px-4 py-1.5 bg-white border border-zinc-200 text-[10px] font-black uppercase tracking-widest rounded-full group-hover:text-black">
                    {article.category}
                  </span>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-zinc-200 group-hover:scale-110 transition-transform text-black">
                    <BookOpen size={16} />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-white transition-colors line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-zinc-500 mb-8 flex-grow group-hover:text-zinc-400 transition-colors line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between border-t border-zinc-200 pt-6 mt-auto group-hover:border-zinc-800 transition-colors">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{article.date}</span>
                  <span className="text-xs font-medium text-zinc-400 flex items-center gap-1">
                    <Clock size={12} /> {article.readTime}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
