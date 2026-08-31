import { useEffect, useRef, useState } from "react";
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
  LuCloudUpload as UploadCloud,
  LuExternalLink as ExternalLink,
  LuSparkles as Sparkles,
} from "react-icons/lu";
import { adminUploadFile } from "../../../api/api";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../components/ToastContext";
import { usePortfolioData } from "../../../context/PortfolioDataContext";

const SECTION_KEY = "projects";
const ITEM_LABEL = "project";

function clone(value) {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

function normalizeForEditing(items = []) {
  return (items || []).map((item) => ({
    ...item,
    technologies: Array.isArray(item.technologies)
      ? item.technologies.join(", ")
      : item.technologies || "",
    tools: Array.isArray(item.tools)
      ? item.tools.join(", ")
      : item.tools || "",
  }));
}

function normalizeForSaving(items = []) {
  return (items || []).map((item) => ({
    ...item,
    technologies:
      typeof item.technologies === "string"
        ? item.technologies
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : Array.isArray(item.technologies)
        ? item.technologies
        : [],
    tools:
      typeof item.tools === "string"
        ? item.tools
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : Array.isArray(item.tools)
        ? item.tools
        : [],
  }));
}

function ImageUploadField({ value, onChange }) {
  const { token } = useAuth();
  const toast = useToast();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const isImage = /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i.test(value || "");

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await adminUploadFile(token, file);
      onChange(res.url);
      toast.success("File uploaded.");
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
          placeholder="https://... or upload below"
          className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-navy-600 bg-navy-800 px-3 py-2.5 text-xs font-semibold text-slate-200 hover:border-accent/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
          Upload
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>

      {value && (
        <div className="flex items-center gap-3 rounded-lg border border-navy-700 bg-navy-900/40 p-2">
          {isImage ? (
            <img src={value} alt="Preview" className="h-12 w-16 shrink-0 rounded-md object-cover" />
          ) : (
            <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md bg-navy-800 text-[10px] font-semibold text-slate-400">
              IMAGE
            </div>
          )}
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="flex min-w-0 flex-1 items-center gap-1 truncate text-xs text-slate-400 hover:text-accent-light"
          >
            <span className="truncate">{value}</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        </div>
      )}
    </div>
  );
}

