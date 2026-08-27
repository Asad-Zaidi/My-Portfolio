import { useEffect, useState } from "react";
import ItemListEditor from "./ItemListEditor";
import SaveBar from "./SaveBar";
import { usePortfolioData } from "../context/PortfolioDataContext";
import { useToast } from "../context/ToastContext";

function clone(value) {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

export default function ArraySectionEditor({ sectionKey, config }) {
  const { data, saveSection } = usePortfolioData();
  const toast = useToast();
  const original = data?.[sectionKey];

  const [draft, setDraft] = useState(() => clone(original) || []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(clone(original) || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionKey]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(original || []);

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

  const handleDiscard = () => setDraft(clone(original) || []);

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">{config.label}</h1>
          {config.description && <p className="mt-1 text-sm text-slate-400">{config.description}</p>}
        </div>
        <span className="shrink-0 rounded-full bg-navy-700 px-3 py-1 text-xs font-semibold text-slate-300">
          {draft.length} {draft.length === 1 ? config.itemLabel : `${config.itemLabel}s`}
        </span>
      </div>

      <ItemListEditor
        items={draft}
        onChange={setDraft}
        fields={config.fields}
        needsId={config.needsId}
        idPrefix={sectionKey}
        itemLabel={config.itemLabel}
      />

      <SaveBar dirty={dirty} saving={saving} onSave={handleSave} onDiscard={handleDiscard} />
    </div>
  );
}
