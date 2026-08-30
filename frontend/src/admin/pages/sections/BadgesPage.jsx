import { useEffect, useRef, useState } from "react";
import {
  LuTriangleAlert as AlertTriangle,
  LuLoaderCircle as Loader2,
  LuSave as Save,
  LuRotateCcw as RotateCcw,
  LuCode as Code,
  LuPenLine as Edit3,
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
  const [editing, setEditing] = useState(() => new Set());

  const updateItemField = (index, key, value) => {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  };

  const remove = (index) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
    setEditing((current) => {
      const next = new Set();
      current.forEach((value) => {
        if (value < index) next.add(value);
        if (value > index) next.add(value - 1);
      });
      return next;
    });
  };

  const add = () => {
    const item = { id: `${SECTION_KEY}-${Date.now().toString(36)}`, embedCode: "" };
    onChange([...items, item]);
    setEditing((current) => new Set(current).add(items.length));
  };

  const toggleEdit = (index) => {
    setEditing((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-navy-600 bg-navy-900/30 px-4 py-6 text-center text-sm text-slate-500">
          No {ITEM_LABEL}s yet — add one below.
        </p>
      )}

      {items.map((item, index) => {
        const hasEmbed = Boolean(item.embedCode?.trim());
        const isEditing = editing.has(index) || !hasEmbed;

        return (
          <div key={item.id || index} className="rounded-xl border border-navy-700 bg-navy-800/60 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-white">Badge {index + 1}</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {hasEmbed ? "Saved badge embed" : "Add an embed code to preview this badge"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {hasEmbed && (
                  <button
                    type="button"
                    onClick={() => toggleEdit(index)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-navy-600 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-accent/60 hover:text-white"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> {isEditing ? "Close" : "Edit"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>

            <div className={`mt-4 grid gap-5 ${isEditing && hasEmbed ? "lg:grid-cols-[180px_minmax(0,1fr)]" : ""}`}>
              {hasEmbed && <BadgePreview embedCode={item.embedCode} />}
              {isEditing && (
                <div className="min-w-0">
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Badge Embed Code</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 resize-y"
                    value={item.embedCode || ""}
                    placeholder="Paste the complete badge embed code here"
                    onChange={(e) => updateItemField(index, "embedCode", e.target.value)}
                  />
                </div>
              )}
            </div>

            {!isEditing && hasEmbed && (
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-300">
                <Code className="h-3.5 w-3.5" /> Embed preview loaded
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={add}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-navy-600 py-3 text-sm font-semibold text-slate-400 hover:border-accent/60 hover:text-accent-light"
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
