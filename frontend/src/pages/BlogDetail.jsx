import {
  LuArrowLeft as ArrowLeft,
  LuCalendar as Calendar,
  LuClock as Clock,
  LuUser as User,
  LuTag as Tag,
} from "react-icons/lu";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { RichTextViewer } from "../components/Rich Text";
import { fetchPortfolio } from "../services/api";

function formatBlogDate(date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function PostArtwork({ post }) {
  const accent = post.accent || "from-blue-600/30 via-cyan-500/20 to-navy-900/50";
  return (
    <div className={`relative h-64 overflow-hidden rounded-2xl bg-gradient-to-br ${accent} sm:h-80`}>
      <div className="absolute left-[18%] top-[18%] h-32 w-32 rounded-full border-2 border-accent-light/70 sm:h-44 sm:w-44" />
      <div className="absolute bottom-[18%] right-[18%] h-20 w-36 rotate-12 border-2 border-sky-300/70 sm:h-28 sm:w-52" />
      <div className="absolute left-1/2 top-1/2 h-16 w-48 -translate-x-1/2 -translate-y-1/2 border border-white/50 sm:h-24 sm:w-72" />
    </div>
  );
}

export default function BlogDetail() {
  const { slug } = useParams();
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
        Unable to load this article. Please try again later.
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

  const { personal, nav, resume } = data;
  const decodedSlug = decodeURIComponent(slug || "").trim();
  const post = data.blogs?.find((item, index) => {
    const itemSlug = (item.slug || "").trim();
    const itemTitle = (item.title || "").trim();
    const itemTitleSlug = itemTitle.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/[\s_-]+/g, "-");

    return (
      (item.slug && itemSlug === slug) ||
      (item.slug && itemSlug.toLowerCase() === decodedSlug.toLowerCase()) ||
      (item.slug && encodeURIComponent(itemSlug) === slug) ||
      (item._id && String(item._id) === slug) ||
      (item.id && String(item.id) === slug) ||
      (itemTitle && itemTitle.toLowerCase() === decodedSlug.toLowerCase()) ||
      (itemTitleSlug && itemTitleSlug === decodedSlug.toLowerCase()) ||
      (String(index) === slug)
    );
  });

  if (!post) {
    return (
      <div className="min-h-screen bg-white text-slate-800 dark:bg-navy-950 dark:text-slate-200">
        <Navbar personal={personal} nav={nav} resume={resume} />
        <main className="mx-auto max-w-3xl px-6 pb-20 pt-36 text-center sm:px-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Article not found</h1>
          <Link to="/blogs" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-light">
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
        </main>
        <Footer personal={personal} nav={[]} socials={[]} noNegativeMargin />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 dark:bg-navy-950 dark:text-slate-200">
      <Navbar personal={personal} nav={nav} resume={resume} />

      <main className="mx-auto max-w-4xl px-6 pb-20 pt-32 sm:px-8">
        <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-semibold text-accent-light hover:text-accent">
          <ArrowLeft className="h-4 w-4" /> All posts
        </Link>

        <article className="mt-8" dir="auto">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="rounded-full bg-accent/10 px-3 py-1 font-medium text-accent-light">{post.category}</span>
            {post.author && (
              <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <User className="h-4 w-4 text-accent-light" />
                <span>{post.author}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formatBlogDate(post.date)}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.readTime}</span>
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl" dir="auto">
            {post.title}
          </h1>
          <RichTextViewer content={post.excerpt} className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400" />
          <div className="mt-10"><PostArtwork post={post} /></div>

          <div className="mx-auto mt-10 max-w-2xl">
            <RichTextViewer content={post.content} className="text-base leading-8 text-slate-600 dark:text-slate-400" />
          </div>

          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center gap-2 border-t border-slate-200 pt-6 dark:border-navy-700">
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Tag className="h-3.5 w-3.5" /> Tags:
              </span>
              {post.tags.map((tag, i) => (
                <span key={i} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-navy-800 dark:text-slate-300">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </main>

      <Footer personal={personal} nav={[]} socials={[]} noNegativeMargin />
    </div>
  );
}
