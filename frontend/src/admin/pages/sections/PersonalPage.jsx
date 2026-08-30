import { useEffect, useRef, useState } from "react";
import {
  LuTriangleAlert as AlertTriangle,
  LuLoaderCircle as Loader2,
  LuSave as Save,
  LuRotateCcw as RotateCcw,
  LuCloudUpload as UploadCloud,
  LuExternalLink as ExternalLink,
} from "react-icons/lu";
import { adminUploadFile } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../components/ToastContext";
import { usePortfolioData } from "../../../context/PortfolioDataContext";

const SECTION_KEY = "personal";

function clone(value) {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-300">{label}</label>
      {children}
    </div>
  );
}

// A URL text field paired with a direct-to-Cloudinary upload button.
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
          placeholder="https://..."
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
        <input ref={inputRef} type="file" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>

      {value && (
        <div className="flex items-center gap-3 rounded-lg border border-navy-700 bg-navy-900/40 p-2">
          {isImage ? (
            <img src={value} alt="Preview" className="h-12 w-12 shrink-0 rounded-md object-cover" />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-navy-800 text-[10px] font-semibold text-slate-400">
              FILE
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

export default function PersonalPage() {
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
      toast.success("Personal Info updated.");
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
        <h1 className="text-xl font-bold text-white">Personal Info</h1>
        <p className="mt-1 text-sm text-slate-400">Who you are — shown in the hero, navbar and about section.</p>
      </div>

      <div className="grid gap-6 rounded-2xl border border-navy-700 bg-navy-800/50 p-6">
        <Field label="Full Display Name">
          <input type="text" className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" value={draft.name || ""} onChange={(e) => setField("name", e.target.value)} />
        </Field>
        <Field label="First Name">
          <input type="text" className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" value={draft.firstName || ""} onChange={(e) => setField("firstName", e.target.value)} />
        </Field>
        <Field label="Last Name">
          <input type="text" className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" value={draft.lastName || ""} onChange={(e) => setField("lastName", e.target.value)} />
        </Field>
        <Field label="Initials">
          <input type="text" className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" value={draft.initials || ""} onChange={(e) => setField("initials", e.target.value)} />
        </Field>
        <Field label="Professional Title">
          <input type="text" className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" value={draft.title || ""} onChange={(e) => setField("title", e.target.value)} />
        </Field>
        <Field label="Greeting">
          <input type="text" className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" value={draft.greeting || ""} onChange={(e) => setField("greeting", e.target.value)} />
        </Field>
        <Field label="Tagline">
          <textarea
            rows={4}
            className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 resize-y"
            value={draft.tagline || ""}
            onChange={(e) => setField("tagline", e.target.value)}
          />
        </Field>
        <Field label="Location">
          <input type="text" className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" value={draft.location || ""} onChange={(e) => setField("location", e.target.value)} />
        </Field>
        <Field label="Email">
          <input type="email" className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" value={draft.email || ""} onChange={(e) => setField("email", e.target.value)} />
        </Field>
        <Field label="Phone">
          <input type="text" className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" value={draft.phone || ""} onChange={(e) => setField("phone", e.target.value)} />
        </Field>
        <Field label="Date of Birth">
          <input type="text" className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" value={draft.dob || ""} onChange={(e) => setField("dob", e.target.value)} />
        </Field>
        <Field label="Nationality">
          <input type="text" className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" value={draft.nationality || ""} onChange={(e) => setField("nationality", e.target.value)} />
        </Field>
        <Field label="Availability">
          <input type="text" className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" value={draft.availability || ""} onChange={(e) => setField("availability", e.target.value)} />
        </Field>
        <Field label="Profile Image">
          <ImageUploadField value={draft.profileImage} onChange={(v) => setField("profileImage", v)} />
        </Field>
        <Field label="Hero Image">
          <ImageUploadField value={draft.heroImage} onChange={(v) => setField("heroImage", v)} />
        </Field>
        <Field label="Signature">
          <input type="text" className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" value={draft.signature || ""} onChange={(e) => setField("signature", e.target.value)} />
        </Field>
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={handleSave} onDiscard={handleDiscard} />
    </div>
  );
}
