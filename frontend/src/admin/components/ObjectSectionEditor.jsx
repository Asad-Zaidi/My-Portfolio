import { useEffect, useState } from "react";
import FieldInput from "./FieldInput";
import ItemListEditor from "./ItemListEditor";
import SaveBar from "./SaveBar";
import { usePortfolioData } from "../context/PortfolioDataContext";
import { useToast } from "../context/ToastContext";

function clone(value) {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

export default function ObjectSectionEditor({ sectionKey, config }) {
  const { data, saveSection } = usePortfolioData();
  const toast = useToast();
  const original = data?.[sectionKey];

  const [draft, setDraft] = useState(() => clone(original) || {});
  const [saving, setSaving] = useState(false);

  // Re-sync the draft whenever the admin navigates to a different section.
  useEffect(() => {
    setDraft(clone(original) || {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionKey]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(original || {});

  const setField = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSection({ [sectionKey]: draft });
      toast.success(`${config.label} updated.`);
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
        <h1 className="text-xl font-bold text-white">{config.label}</h1>
        {config.description && <p className="mt-1 text-sm text-slate-400">{config.description}</p>}
      </div>

      <div className="grid gap-6 rounded-2xl border border-navy-700 bg-navy-800/50 p-6">
        {config.fields.map((field) => {
          if (field.type === "linkGroup") {
            const val = draft[field.key] || {};
            return (
              <div key={field.key}>
                <div className="mb-2 text-sm font-medium text-slate-300">{field.label}</div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FieldInput
                    field={{ key: "label", label: "Button Label", type: "text" }}
                    value={val.label}
                    onChange={(v) => setField(field.key, { ...val, label: v })}
                  />
                  <FieldInput
                    field={{ key: "href", label: "Link / Anchor", type: "text" }}
                    value={val.href}
                    onChange={(v) => setField(field.key, { ...val, href: v })}
                  />
                </div>
              </div>
            );
          }

          if (field.type === "stringList") {
            return (
              <div key={field.key}>
                <div className="mb-2 text-sm font-medium text-slate-300">{field.label}</div>
                <ItemListEditor
                  stringMode
                  items={draft[field.key] || []}
                  onChange={(next) => setField(field.key, next)}
                  itemLabel="line"
                />
              </div>
            );
          }

          if (field.type === "itemList") {
            return (
              <div key={field.key}>
                <div className="mb-2 text-sm font-medium text-slate-300">{field.label}</div>
                <ItemListEditor
                  items={draft[field.key] || []}
                  onChange={(next) => setField(field.key, next)}
                  fields={field.fields}
                  itemLabel={field.itemLabel || "item"}
                />
              </div>
            );
          }

          return <FieldInput key={field.key} field={field} value={draft[field.key]} onChange={(v) => setField(field.key, v)} />;
        })}
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={handleSave} onDiscard={handleDiscard} />
    </div>
  );
}
