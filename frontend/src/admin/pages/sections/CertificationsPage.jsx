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
  LuPencil as Edit,
  LuArrowLeft as ArrowLeft,
  LuCheck as Check,
} from "react-icons/lu";
import { adminUploadFile } from "../../../api/api";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../components/ToastContext";
import { usePortfolioData } from "../../../context/PortfolioDataContext";

const SECTION_KEY = "certifications";
const ITEM_LABEL = "certification";

function clone(value) {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
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

function CertificationFields({ item, index, updateItemField }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Title</label>
        <input
          type="text"
          className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          value={item.title || ""}
          onChange={(e) => updateItemField(index, "title", e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Provider</label>
        <input
          type="text"
          className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          value={item.provider || ""}
          onChange={(e) => updateItemField(index, "provider", e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Year</label>
        <input
          type="text"
          className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          value={item.year || ""}
          onChange={(e) => updateItemField(index, "year", e.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Certificate Image</label>
        <ImageUploadField value={item.image} onChange={(value) => updateItemField(index, "image", value)} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Credential ID</label>
        <input
          type="text"
          className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          value={item.credentialId || ""}
          onChange={(e) => updateItemField(index, "credentialId", e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Credential URL</label>
        <input
          type="url"
          className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          value={item.credentialUrl || ""}
          onChange={(e) => updateItemField(index, "credentialUrl", e.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Description</label>
        <textarea
          rows={4}
          className="w-full resize-y rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          value={item.description || ""}
          onChange={(e) => updateItemField(index, "description", e.target.value)}
        />
      </div>
    </div>
  );
}

function CertificationsEditor({ items = [], onChange }) {
  const [editingIndex, setEditingIndex] = useState(null);

  const move = (index, dir) => {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remove = (index) => {
    onChange(items.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
    else if (editingIndex !== null && editingIndex > index) setEditingIndex(editingIndex - 1);
  };
  const add = () => {
    onChange([
      ...items,
      {
        id: `${SECTION_KEY}-${Date.now().toString(36)}`,
        title: "",
        provider: "",
        year: "",
        image: "",
        credentialId: "",
        credentialUrl: "",
        description: "",
      },
    ]);
    setEditingIndex(items.length);
  };

  const updateItemField = (index, key, val) => {
    const next = [...items];
    next[index] = { ...next[index], [key]: val };
    onChange(next);
  };

  if (editingIndex !== null && items[editingIndex]) {
    const item = items[editingIndex];
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navy-700 bg-navy-800/80 p-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditingIndex(null)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-navy-600 bg-navy-900/60 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-accent/60 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Certifications
            </button>
            <div>
              <h2 className="text-sm font-bold text-white">{item.title || `Certification #${editingIndex + 1}`}</h2>
              <p className="text-xs text-slate-500">Edit certification details and credential information.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => remove(editingIndex)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white"
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
        <div className="rounded-2xl border border-navy-700 bg-navy-800/80 p-5">
          <CertificationFields item={item} index={editingIndex} updateItemField={updateItemField} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-navy-600 bg-navy-900/30 px-4 py-6 text-center text-sm text-slate-500">
          No {ITEM_LABEL}s yet — add one below.
        </p>
      )}

      {items.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <div key={item.id || index} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-navy-700 bg-navy-800/60 hover:border-navy-600">
              {item.image ? (
                <img src={item.image} alt={item.title || "Certificate preview"} className="h-40 w-full object-cover" />
              ) : (
                <div className="flex h-40 items-end bg-gradient-to-br from-accent/80 via-indigo-600 to-navy-900 p-4">
                  <span className="text-sm font-bold text-white">{item.title || "Untitled certification"}</span>
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                <h2 className="line-clamp-2 text-base font-bold text-white">{item.title || "Untitled certification"}</h2>
                <p className="mt-1 text-xs text-slate-400">{item.provider || "Provider not specified"}{item.year ? ` · ${item.year}` : ""}</p>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-300">{item.description || "No description provided yet."}</p>
                {item.credentialUrl && (
                  <a href={item.credentialUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent-light hover:underline">
                    <ExternalLink className="h-3 w-3" /> View credential
                  </a>
                )}
                <div className="mt-4 flex items-center justify-between border-t border-navy-700/70 pt-3">
                  <div className="flex items-center gap-0.5 text-slate-400">
                    <GripVertical className="mr-1 h-3.5 w-3.5" />
                    <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="rounded p-1 hover:bg-navy-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-20" title="Move certification up"><ChevronUp className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} className="rounded p-1 hover:bg-navy-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-20" title="Move certification down"><ChevronDown className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setEditingIndex(index)} className="inline-flex items-center gap-1.5 rounded-lg border border-navy-600 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-accent hover:text-white" title="Edit certification"><Edit className="h-3.5 w-3.5 text-accent-light" /> Edit</button>
                    <button type="button" onClick={() => remove(index)} className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 p-1.5 text-red-400 hover:bg-red-500 hover:text-white" title="Delete certification"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
  if (!dirty) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-xl border border-slate-700/80 bg-slate-900/95 px-5 py-3 shadow-2xl backdrop-blur">
      <div className="flex items-center gap-4">
        <span className="text-xs font-medium text-slate-300">
          Unsaved changes
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDiscard}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-60"
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

export default function CertificationsPage() {
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
      toast.success("Certifications updated.");
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
          <h1 className="text-xl font-bold text-white">Certifications</h1>
          <p className="mt-1 text-sm text-slate-400">Courses and certificates you've completed.</p>
        </div>
        <span className="shrink-0 rounded-full bg-navy-700 px-3 py-1 text-xs font-semibold text-slate-300">
          {draft.length} {draft.length === 1 ? ITEM_LABEL : `${ITEM_LABEL}s`}
        </span>
      </div>

      <CertificationsEditor items={draft} onChange={setDraft} />

      <SaveBar dirty={dirty} saving={saving} onSave={handleSave} onDiscard={handleDiscard} />
    </div>
  );
}
