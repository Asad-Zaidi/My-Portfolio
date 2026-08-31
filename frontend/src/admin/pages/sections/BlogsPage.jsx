import { useEffect, useState, useRef, useCallback } from "react";
import {
  LuTriangleAlert as AlertTriangle,
  LuLoaderCircle as Loader2,
  LuSave as Save,
  LuRotateCcw as RotateCcw,
  LuChevronUp as ChevronUp,
  LuChevronDown as ChevronDown,
  LuTrash2 as Trash2,
  LuPlus as Plus,
  LuPencil as Edit,
  LuArrowLeft as ArrowLeft,
  LuCalendar as Calendar,
  LuClock as Clock,
  LuUser as User,
  LuCheck as Check,
  LuSearch as Search,
  LuFileText as FileText,
  LuCloudUpload as UploadCloud,
  LuExternalLink as ExternalLink,
  LuImage as ImageIcon,
} from "react-icons/lu";
import { BsInfoCircle } from "react-icons/bs";
import { RichTextEditor, RichTextViewer, stripHtml } from "../../../components/Rich Text";
import { adminUploadFile } from "../../../api/api";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../components/ToastContext";
import { usePortfolioData } from "../../../context/PortfolioDataContext";

const SECTION_KEY = "blogs";
const ITEM_LABEL = "post";

function clone(value) {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

function generateSlug(text) {
  if (!text) return "";
  const plain = stripHtml(text);
  const s = plain
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s;
}

function calculateReadTime(text = "") {
  const clean = stripHtml(text || "");
  const words = clean.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function formatBlogDate(date) {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  } catch (e) {
    return date;
  }
}

function getCurrentDate() {
  return new Date().toISOString().split("T")[0];
}

let globalActiveCloseFn = null;

function FieldInfo({ text }) {
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    if (globalActiveCloseFn === close) {
      globalActiveCloseFn = null;
    }
  }, []);

  const show = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (globalActiveCloseFn && globalActiveCloseFn !== close) {
      globalActiveCloseFn();
    }
    globalActiveCloseFn = close;
    setOpen(true);
  };

  const handleMouseEnter = () => {
    show();
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      close();
    }, 120);
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (open) {
      close();
    } else {
      show();
    }
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (globalActiveCloseFn === close) globalActiveCloseFn = null;
    };
  }, [close]);

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center justify-center p-0.5 text-slate-400 hover:text-accent dark:text-slate-500 dark:hover:text-accent-light focus:outline-none transition-colors"
        aria-label="Field info"
      >
        <BsInfoCircle className="h-3.5 w-3.5" />
      </button>

      <span
        onMouseEnter={() => {
          if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        }}
        onMouseLeave={handleMouseLeave}
        className={`field-tooltip pointer-events-auto absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 w-max max-w-[220px] rounded-lg px-2.5 py-1.5 text-center text-xs font-normal transition-all duration-150 ${open
          ? "opacity-100 visible translate-y-0"
          : "opacity-0 invisible translate-y-1"
          }`}
      >
        {text}
        <span className="field-tooltip-arrow absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent" />
      </span>
    </span>
  );
}

