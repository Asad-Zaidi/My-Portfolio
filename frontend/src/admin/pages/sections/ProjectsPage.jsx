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
  LuPencil as Edit,
  LuCloudUpload as UploadCloud,
  LuExternalLink as ExternalLink,
  LuSparkles as Sparkles,
  LuSearch as Search,
  LuFolderGit2 as FolderGit2,
  LuArrowLeft as ArrowLeft,
  LuCode as Code,
  LuCheck as Check,
} from "react-icons/lu";
import { FaGithub } from "react-icons/fa6";
import { adminUploadFile } from "../../../api/api";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../components/ToastContext";
import { usePortfolioData } from "../../../context/PortfolioDataContext";
import { useTheme } from "../../../context/ThemeContext";
import { getTechIcon, TechIcon } from "../../../components/Skills";
import TechPickerInput from "../../components/TechPickerInput";

const SECTION_KEY = "projects";
const ITEM_LABEL = "project";

const CARD_GRADIENTS = [
  "from-indigo-600 via-purple-600 to-pink-600",
  "from-blue-600 via-cyan-600 to-teal-600",
  "from-emerald-600 via-teal-600 to-cyan-600",
  "from-violet-600 via-indigo-600 to-blue-600",
  "from-amber-500 via-orange-600 to-rose-600",
];

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
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-100 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:border-accent/60 hover:text-accent dark:border-navy-600 dark:bg-navy-800 dark:text-slate-200 dark:hover:border-accent/60 dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
          Upload
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>

      {value && (
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-navy-700 dark:bg-navy-900/40">
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
            className="flex min-w-0 flex-1 items-center gap-1 truncate text-xs text-slate-500 hover:text-accent dark:text-slate-400 dark:hover:text-accent-light"
          >
            <span className="truncate">{value}</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        </div>
      )}
    </div>
  );
}

function ProjectTechPill({ name }) {
  const tech = getTechIcon(name);
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-navy-700 dark:bg-navy-900/70 dark:text-slate-300">
      {tech ? (
        <TechIcon tech={tech} className="h-3 w-3 shrink-0" />
      ) : (
        <Code className="h-2.5 w-2.5 text-accent shrink-0" />
      )}
      <span className="truncate max-w-[100px]">{tech?.label || name}</span>
    </span>
  );
}

