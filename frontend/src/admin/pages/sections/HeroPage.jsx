import { useEffect, useState } from "react";
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
import { useToast } from "../../../components/ToastContext";
import { usePortfolioData } from "../../../context/PortfolioDataContext";

const SECTION_KEY = "hero";

function clone(value) {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

// A primary/secondary CTA button: a label + a link/anchor.
function LinkGroupField({ label, value = {}, onChange }) {
  return (
    <div>
      <div className="mb-2 text-sm font-medium text-slate-300">{label}</div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Button Label</label>
          <input
            type="text"
            className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            value={value.label || ""}
            onChange={(e) => onChange({ ...value, label: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Link / Anchor</label>
          <input
            type="text"
            className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            value={value.href || ""}
            onChange={(e) => onChange({ ...value, href: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

// Generic editor for an array of plain strings — the parent owns the array
// and receives the whole updated array on every change.
function ItemListEditor({ items = [], onChange, itemLabel = "item" }) {
  const move = (index, dir) => {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remove = (index) => onChange(items.filter((_, i) => i !== index));
  const add = () => onChange([...items, ""]);
  const updateString = (index, val) => {
    const next = [...items];
    next[index] = val;
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-navy-600 bg-navy-900/30 px-4 py-6 text-center text-sm text-slate-500">
          No {itemLabel}s yet — add one below.
        </p>
      )}

      {items.map((item, index) => (
        <div key={index} className="group flex gap-3 rounded-xl border border-navy-700 bg-navy-800/60 p-4 hover:border-navy-600">
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
            <input
              type="text"
              value={item}
              onChange={(e) => updateString(index, e.target.value)}
              className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <button
            type="button"
            onClick={() => remove(index)}
            className="h-fit shrink-0 rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
            aria-label={`Remove ${itemLabel}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-navy-600 py-3 text-sm font-semibold text-slate-400 hover:border-accent/60 hover:text-accent-light"
      >
        <Plus className="h-4 w-4" /> Add {itemLabel}
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
            {saving ? <Loader2 className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HeroPage() {
  const { data, loading, error, saveSection } = usePortfolioData();
  const toast = useToast();
  const original = data?.[SECTION_KEY];

  const [draft, setDraft] = useState(() => clone(original) || {});
  const [saving, setSaving] = useState(false);

  // Re-sync the draft when this page mounts (i.e. the admin navigates here).
  useEffect(() => {
    setDraft(clone(original) || {});
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
      <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
      </div>
    );
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(original || {});
  const setField = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSection({ [SECTION_KEY]: draft });
      toast.success("Hero Section updated.");
    } catch (err) {
      toast.error(err.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => setDraft(clone(original) || {});

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-xl font-bold text-white">Hero Section</h1>
        <p className="mt-1 text-sm text-slate-400">The landing banner: call-to-action buttons and the animated code snippet.</p>
      </div>

      <div className="grid gap-6 rounded-2xl border border-navy-700 bg-navy-800/50 p-6">
        <LinkGroupField label="Primary Button" value={draft.ctaPrimary} onChange={(v) => setField("ctaPrimary", v)} />
        <LinkGroupField label="Secondary Button" value={draft.ctaSecondary} onChange={(v) => setField("ctaSecondary", v)} />

        <div>
          <div className="mb-2 text-sm font-medium text-slate-300">Code Snippet (one line per row)</div>
          <ItemListEditor items={draft.codeSnippet || []} onChange={(next) => setField("codeSnippet", next)} itemLabel="line" />
        </div>
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={handleSave} onDiscard={handleDiscard} />
    </div>
  );
}