function ImageUploadField({ value, onChange }) {
  const { token } = useAuth();
  const toast = useToast();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const isImage = /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i.test(value || "") || (value && (value.startsWith("http") || value.startsWith("data:image")));

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await adminUploadFile(token, file);
      onChange(res.url);
      toast.success("Thumbnail uploaded.");
    } catch (err) {
      toast.error(err.message || "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or upload an image"
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:border-accent hover:text-accent dark:border-navy-600 dark:bg-navy-800 dark:text-slate-200 dark:hover:border-accent/60 dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>

      {value && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/80 p-2 dark:border-navy-700 dark:bg-navy-900/40">
          <div className="flex items-center gap-3 min-w-0">
            {isImage ? (
              <img src={value} alt="Preview" className="h-12 w-16 shrink-0 rounded-md object-cover border border-slate-200 dark:border-navy-700" />
            ) : (
              <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md bg-slate-200 text-[10px] font-semibold text-slate-600 dark:bg-navy-800 dark:text-slate-400">
                IMAGE
              </div>
            )}
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="flex min-w-0 items-center gap-1 truncate text-xs text-slate-600 hover:text-accent dark:text-slate-400 dark:hover:text-accent-light"
            >
              <span className="truncate">{value}</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            title="Remove thumbnail"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function BlogsEditor({ items = [], onChange, onSave }) {
  const { token } = useAuth();
  const toast = useToast();
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const move = (index, dir) => {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remove = (index) => {
    if (editingIndex === index) {
      setEditingIndex(null);
    } else if (editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
    onChange(items.filter((_, i) => i !== index));
  };

  const add = () => {
    const today = getCurrentDate();
    const newItems = [
      ...items,
      {
        id: `${SECTION_KEY}-${Date.now().toString(36)}`,
        title: "",
        slug: "",
        category: "General",
        author: "",
        thumbnail: "",
        tags: [],
        date: today,
        readTime: "1 min read",
        excerpt: "",
        content: "",
      },
    ];
    onChange(newItems);
    setEditingIndex(items.length);
  };

  const updateItemField = (index, key, val) => {
    const next = [...items];
    next[index] = { ...next[index], [key]: val };
    onChange(next);
  };

  const handleTitleChange = (index, title) => {
    const item = items[index];
    const prevExpectedSlug = generateSlug(item.title);
    const isAutoSlug = !item.slug || item.slug === prevExpectedSlug;

    const next = [...items];
    next[index] = {
      ...item,
      title,
      slug: isAutoSlug ? generateSlug(title) : item.slug,
    };
    onChange(next);
  };

  const handleRichTextChange = (index, key, val) => {
    const next = [...items];
    const current = next[index];
    const updated = { ...current, [key]: val };

    const combinedText = `${updated.excerpt || ""} ${updated.content || ""}`;
    const autoTime = calculateReadTime(combinedText);

    next[index] = {
      ...updated,
      readTime: current.readTime && !current.readTime.endsWith("min read") ? current.readTime : autoTime,
    };
    onChange(next);
  };

  const uploadImage = async (file) => {
    const res = await adminUploadFile(token, file);
    return res.url;
  };

  // If currently editing a blog post, show the full editor form
  if (editingIndex !== null && items[editingIndex]) {
    const item = items[editingIndex];
    const cleanPostTitle = stripHtml(item.title) || `Post #${editingIndex + 1}`;

    return (
      <div className="space-y-5">
        {/* Editor Top Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-navy-700 dark:bg-navy-800/80">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditingIndex(null)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-200 dark:hover:bg-navy-700 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> All Posts
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent dark:bg-accent/20 dark:text-accent-light">
                  #{editingIndex + 1}
                </span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
                  {cleanPostTitle}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Edit post details, rich text styling, and full article content below.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => remove(editingIndex)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/50 px-3.5 py-2 text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-500 hover:text-white dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white transition-colors"
              title="Delete this post"
            >
              <Trash2 className="h-4 w-4" /> Delete Post
            </button>
            <button
              type="button"
              onClick={() => setEditingIndex(null)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-accent-dark transition-all"
            >
              <Check className="h-4 w-4" /> Done Editing
            </button>
          </div>
        </div>

        {/* Post Form Fields */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm dark:border-navy-700 dark:bg-navy-800/60">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span>Title</span>
                <FieldInfo text="The main headline of your blog post displayed on cards and the article page." />
              </label>
              <RichTextEditor
                value={item.title || ""}
                onChange={(v) => handleTitleChange(editingIndex, v)}
                placeholder="Post title"
                toolbarMode="fontOnly"
                showHeadingDropdown={true}
                singleLine={true}
                minHeight="42px"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span>URL Slug</span>
                <FieldInfo text="Unique URL path for this post (e.g. /blogs/my-post). Auto-generated from title." />
              </label>
              <input
                type="text"
                dir="auto"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
                value={item.slug || ""}
                placeholder="Auto-generated from title"
                onChange={(e) => updateItemField(editingIndex, "slug", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span>Category</span>
                <FieldInfo text="Topic tag for filtering and categorizing articles (e.g. Frontend, Backend, Career)." />
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
                value={item.category || ""}
                placeholder="Frontend"
                onChange={(e) => updateItemField(editingIndex, "category", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span>Date</span>
                <FieldInfo text="Publishing date shown on the post. Automatically defaults to today." />
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
                value={item.date || getCurrentDate()}
                onChange={(e) => updateItemField(editingIndex, "date", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span>Reading Time</span>
                <FieldInfo text="Estimated read duration. Automatically calculated from excerpt and content word counts." />
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
                value={item.readTime || ""}
                placeholder="Auto-calculated (e.g. 5 min read)"
                onChange={(e) => updateItemField(editingIndex, "readTime", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span>Author</span>
                <FieldInfo text="Name of the writer or author of this article (e.g. Syed Asad Jameel)." />
              </label>
              <RichTextEditor
                value={item.author || ""}
                onChange={(v) => updateItemField(editingIndex, "author", v)}
                placeholder="e.g. Syed Asad Jameel"
                toolbarMode="fontOnly"
                singleLine={true}
                minHeight="42px"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span>Tags</span>
                <FieldInfo text="Comma-separated keywords or tags for this article (e.g. IMEI, Mobile, Security)." />
              </label>
              <input
                type="text"
                dir="auto"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
                value={Array.isArray(item.tags) ? item.tags.join(", ") : (item.tags || "")}
                placeholder="e.g. Technology, Mobile, IMEI"
                onChange={(e) => {
                  const val = e.target.value;
                  const tagsArray = val.split(",").map((t) => t.trim()).filter(Boolean);
                  updateItemField(editingIndex, "tags", tagsArray);
                }}
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <div className="mb-1.5 flex flex-wrap items-center justify-between gap-1.5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <span>Thumbnail / Cover Image</span>
                  <FieldInfo text="Recommended: 1200 × 630 px (16:9 / 1.91:1 ratio). Minimum: 600 × 338 px. Used on blog listing cards and the article cover." />
                </label>
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  Recommended: <strong className="font-semibold text-slate-600 dark:text-slate-300">1200 × 630 px</strong> (16:9)
                </span>
              </div>
              <ImageUploadField
                value={item.thumbnail || ""}
                onChange={(v) => updateItemField(editingIndex, "thumbnail", v)}
              />
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Optimal dimensions: <strong className="font-semibold text-slate-700 dark:text-slate-300">1200 × 630 px</strong> (16:9 or 1.91:1 aspect ratio, e.g. 1920×1080). Supports PNG, JPG, WebP, SVG.
              </p>
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span>Excerpt</span>
                <FieldInfo text="Short preview summary displayed on blog listing cards and search engine snippets." />
              </label>
              <RichTextEditor
                value={item.excerpt || ""}
                onChange={(v) => handleRichTextChange(editingIndex, "excerpt", v)}
                placeholder="Short summary..."
                toolbarMode="fontOnly"
                showFontSizeDropdown={true}
                minHeight="84px"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span>Content</span>
                <FieldInfo text="The full article body. Supports rich text, headings, code blocks, lists, and images." />
              </label>
              <RichTextEditor
                value={item.content || ""}
                onChange={(v) => handleRichTextChange(editingIndex, "content", v)}
                minHeight="320px"
                placeholder="Write the article here."
                documentTitle={item.title ? `Article Content: ${stripHtml(item.title)}` : "Blog Post Content"}
                onSave={onSave}
                onImageUpload={uploadImage}
                toast={toast}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter items by search query if any
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleItems = items
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ item }) => {
      if (!normalizedQuery) return true;
      const title = stripHtml(item.title || "").toLowerCase();
      const author = stripHtml(item.author || "").toLowerCase();
      const category = (item.category || "").toLowerCase();
      const excerpt = stripHtml(item.excerpt || "").toLowerCase();
      return (
        title.includes(normalizedQuery) ||
        author.includes(normalizedQuery) ||
        category.includes(normalizedQuery) ||
        excerpt.includes(normalizedQuery)
      );
    });

  return (
    <div className="space-y-5">
      {/* Top Toolbar: Search & Add Post Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts by title, category, author..."
            className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-navy-700 dark:bg-navy-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 transition-colors shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={add}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-dark transition-all shrink-0"
        >
          <Plus className="h-4 w-4" /> Add Blog Post
        </button>
      </div>

      {/* Grid of Existing Blogs */}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-navy-600 dark:bg-navy-900/30">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent-light">
            <FileText className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">No blog posts yet</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Get started by creating your first article with rich typography and formatting.
          </p>
          <button
            type="button"
            onClick={add}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-accent-dark transition-all"
          >
            <Plus className="h-4 w-4" /> Create First Post
          </button>
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-navy-700 dark:bg-navy-800/50">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No blog posts found matching <span className="font-semibold text-slate-700 dark:text-slate-200">"{searchQuery}"</span>
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="mt-3 text-xs font-semibold text-accent hover:underline"
          >
            Clear search filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {visibleItems.map(({ item, originalIndex }) => (
            <div
              key={item.id || originalIndex}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300 dark:border-navy-700 dark:bg-navy-800/80 dark:hover:border-navy-600 transition-all"
            >
              <div>
                {/* Thumbnail Preview Banner */}
                {item.thumbnail ? (
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-navy-900 border-b border-slate-100 dark:border-navy-700/60">
                    <img
                      src={item.thumbnail}
                      alt={stripHtml(item.title) || "Thumbnail"}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-slate-900/70 backdrop-blur-md px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
                        {item.category || "General"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200/60 dark:from-navy-900 dark:to-navy-800/80 flex items-center justify-center border-b border-slate-100 dark:border-navy-700/50">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                      <ImageIcon className="h-4 w-4" /> No thumbnail
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent dark:bg-accent/20 dark:text-accent-light">
                        {item.category || "General"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-5 pb-0">
                  {/* Top Meta: Date */}
                  <div className="flex items-center justify-end gap-2 text-xs">
                    <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500 shrink-0">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatBlogDate(item.date)}
                    </span>
                  </div>

                  {/* Title with font preview */}
                  <h3 className="mt-2 text-base font-bold leading-snug text-slate-900 dark:text-white line-clamp-2 break-words w-full" dir="auto">
                    <RichTextViewer content={item.title || "Untitled Post"} className="card-title-prose text-inherit font-bold text-base block w-full" />
                  </h3>
                </div>
              </div>

              <div className="p-5 pt-0">
                {/* Author & Read Time */}
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-navy-700/60 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 truncate max-w-[140px]">
                    <User className="h-3.5 w-3.5 text-accent-light shrink-0" />
                    {item.author ? (
                      <RichTextViewer content={item.author} inline={true} className="truncate text-inherit" />
                    ) : (
                      <span className="italic text-slate-400">No author</span>
                    )}
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {item.readTime || "1 min read"}
                  </span>
                </div>

                {/* Card Action Buttons: Reorder, Edit, Delete */}
                <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-navy-700/60">
                  <div className="flex items-center gap-0.5 text-slate-400">
                    <button
                      type="button"
                      onClick={() => move(originalIndex, -1)}
                      disabled={originalIndex === 0}
                      className="rounded p-1 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-navy-700 dark:hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      title="Move post up"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(originalIndex, 1)}
                      disabled={originalIndex === items.length - 1}
                      className="rounded p-1 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-navy-700 dark:hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      title="Move post down"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingIndex(originalIndex)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-accent hover:text-accent dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-200 dark:hover:border-accent-light dark:hover:text-white transition-colors"
                      title="Edit blog post"
                    >
                      <Edit className="h-3.5 w-3.5 text-accent dark:text-accent-light" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(originalIndex)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50/60 p-1.5 text-xs font-semibold text-red-600 hover:bg-red-500 hover:text-white dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white transition-colors"
                      title="Delete blog post"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Quick Create Card */}
          <button
            type="button"
            onClick={add}
            className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-white/40 p-6 text-slate-500 hover:border-accent hover:bg-accent/5 hover:text-accent dark:border-navy-700 dark:bg-navy-800/30 dark:text-slate-400 dark:hover:border-accent/60 dark:hover:bg-navy-800/60 dark:hover:text-accent-light transition-all group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 group-hover:bg-accent group-hover:text-white dark:bg-navy-700 dark:text-slate-400 transition-all shadow-sm">
              <Plus className="h-6 w-6" />
            </div>
            <div className="text-center">
              <span className="text-sm font-bold block">New Blog Post</span>
              <span className="text-xs text-slate-400 dark:text-slate-500">Click to create and edit</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

function SaveBar({ dirty, saving, onSave, onDiscard }) {
  return (
    <div className={`fixed inset-x-0 bottom-0 z-30 transition-all duration-300 lg:pl-[var(--admin-sidebar-w,16rem)] ${dirty ? "translate-y-0" : "translate-y-full"}`}>
      <div className="mx-auto flex max-w-full items-center justify-between gap-4 border-t border-slate-200 bg-white/95 px-6 py-3.5 backdrop-blur-md shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.15)] dark:border-navy-700 dark:bg-navy-900/95 dark:shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.5)]">
        <span className="text-sm font-medium text-amber-600 dark:text-amber-300">You have unsaved changes.</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDiscard}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:text-slate-900 dark:border-navy-600 dark:text-slate-300 dark:hover:border-navy-500 dark:hover:text-white disabled:opacity-50 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Discard
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BlogsPage() {
  const { data, loading, error, saveSection } = usePortfolioData();
  const toast = useToast();
  const original = data?.[SECTION_KEY];

  const [draft, setDraft] = useState(() => clone(original) || []);
  const [saving, setSaving] = useState(false);

  // Re-sync the draft when original data loads or changes.
  useEffect(() => {
    setDraft(clone(original) || []);
  }, [original]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500 dark:text-red-300">
        <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
      </div>
    );
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(original || []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const sanitizedDraft = draft.map((post, idx) => {
        const title = post.title?.trim() || "";
        const slug = post.slug?.trim() || generateSlug(title) || `post-${idx + 1}`;
        const date = post.date?.trim() || getCurrentDate();
        const readTime = post.readTime?.trim() || calculateReadTime(`${post.excerpt || ""} ${post.content || ""}`);
        return {
          ...post,
          title,
          slug,
          date,
          readTime,
        };
      });

      await saveSection({ [SECTION_KEY]: sanitizedDraft });
      setDraft(sanitizedDraft);
      toast.success("Blog Posts updated.");
    } catch (err) {
      toast.error(err.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => setDraft(clone(original) || []);

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Blog Posts</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Write and manage the articles shown on the public blog.</p>
        </div>
        <span className="shrink-0 rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-navy-700 dark:text-slate-300">
          {draft.length} {draft.length === 1 ? ITEM_LABEL : `${ITEM_LABEL}s`}
        </span>
      </div>

      <BlogsEditor items={draft} onChange={setDraft} onSave={handleSave} />

      <SaveBar dirty={dirty} saving={saving} onSave={handleSave} onDiscard={handleDiscard} />
    </div>
  );
}