function ProjectsEditor({ items = [], onChange }) {
  const move = (index, dir) => {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remove = (index) => onChange(items.filter((_, i) => i !== index));
  const add = () =>
    onChange([
      ...items,
      {
        id: `proj-${Date.now().toString(36)}`,
        title: "",
        category: "",
        description: "",
        image: "",
        technologies: "",
        tools: "",
        liveUrl: "",
        githubUrl: "",
        featured: false,
      },
    ]);

  const updateItemField = (index, key, val) => {
    const next = [...items];
    next[index] = { ...next[index], [key]: val };
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-navy-600 bg-navy-900/30 px-4 py-8 text-center text-sm text-slate-400">
          No projects found. Click the button below to add your first project.
        </p>
      )}

      {items.map((item, index) => (
        <div key={item.id || index} className="group flex gap-3 rounded-xl border border-navy-700 bg-navy-800/60 p-5 hover:border-navy-600">
          <div className="flex shrink-0 flex-col items-center gap-1 pt-1 text-slate-500">
            <GripVertical className="h-4 w-4" />
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              className="rounded p-0.5 hover:bg-navy-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Move up"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === items.length - 1}
              className="rounded p-0.5 hover:bg-navy-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Move down"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Project Name / Title</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                  placeholder="e.g. AI Portfolio CMS Platform"
                  value={item.title || ""}
                  onChange={(e) => updateItemField(index, "title", e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Category</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                  placeholder="e.g. Full Stack, Web App, Mobile, AI/ML"
                  value={item.category || ""}
                  onChange={(e) => updateItemField(index, "category", e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Description</label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 resize-y"
                  placeholder="Brief overview of the project, features, problem solved, etc."
                  value={item.description || ""}
                  onChange={(e) => updateItemField(index, "description", e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Project Thumbnail Image</label>
                <ImageUploadField value={item.image} onChange={(v) => updateItemField(index, "image", v)} />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Technologies (comma separated)</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                  placeholder="React, Node.js, Tailwind CSS, MongoDB, TypeScript"
                  value={item.technologies ?? ""}
                  onChange={(e) => updateItemField(index, "technologies", e.target.value)}
                />
                <span className="mt-1 block text-[11px] text-slate-400">
                  Icons are automatically rendered on the portfolio for matching tech (React, Python, TypeScript, Docker, etc.).
                </span>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Tools (comma separated)</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                  placeholder="Docker, Git, VS Code, Postman, Figma"
                  value={item.tools ?? ""}
                  onChange={(e) => updateItemField(index, "tools", e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Live URL / Demo Link</label>
                <input
                  type="url"
                  className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                  placeholder="https://myproject.com"
                  value={item.liveUrl || ""}
                  onChange={(e) => updateItemField(index, "liveUrl", e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">GitHub / Code Repository URL</label>
                <input
                  type="url"
                  className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                  placeholder="https://github.com/username/project"
                  value={item.githubUrl || ""}
                  onChange={(e) => updateItemField(index, "githubUrl", e.target.value)}
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-200">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-navy-600 bg-navy-900 text-accent focus:ring-accent/30"
                    checked={Boolean(item.featured)}
                    onChange={(e) => updateItemField(index, "featured", e.target.checked)}
                  />
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-accent" /> Mark as Featured Project
                  </span>
                </label>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => remove(index)}
            className="h-fit shrink-0 rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
            aria-label={`Remove ${ITEM_LABEL}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-navy-600 py-3.5 text-sm font-semibold text-slate-400 hover:border-accent/60 hover:text-accent-light transition-colors"
      >
        <Plus className="h-4 w-4" /> Add {ITEM_LABEL}
      </button>
    </div>
  );
}

function SaveBar({ dirty, saving, onSave, onDiscard }) {
  return (
    <div className={`fixed inset-x-0 bottom-0 z-30 transition-all duration-300 lg:pl-[var(--admin-sidebar-w,16rem)] ${dirty ? "translate-y-0" : "translate-y-full"}`}>
      <div className="mx-auto flex max-w-full items-center justify-between gap-4 border-t border-navy-700 bg-navy-900/95 px-6 py-3.5 backdrop-blur-md shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.5)]">
        <span className="text-sm font-medium text-amber-300">You have unsaved changes.</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDiscard}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg border border-navy-600 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-navy-500 hover:text-white disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Discard
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const { data, loading, error, saveSection } = usePortfolioData();
  const toast = useToast();
  const original = data?.[SECTION_KEY];

  const [draft, setDraft] = useState(() => normalizeForEditing(original) || []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(normalizeForEditing(original) || []);
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
      <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
      </div>
    );
  }

  const dirty = JSON.stringify(normalizeForSaving(draft)) !== JSON.stringify(original || []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = normalizeForSaving(draft);
      await saveSection({ [SECTION_KEY]: payload });
      toast.success("Projects updated.");
    } catch (err) {
      toast.error(err.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => setDraft(normalizeForEditing(original) || []);

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Projects</h1>
          <p className="mt-1 text-sm text-slate-400">Manage portfolio projects, descriptions, tech stack, and links.</p>
        </div>
        <span className="shrink-0 rounded-full bg-navy-700 px-3 py-1 text-xs font-semibold text-slate-300">
          {draft.length} {draft.length === 1 ? ITEM_LABEL : `${ITEM_LABEL}s`}
        </span>
      </div>

      <ProjectsEditor items={draft} onChange={setDraft} />

      <SaveBar dirty={dirty} saving={saving} onSave={handleSave} onDiscard={handleDiscard} />
    </div>
  );
}
