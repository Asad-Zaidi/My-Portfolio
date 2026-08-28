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
  LuGripVertical as GripVertical,
} from "react-icons/lu";
import { BsInfoCircle } from "react-icons/bs";
import { RichTextEditor } from "../../../components/Rich Text";
import { adminUploadFile } from "../../../services/api";
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
  const s = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s;
}

function calculateReadTime(text = "") {
  const clean = (text || "").replace(/<[^>]*>/g, " ").trim();
  const words = clean.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
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

function BlogsEditor({ items = [], onChange, onSave }) {
  const { token } = useAuth();
  const toast = useToast();

  const move = (index, dir) => {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remove = (index) => onChange(items.filter((_, i) => i !== index));
  const add = () => {
    const today = getCurrentDate();
    onChange([
      ...items,
      {
        id: `${SECTION_KEY}-${Date.now().toString(36)}`,
        title: "",
        slug: "",
        category: "General",
        author: "",
        tags: [],
        date: today,
        readTime: "1 min read",
        excerpt: "",
        content: "",
      },
    ]);
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

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500 dark:border-navy-600 dark:bg-navy-900/30">
          No {ITEM_LABEL}s yet — add one below.
        </p>
      )}

      {items.map((item, index) => (
        <div key={index} className="group flex gap-3.5 rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm hover:border-slate-300 dark:border-navy-700 dark:bg-navy-800/60 dark:hover:border-navy-600 transition-colors">
          <div className="flex shrink-0 flex-col items-center gap-1 pt-1 text-slate-400 dark:text-slate-500">
            <GripVertical className="h-4 w-4" />
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              className="rounded p-0.5 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-navy-700 dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Move up"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === items.length - 1}
              className="rounded p-0.5 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-navy-700 dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Move down"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <span>Title</span>
                  <FieldInfo text="The main headline of your blog post displayed on cards and the article page." />
                </label>
                <input
                  type="text"
                  dir="auto"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
                  value={item.title || ""}
                  placeholder="Post title"
                  onChange={(e) => handleTitleChange(index, e.target.value)}
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
                  onChange={(e) => updateItemField(index, "slug", e.target.value)}
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
                  onChange={(e) => updateItemField(index, "category", e.target.value)}
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
                  onChange={(e) => updateItemField(index, "date", e.target.value)}
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
                  onChange={(e) => updateItemField(index, "readTime", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-2">
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <span>Author</span>
                  <FieldInfo text="Name of the writer or author of this article (e.g. Syed Asad Jameel)." />
                </label>
                <input
                  type="text"
                  dir="auto"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
                  value={item.author || ""}
                  placeholder="e.g. Syed Asad Jameel"
                  onChange={(e) => updateItemField(index, "author", e.target.value)}
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
                    updateItemField(index, "tags", tagsArray);
                  }}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <span>Excerpt</span>
                  <FieldInfo text="Short preview summary displayed on blog listing cards and search engine snippets." />
                </label>
                <textarea
                  rows={2}
                  dir="auto"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 transition-colors resize-y"
                  value={item.excerpt || ""}
                  placeholder="Short summary..."
                  onChange={(e) => updateItemField(index, "excerpt", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <span>Content</span>
                  <FieldInfo text="The full article body. Supports rich text, headings, code blocks, lists, and images." />
                </label>
                <RichTextEditor
                  value={item.content || ""}
                  onChange={(v) => handleRichTextChange(index, "content", v)}
                  minHeight="280px"
                  placeholder="Write the article here."
                  documentTitle={item.title ? `Article Content: ${item.title}` : "Blog Post Content"}
                  onSave={onSave}
                  onImageUpload={uploadImage}
                  toast={toast}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => remove(index)}
            className="h-fit shrink-0 rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
            aria-label={`Remove ${ITEM_LABEL}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white/50 py-3 text-sm font-semibold text-slate-600 hover:border-accent hover:text-accent dark:border-navy-600 dark:bg-transparent dark:text-slate-400 dark:hover:border-accent/60 dark:hover:text-accent-light transition-colors"
      >
        <Plus className="h-4 w-4" /> Add {ITEM_LABEL}
      </button>
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
            {saving ? <Loader2 className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
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

  // Re-sync the draft when this page mounts (i.e. the admin navigates here).
  useEffect(() => {
    setDraft(clone(original) || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        <Loader2 className="h-6 w-6" />
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
