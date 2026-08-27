import { RichTextEditor } from "../../components/Rich Text";
import ImageUploadField from "./ImageUploadField";
import { adminUploadFile } from "../../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const baseInput =
  "w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30";

// Renders one scalar field based on `type`. Nested shapes (linkGroup,
// stringList, itemList) are handled by ObjectSectionEditor/ItemListEditor —
// this component only knows about leaf values.
export default function FieldInput({ field, value, onChange }) {
  const { type, label, placeholder, min, max } = field;
  const { token } = useAuth();
  const toast = useToast();

  const wrap = (control) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-300">{label}</label>
      {control}
    </div>
  );

  switch (type) {
    case "textarea":
      return wrap(
        <textarea
          rows={4}
          className={`${baseInput} resize-y`}
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "richtext":
      // Not wired to any field in sectionsConfig.js yet — the public site's
      // components render these strings as plain text, so switching a field
      // to "richtext" here also requires swapping that field's renderer to
      // <RichTextViewer> on the public side, or saved HTML will show up as
      // literal tags. Left in place for when that pairing is done.
      return wrap(
        <RichTextEditor
          value={value || ""}
          onChange={onChange}
          minHeight="160px"
          placeholder={placeholder}
          onImageUpload={async (file) => {
            const res = await adminUploadFile(token, file);
            return res.url;
          }}
          toast={toast}
        />
      );

    case "color":
      return wrap(
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={value || "#2563eb"}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-14 shrink-0 cursor-pointer rounded-md border border-navy-600 bg-navy-900/60 p-1"
          />
          <input
            type="text"
            className={baseInput}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#2563eb"
          />
        </div>
      );

    case "number":
      return wrap(
        <input
          type="number"
          min={min}
          max={max}
          className={baseInput}
          value={value ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );

    case "boolean":
      return (
        <label className="flex items-center gap-2.5 text-sm font-medium text-slate-300 select-none">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-navy-600 bg-navy-900 text-accent focus:ring-accent/40"
          />
          {label}
        </label>
      );

    case "image":
      return wrap(<ImageUploadField value={value} onChange={onChange} />);

    case "url":
    case "email":
    case "text":
    default:
      return wrap(
        <input
          type={type === "email" ? "email" : type === "url" ? "url" : "text"}
          className={baseInput}
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}
