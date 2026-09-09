import { useEffect, useRef, useState } from "react";
import {
  LuTriangleAlert as AlertTriangle,
  LuLoaderCircle as Loader2,
  LuSave as Save,
  LuRotateCcw as RotateCcw,
  LuPenLine as Edit3,
  LuArrowLeft as ArrowLeft,
  LuCheck as Check,
  LuPlus as Plus,
  LuTrash2 as Trash2,
} from "react-icons/lu";
import { useToast } from "../../../components/ToastContext";
import { usePortfolioData } from "../../../context/PortfolioDataContext";

const SECTION_KEY = "badges";
const ITEM_LABEL = "badge";

function clone(value) {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

function BadgePreview({ embedCode }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !embedCode?.trim()) return undefined;

    const parsed = new DOMParser().parseFromString(embedCode, "text/html");
    const scripts = [];

    Array.from(parsed.body.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === "script") {
        const source = node.getAttribute("src")?.replace(/^\/\//, "https://");
        if (!source || !source.startsWith("https://")) return;

        const script = document.createElement("script");
        script.src = source;
        script.async = node.hasAttribute("async");
        scripts.push(script);
        container.appendChild(script);
        return;
      }

      container.appendChild(document.importNode(node, true));
    });

    return () => {
      scripts.forEach((script) => script.remove());
      container.replaceChildren();
    };
  }, [embedCode]);

  return (
    <div
      ref={containerRef}
      className="flex h-[324px] w-[180px] items-center justify-center overflow-hidden rounded-lg bg-white"
      aria-label="Badge preview"
    />
  );
}

function BadgeListEditor({ items = [], onChange }) {
  const [editingIndex, setEditingIndex] = useState(null);

  const updateItemField = (index, key, value) => {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  };

  const remove = (index) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
    if (editingIndex === index) setEditingIndex(null);
    else if (editingIndex !== null && editingIndex > index) setEditingIndex(editingIndex - 1);
  };

  const add = () => {
    const item = { id: `${SECTION_KEY}-${Date.now().toString(36)}`, embedCode: "" };
    onChange([...items, item]);
    setEditingIndex(items.length);
  };

  if (editingIndex !== null && items[editingIndex]) {
    const item = items[editingIndex];
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-navy-700 dark:bg-navy-800/80">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditingIndex(null)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-accent/60 hover:text-slate-900 dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-200 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Badges
            </button>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Badge #{editingIndex + 1}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Edit the badge embed code.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => remove(editingIndex)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-500 hover:text-white dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
            <button
              type="button"
              onClick={() => setEditingIndex(null)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-white hover:bg-accent-dark"
            >
              <Check className="h-4 w-4" /> Done Editing
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-navy-700 dark:bg-navy-800/80">
          <div className="grid gap-5 lg:grid-cols-[180px_minmax(0,1fr)]">
            <BadgePreview embedCode={item.embedCode} />
            <div className="min-w-0">
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Badge Embed Code</label>
              <textarea
                rows={8}
                className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
                value={item.embedCode || ""}
                placeholder="Paste the complete badge embed code here"
                onChange={(e) => updateItemField(editingIndex, "embedCode", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500 dark:border-navy-600 dark:bg-navy-900/30">
          No {ITEM_LABEL}s yet — add one below.
        </p>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fit,180px)] justify-start gap-4">
          {items.map((item, index) => {
        const hasEmbed = Boolean(item.embedCode?.trim());

        return (
          <div key={item.id || index} className="relative flex w-[180px] min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white hover:border-slate-300 dark:border-navy-700 dark:bg-navy-800/60 dark:hover:border-navy-600">
            <div className="relative flex items-center justify-center bg-white p-0">
              <BadgePreview embedCode={item.embedCode} />
              {!hasEmbed && <span className="absolute text-xs font-semibold text-slate-500">No preview yet</span>}
            </div>
            <div className="absolute right-2 top-2 z-10 flex items-center gap-1">
              <button type="button" onClick={() => setEditingIndex(index)} className="p-1.5 text-slate-700 drop-shadow-md hover:text-accent" title="Edit badge" aria-label="Edit badge">
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => remove(index)} className="p-1.5 text-red-500 drop-shadow-md hover:text-red-700" title="Delete badge" aria-label="Delete badge">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={add}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 hover:border-accent/60 hover:text-accent dark:border-navy-600 dark:text-slate-400 dark:hover:text-accent-light"
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
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:text-slate-900 disabled:opacity-50 dark:border-navy-600 dark:bg-navy-800 dark:text-slate-300 dark:hover:border-navy-500 dark:hover:text-white"
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

export default function BadgesPage() {
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
      <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
      </div>
    );
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(original || []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSection({ [SECTION_KEY]: draft });
      toast.success("Badges updated.");
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
          <h1 className="text-xl font-bold text-white">Badges</h1>
          <p className="mt-1 text-sm text-slate-400">
            Paste an embed code from your badge provider. The embedded badge supplies its own content.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-navy-700 px-3 py-1 text-xs font-semibold text-slate-300">
          {draft.length} {draft.length === 1 ? ITEM_LABEL : `${ITEM_LABEL}s`}
        </span>
      </div>

      <BadgeListEditor items={draft} onChange={setDraft} />

      <SaveBar dirty={dirty} saving={saving} onSave={handleSave} onDiscard={handleDiscard} />
    </div>
  );
}
