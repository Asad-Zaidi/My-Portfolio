import { useEffect, useState } from "react";
import {
  LuTriangleAlert as AlertTriangle,
  LuLoaderCircle as Loader2,
  LuSave as Save,
  LuRotateCcw as RotateCcw,
} from "react-icons/lu";
import { useToast } from "../../../components/ToastContext";
import { usePortfolioData } from "../../../context/PortfolioDataContext";

const SECTION_KEY = "contact";

function clone(value) {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
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

export default function ContactPage() {
  const { data, loading, error, saveSection } = usePortfolioData();
  const toast = useToast();
  const original = data?.[SECTION_KEY];

  const [draft, setDraft] = useState(() => clone(original) || {});
  const [saving, setSaving] = useState(false);

  // Re-sync the draft when original data loads or changes.
  useEffect(() => {
    setDraft(clone(original) || {});
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

  const dirty = JSON.stringify(draft) !== JSON.stringify(original || {});
  const setField = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSection({ [SECTION_KEY]: draft });
      toast.success("Contact Section updated.");
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
        <h1 className="text-xl font-bold text-white">Contact Section</h1>
        <p className="mt-1 text-sm text-slate-400">Heading and contact details shown in the Contact section.</p>
      </div>

      <div className="grid gap-6 rounded-2xl border border-navy-700 bg-navy-800/50 p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Heading</label>
          <input type="text" className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" value={draft.heading || ""} onChange={(e) => setField("heading", e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Description</label>
          <textarea
            rows={4}
            className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 resize-y"
            value={draft.description || ""}
            onChange={(e) => setField("description", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
          <input type="email" className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" value={draft.email || ""} onChange={(e) => setField("email", e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Phone</label>
          <input type="text" className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" value={draft.phone || ""} onChange={(e) => setField("phone", e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Location</label>
          <input type="text" className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" value={draft.location || ""} onChange={(e) => setField("location", e.target.value)} />
        </div>
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={handleSave} onDiscard={handleDiscard} />
    </div>
  );
}
