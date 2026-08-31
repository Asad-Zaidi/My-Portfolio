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
import { RichTextViewer, stripHtml } from "../components/Rich Text";
import { fetchPortfolio } from "../api/api";
import { Spokes } from "../components/Spokes";

function formatBlogDate(date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function PostHeroBanner({ post }) {
  const hasThumbnail = Boolean(post.thumbnail);
  const accent = post.accent || "from-blue-900/80 via-indigo-950/90 to-navy-950";

  return (
    <div className="relative min-h-[380px] sm:min-h-[460px] md:min-h-[520px] lg:min-h-[580px] w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl flex items-center justify-center text-center p-6 sm:p-10 lg:p-16 border border-slate-200/60 dark:border-navy-700/60">
      {/* Background Cover Image or Accent Graphic */}
      {hasThumbnail ? (
        <img
          src={post.thumbnail}
          alt={stripHtml(post.title || "Blog cover")}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${accent}`}>
          <div className="absolute left-[15%] top-[15%] h-44 w-44 rounded-full border-2 border-accent-light/40 opacity-70" />
          <div className="absolute bottom-[15%] right-[15%] h-36 w-60 rotate-12 border-2 border-sky-300/40 opacity-70" />
        </div>
      )}

      {/* Light White Translucent Overlay in Light Mode & Dark Translucent Overlay in Dark Mode */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/75 to-white/55 dark:from-black/90 dark:via-black/70 dark:to-black/50 backdrop-blur-[0.5px] transition-colors duration-300" />

      {/* Hero Foreground Content Overlaid on Banner */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center text-slate-900 dark:text-white" dir="auto">
        {/* Category & Tags Badges */}
        <div className="mb-3 flex flex-wrap items-center justify-center gap-2 sm:mb-4">
          <span className="rounded-full bg-amber-600 dark:bg-amber-500/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-md">
            {post.category || "General"}
          </span>
          {Array.isArray(post.tags) && post.tags.slice(0, 2).map((t, idx) => (
            <span key={idx} className="rounded-full bg-black/10 dark:bg-white/20 border border-slate-300/70 dark:border-transparent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-white backdrop-blur-md">
              {t}
            </span>
          ))}
        </div>

        {/* Date & Read Time */}
        <div className="mb-4 flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-700 dark:text-slate-200/90 sm:mb-6">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent dark:text-accent-light" />
            {formatBlogDate(post.date)}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent dark:text-accent-light" />
            {post.readTime || "1 min read"}
          </span>
        </div>

        {/* Prominent Center Title */}
        <div className="w-full text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-black dark:text-white leading-tight" dir="auto">
          <RichTextViewer
            content={post.title}
            className="text-black dark:text-white text-inherit block w-full drop-shadow-sm dark:drop-shadow-lg [text-shadow:_0_1px_8px_rgb(255_255_255_/_80%)] dark:[text-shadow:_0_2px_12px_rgb(0_0_0_/_80%)] font-extrabold"
          />
        </div>

        {/* Author Avatar & Name */}
        {post.author && (
          <div className="mt-6 flex items-center justify-center gap-2.5 text-sm sm:text-base font-semibold text-slate-900 dark:text-white/95 sm:mt-8">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-black/10 dark:bg-white/25 text-slate-800 dark:text-white border border-slate-300/80 dark:border-white/40 shadow-sm backdrop-blur-md font-bold text-xs uppercase">
              <User className="h-4 w-4" />
            </div>
            <span className="tracking-wide">
              <RichTextViewer content={post.author} inline={true} className="text-slate-900 dark:text-white font-semibold" />
            </span>
          </div>
        )}
      </div>
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
        if (!cancelled) {
          setData(res);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to load blog post.");
        }
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
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-navy-950 text-accent">
        <Spokes className="h-9 w-9" />
      </div>
    );
  }

  const { personal, nav, resume } = data;
  const decodedSlug = decodeURIComponent(slug || "").trim();
  const post = data.blogs?.find((item, index) => {
    const itemSlug = (item.slug || "").trim();
    const cleanItemTitle = stripHtml(item.title || "").trim();
    const itemTitleSlug = cleanItemTitle.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/[\s_-]+/g, "-");

    return (
      (item.slug && itemSlug === slug) ||
      (item.slug && itemSlug.toLowerCase() === decodedSlug.toLowerCase()) ||
      (item.slug && encodeURIComponent(itemSlug) === slug) ||
      (item._id && String(item._id) === slug) ||
      (item.id && String(item.id) === slug) ||
      (cleanItemTitle && cleanItemTitle.toLowerCase() === decodedSlug.toLowerCase()) ||
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

      <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-32 sm:px-8">
        <Link to="/blogs" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-light hover:text-accent transition-colors">
          <ArrowLeft className="h-4 w-4" /> All posts
        </Link>

        {/* Hero Banner with Title, Date, Category, and Author overlaid in front */}
        <PostHeroBanner post={post} />

        <article className="mt-10 w-full max-w-full min-w-0" dir="auto">
          {/* Excerpt Lead Summary */}
          {post.excerpt && (
            <div className="mb-8 rounded-2xl border-l-4 border-accent bg-slate-50/80 p-5 sm:p-6 dark:bg-navy-900/50 dark:border-accent-light">
              <RichTextViewer
                content={post.excerpt}
                className="text-lg sm:text-xl font-medium text-black dark:text-white block w-full leading-relaxed"
              />
            </div>
          )}

          {/* Full Article Content */}
          <div className="mt-8 w-full max-w-full">
            <RichTextViewer
              content={post.content}
              className="text-base text-black dark:text-white w-full leading-relaxed"
            />
          </div>

          {/* Tags */}
          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="mx-auto mt-12 flex max-w-7xl flex-wrap items-center gap-2 border-t border-slate-200 pt-6 dark:border-navy-700">
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
