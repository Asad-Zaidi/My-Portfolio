import { useRef, useState } from "react";
import { UploadCloud, Loader2, ExternalLink } from "lucide-react";
import { adminUploadFile } from "../../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

// A URL text field paired with a direct-to-Cloudinary upload button. Works
// for images and for arbitrary files (résumé PDF) alike.
export default function ImageUploadField({ value, onChange }) {
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
          className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-navy-600 bg-navy-800 px-3 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:border-accent/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
          Upload
        </button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
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