function ProjectsEditor({ items = [], onChange, editingIndex, setEditingIndex, onSave, saving }) {
  const { dark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToast();

  const move = (index, dir) => {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remove = (index) => {
    if (editingIndex !== null) {
      if (editingIndex === index) {
        setEditingIndex(null);
      } else if (editingIndex > index) {
        setEditingIndex(editingIndex - 1);
      }
    }
    const next = items.filter((_, i) => i !== index);
    onChange(next);
    toast.success("Project removed from list.");
  };

  const add = () => {
    const newProject = {
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
    };
    onChange([...items, newProject]);
    setEditingIndex(items.length);
  };

  const updateItemField = (index, key, val) => {
    const next = [...items];
    next[index] = { ...next[index], [key]: val };
    onChange(next);
  };

  // If currently editing a single project, show the focused editor form
  if (editingIndex !== null && items[editingIndex]) {
    const item = items[editingIndex];
    const projectTitle = item.title || `Project #${editingIndex + 1}`;

    return (
      <div className="space-y-6">
        {/* Editor Top Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-navy-700 dark:bg-navy-800/80">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditingIndex(null)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-200 dark:hover:bg-navy-700 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Projects Grid
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent dark:bg-accent/20 dark:text-accent-light">
                  #{editingIndex + 1}
                </span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
                  {projectTitle}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Edit project details, stack, thumbnail, and external links.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => remove(editingIndex)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/60 px-3.5 py-2 text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-500 hover:text-white dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white transition-colors"
              title="Delete this project"
            >
              <Trash2 className="h-4 w-4" /> Delete Project
            </button>
            <button
              type="button"
              onClick={() => setEditingIndex(null)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-accent-dark transition-colors shadow-sm"
            >
              <Check className="h-4 w-4" /> Done Editing
            </button>
          </div>
        </div>

        {/* Project Edit Form Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-700 dark:bg-navy-800/80">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Project Name / Title <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder="e.g. AI Portfolio Platform"
                value={item.title || ""}
                onChange={(e) => updateItemField(editingIndex, "title", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Category
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder="e.g. Full Stack, Web App, Mobile, AI/ML"
                value={item.category || ""}
                onChange={(e) => updateItemField(editingIndex, "category", e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 resize-y"
                placeholder="Brief overview of the project, architecture, problem solved, key features, etc."
                value={item.description || ""}
                onChange={(e) => updateItemField(editingIndex, "description", e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Project Thumbnail Image
              </label>
              <ImageUploadField
                value={item.image}
                onChange={(v) => updateItemField(editingIndex, "image", v)}
              />
            </div>

            <TechPickerInput
              label="Technologies (comma separated)"
              placeholder="React, Node.js, Tailwind CSS, MongoDB, TypeScript"
              value={item.technologies ?? ""}
              onChange={(val) => updateItemField(editingIndex, "technologies", val)}
              helpText="Icons are automatically rendered for matched tech (React, Python, TypeScript, Docker, etc.)."
            />

            <TechPickerInput
              label="Tools (comma separated)"
              placeholder="Docker, Git, VS Code, Postman, Figma"
              value={item.tools ?? ""}
              onChange={(val) => updateItemField(editingIndex, "tools", val)}
              helpText="Select or type tools used in this project."
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Live URL / Demo Link
              </label>
              <div className="relative">
                <input
                  type="url"
                  className="w-full rounded-lg border border-slate-300 bg-white pl-3.5 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
                  placeholder="https://myproject.com"
                  value={item.liveUrl || ""}
                  onChange={(e) => updateItemField(editingIndex, "liveUrl", e.target.value)}
                />
                {item.liveUrl && (
                  <a
                    href={item.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-accent dark:hover:text-accent-light"
                    title="Open live link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                GitHub / Code Repository URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  className="w-full rounded-lg border border-slate-300 bg-white pl-3.5 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
                  placeholder="https://github.com/username/project"
                  value={item.githubUrl || ""}
                  onChange={(e) => updateItemField(editingIndex, "githubUrl", e.target.value)}
                />
                {item.githubUrl && (
                  <a
                    href={item.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-accent dark:hover:text-accent-light"
                    title="Open GitHub repo"
                  >
                    <FaGithub className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="sm:col-span-2 flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-navy-700">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200 select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 bg-white text-accent focus:ring-accent/30 dark:border-navy-600 dark:bg-navy-900"
                  checked={Boolean(item.featured)}
                  onChange={(e) => updateItemField(editingIndex, "featured", e.target.checked)}
                />
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-accent" /> Mark as Featured Project
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter projects by search query
  const query = searchQuery.trim().toLowerCase();
  const visibleItems = items
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ item }) => {
      if (!query) return true;
      const title = (item.title || "").toLowerCase();
      const category = (item.category || "").toLowerCase();
      const tech = (typeof item.technologies === "string" ? item.technologies : "").toLowerCase();
      const tools = (typeof item.tools === "string" ? item.tools : "").toLowerCase();
      const desc = (item.description || "").toLowerCase();
      return (
        title.includes(query) ||
        category.includes(query) ||
        tech.includes(query) ||
        tools.includes(query) ||
        desc.includes(query)
      );
    });

  return (
    <div className="space-y-6">
      {/* Top Toolbar: Search & Add Project Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, category, tech..."
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
          <Plus className="h-4 w-4" /> Add Project
        </button>
      </div>

      {/* Grid of Existing Projects */}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-navy-600 dark:bg-navy-900/30">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent-light">
            <FolderGit2 className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">No projects yet</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Get started by adding your first showcase project with tech stack and demo links.
          </p>
          <button
            type="button"
            onClick={add}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-accent-dark transition-all"
          >
            <Plus className="h-4 w-4" /> Create First Project
          </button>
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-navy-700 dark:bg-navy-800/50">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No projects found matching <span className="font-semibold text-slate-700 dark:text-slate-200">"{searchQuery}"</span>
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
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-5 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-2 xl:grid-cols-3 md:overflow-visible md:pb-0 md:snap-none">
          {visibleItems.map(({ item, originalIndex }) => {
            const gradient = CARD_GRADIENTS[originalIndex % CARD_GRADIENTS.length];
            const techList = (typeof item.technologies === "string" ? item.technologies : "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);

            return (
              <div
                key={item.id || originalIndex}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300 dark:border-navy-700 dark:bg-navy-800/80 dark:hover:border-navy-600 transition-all duration-200 shrink-0 w-[85vw] max-w-[340px] sm:w-[340px] md:w-auto md:max-w-none snap-start md:snap-align-none"
              >
                <div>
                  {/* Thumbnail / Header Banner */}
                  {item.image ? (
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-navy-900 border-b border-slate-100 dark:border-navy-700/60">
                      <img
                        src={item.image}
                        alt={item.title || "Project preview"}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {item.category && (
                        <div className="absolute top-3 left-3 z-10">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm backdrop-blur-md border transition-colors ${
                              dark
                                ? "bg-slate-900 text-white border-slate-700"
                                : "bg-white text-slate-900 border-slate-300"
                            }`}
                            style={{
                              backgroundColor: dark ? "#0f172a" : "#ffffff",
                              color: dark ? "#f8fafc" : "#0f172a",
                              borderColor: dark ? "#334155" : "#cbd5e1",
                            }}
                          >
                            {item.category}
                          </span>
                        </div>
                      )}
                      {item.featured && (
                        <div className="absolute top-3 right-3 z-10">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold shadow-sm backdrop-blur-md border transition-colors ${
                              dark
                                ? "bg-amber-950/60 text-amber-300 border-amber-700/60"
                                : "bg-amber-50 text-amber-800 border-amber-300"
                            }`}
                            style={{
                              backgroundColor: dark ? "rgba(120, 53, 15, 0.4)" : "#fffbeb",
                              color: dark ? "#fef08a" : "#92400e",
                              borderColor: dark ? "rgba(245, 158, 11, 0.5)" : "#fcd34d",
                            }}
                          >
                            <Sparkles className="h-3 w-3" style={{ color: dark ? "#fef08a" : "#b45309" }} /> Featured
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`relative h-36 w-full overflow-hidden bg-gradient-to-br ${gradient} p-4 flex flex-col justify-between text-white border-b border-slate-100 dark:border-navy-700/50`}>
                      <div className="flex items-center justify-between gap-2">
                        {item.category ? (
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm backdrop-blur-md border transition-colors ${
                              dark
                                ? "bg-slate-900 text-white border-slate-700"
                                : "bg-white text-slate-900 border-slate-300"
                            }`}
                            style={{
                              backgroundColor: dark ? "#0f172a" : "#ffffff",
                              color: dark ? "#f8fafc" : "#0f172a",
                              borderColor: dark ? "#334155" : "#cbd5e1",
                            }}
                          >
                            {item.category}
                          </span>
                        ) : <span />}
                        {item.featured && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold shadow-sm backdrop-blur-md border transition-colors ${
                              dark
                                ? "bg-amber-950/60 text-amber-300 border-amber-700/60"
                                : "bg-amber-50 text-amber-800 border-amber-300"
                            }`}
                            style={{
                              backgroundColor: dark ? "rgba(120, 53, 15, 0.4)" : "#fffbeb",
                              color: dark ? "#fef08a" : "#92400e",
                              borderColor: dark ? "rgba(245, 158, 11, 0.5)" : "#fcd34d",
                            }}
                          >
                            <Sparkles className="h-3 w-3" style={{ color: dark ? "#fef08a" : "#b45309" }} /> Featured
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="h-6 w-6 opacity-80" />
                        <span className="font-bold text-sm truncate opacity-95">
                          {item.title || "Untitled Project"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Card Main Body */}
                  <div className="p-5 pb-0">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">
                      {item.title || <span className="italic text-slate-400">Untitled Project</span>}
                    </h3>

                    {item.description ? (
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs italic text-slate-400 dark:text-slate-500">
                        No description provided yet.
                      </p>
                    )}

                    {/* Tech Stack Badges Preview */}
                    {techList.length > 0 && (
                      <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                        {techList.slice(0, 3).map((t, i) => (
                          <ProjectTechPill key={i} name={t} />
                        ))}
                        {techList.length > 3 && (
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-navy-700 dark:text-slate-400">
                            +{techList.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Links & Action Buttons */}
                <div className="p-5 pt-0">
                  {/* External Links Bar */}
                  {(item.liveUrl || item.githubUrl) && (
                    <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-navy-700/60 dark:text-slate-400">
                      {item.liveUrl && (
                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-accent hover:underline truncate"
                          title={item.liveUrl}
                        >
                          <ExternalLink className="h-3 w-3 shrink-0" />
                          <span className="truncate">Live Demo</span>
                        </a>
                      )}
                      {item.githubUrl && (
                        <a
                          href={item.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white truncate"
                          title={item.githubUrl}
                        >
                          <FaGithub className="h-3 w-3 shrink-0" />
                          <span className="truncate">GitHub</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Action Buttons: Reorder + Edit + Delete */}
                  <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-navy-700/60">
                    <div className="flex items-center gap-0.5 text-slate-400">
                      <button
                        type="button"
                        onClick={() => move(originalIndex, -1)}
                        disabled={originalIndex === 0}
                        className="rounded p-1 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-navy-700 dark:hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                        title="Move project up"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(originalIndex, 1)}
                        disabled={originalIndex === items.length - 1}
                        className="rounded p-1 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-navy-700 dark:hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                        title="Move project down"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingIndex(originalIndex)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-accent hover:text-accent dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-200 dark:hover:border-accent-light dark:hover:text-white transition-colors"
                        title="Edit project"
                      >
                        <Edit className="h-3.5 w-3.5 text-accent dark:text-accent-light" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(originalIndex)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50/60 p-1.5 text-xs font-semibold text-red-600 hover:bg-red-500 hover:text-white dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Quick Create Card */}
          <button
            type="button"
            onClick={add}
            className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-white/40 p-6 text-slate-500 hover:border-accent hover:bg-accent/5 hover:text-accent dark:border-navy-700 dark:bg-navy-800/30 dark:text-slate-400 dark:hover:border-accent/60 dark:hover:bg-navy-800/60 dark:hover:text-accent-light transition-all group shrink-0 w-[85vw] max-w-[340px] sm:w-[340px] md:w-auto md:max-w-none snap-start md:snap-align-none"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 group-hover:bg-accent group-hover:text-white dark:bg-navy-700 dark:text-slate-400 transition-all shadow-sm">
              <Plus className="h-6 w-6" />
            </div>
            <div className="text-center">
              <span className="text-sm font-bold block">New Project</span>
              <span className="text-xs text-slate-400 dark:text-slate-500">Click to create and configure</span>
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
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:text-slate-900 dark:border-navy-600 dark:bg-navy-800 dark:text-slate-300 dark:hover:border-navy-500 dark:hover:text-white disabled:opacity-50 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Discard
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60 transition-colors shadow-sm"
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
  const [editingIndex, setEditingIndex] = useState(null);
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

  const handleDiscard = () => {
    setDraft(normalizeForEditing(original) || []);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-6 pb-24">
      {editingIndex === null && (
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Projects</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage portfolio projects, descriptions, tech stack, and links.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-slate-200 dark:bg-navy-700 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
            {draft.length} {draft.length === 1 ? ITEM_LABEL : `${ITEM_LABEL}s`}
          </span>
        </div>
      )}

      <ProjectsEditor
        items={draft}
        onChange={setDraft}
        editingIndex={editingIndex}
        setEditingIndex={setEditingIndex}
        onSave={handleSave}
        saving={saving}
      />

      <SaveBar dirty={dirty} saving={saving} onSave={handleSave} onDiscard={handleDiscard} />
    </div>
  );
}
