import {
  LuArrowRight as ArrowRight,
  LuClock as Clock,
} from "react-icons/lu";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { RichTextViewer } from "../components/Rich Text";
import { fetchPortfolio } from "../services/api";

function formatBlogDate(date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function PostArtwork({ post, large = false }) {
  const accent = post.accent || "from-blue-600/30 via-cyan-500/20 to-navy-900/50";
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${accent} ${large ? "h-56" : "h-44"}`}>
      <div className="absolute left-8 top-8 h-20 w-20 rounded-full border-2 border-accent-light/70" />
      <div className="absolute bottom-8 right-10 h-16 w-28 rotate-12 border-2 border-sky-300/70" />
      <div className="absolute left-1/2 top-1/2 h-10 w-32 -translate-x-1/2 -translate-y-1/2 border border-white/50" />
    </div>
  );
}

function PostCard({ post, index }) {
  const postSlug = post.slug || (post.title ? post.title.toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/[\s_-]+/g, "-") : "") || post._id || post.id || index;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-navy-700 dark:bg-navy-800" dir="auto">
      <PostArtwork post={post} />
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="rounded-full bg-accent/10 px-2.5 py-1 font-medium text-accent-light">{post.category}</span>
          <span className="truncate">{post.author ? `${post.author} • ` : ''}{formatBlogDate(post.date)}</span>
        </div>
        <h2 className="text-lg font-bold leading-snug text-slate-900 dark:text-white" dir="auto">{post.title}</h2>
        <RichTextViewer content={post.excerpt} className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400" />
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="h-3.5 w-3.5" /> {post.readTime}
          </span>
          <Link to={`/blogs/${encodeURIComponent(postSlug)}`} className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-light">
            Read article <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Blogs() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchPortfolio()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-slate-500 dark:bg-navy-950 dark:text-slate-400">
        Unable to load blog posts. Please try again later.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-navy-950 text-slate-500 dark:text-slate-400">
        Loading…
      </div>
    );
  }

  const { personal, nav, resume, blogs: posts = [] } = data;

  return (
    <div className="min-h-screen bg-white text-slate-800 dark:bg-navy-950 dark:text-slate-200">
      <Navbar personal={personal} nav={nav} resume={resume} />

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-32 sm:px-8 lg:px-10">
        <section className="border-b border-slate-200 pb-10 dark:border-navy-700">
          <p className="text-sm font-semibold text-accent-light">Writing</p>
          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Notes on building useful software.
            </h1>
            <p className="max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">
              Short, practical notes on frontend work, backend systems, and product details.
            </p>
          </div>
        </section>

        <section className="py-10" aria-labelledby="latest-posts">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 id="latest-posts" className="text-xl font-bold text-slate-900 dark:text-white">Latest posts</h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">{posts.length} articles</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => <PostCard key={post.slug || post._id || index} post={post} index={index} />)}
          </div>
        </section>

      </main>
    </div>
  );
}
