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
import { techIcons, getTechIcon, TechIcon } from "../../../components/Skills";

const SECTION_KEY = "skills";

function clone(value) {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

// Shared list chrome (reorder / remove / add) for both languages and tools —
// `renderFields` draws the item-specific inputs.
function ItemListEditor({ items = [], onChange, itemLabel, makeEmptyItem, renderFields }) {
  const move = (index, dir) => {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remove = (index) => onChange(items.filter((_, i) => i !== index));
  const add = () => onChange([...items, makeEmptyItem()]);

  const updateItemField = (index, key, val) => {
    const next = [...items];
    next[index] = { ...next[index], [key]: val };
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
            <div className="grid gap-4 sm:grid-cols-2">{renderFields(item, (key, val) => updateItemField(index, key, val))}</div>
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
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SkillsPage() {
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
      toast.success("Skills updated.");
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
        <h1 className="text-xl font-bold text-white">Skills</h1>
        <p className="mt-1 text-sm text-slate-400">Programming languages with proficiency bars, and the tools/tech logo grid.</p>
      </div>

      <div className="grid gap-6 rounded-2xl border border-navy-700 bg-navy-800/50 p-6">
        <div>
          <div className="mb-2 text-sm font-medium text-slate-300">Languages</div>
          <ItemListEditor
            items={draft.languages || []}
            onChange={(next) => setField("languages", next)}
            itemLabel="language"
            makeEmptyItem={() => ({ name: "", percent: 0, icon: "" })}
            renderFields={(item, update) => {
              const tech = getTechIcon(item.icon || item.name);
              const isCustom = item.icon && !techIcons.some((t) => t.key.toLowerCase() === (item.icon || "").toLowerCase());
              return (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-300">Name</label>
                    <input
                      type="text"
                      placeholder="e.g. JavaScript"
                      className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                      value={item.name || ""}
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-300">Icon</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <select
                          className="w-full appearance-none cursor-pointer rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 pr-8 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                          value={item.icon || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            update("icon", val);
                            if (!item.name && val) {
                              const found = getTechIcon(val);
                              if (found) update("name", found.label);
                            }
                          }}
                        >
                          <option value="" className="bg-navy-900 text-slate-400">
                            Auto / Select an icon...
                          </option>
                          {techIcons.map((t) => (
                            <option key={t.key} value={t.key} className="bg-navy-900 text-slate-100">
                              {t.label} ({t.key})
                            </option>
                          ))}
                          {isCustom && (
                            <option value={item.icon} className="bg-navy-900 text-amber-300">
                              {item.icon} (custom)
                            </option>
                          )}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-navy-600 bg-navy-900/60"
                        title={tech ? `${tech.label} (${tech.key})` : item.icon || "No icon selected"}
                      >
                        {tech ? (
                          <TechIcon tech={tech} className="h-5 w-5" />
                        ) : item.name ? (
                          <span className="text-xs font-bold text-accent">
                            {item.name.slice(0, 2).toUpperCase()}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-slate-500">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-slate-300">Proficiency %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                      value={item.percent ?? 0}
                      onChange={(e) => update("percent", Number(e.target.value))}
                    />
                  </div>
                </>
              );
            }}
          />
        </div>

        <div>
          <div className="mb-2 text-sm font-medium text-slate-300">Tools</div>
          <ItemListEditor
            items={draft.tools || []}
            onChange={(next) => setField("tools", next)}
            itemLabel="tool"
            makeEmptyItem={() => ({ name: "", icon: "" })}
            renderFields={(item, update) => {
              const tech = getTechIcon(item.icon);
              const isCustom = item.icon && !techIcons.some((t) => t.key.toLowerCase() === (item.icon || "").toLowerCase());
              return (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-300">Name</label>
                    <input
                      type="text"
                      placeholder="e.g. React"
                      className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                      value={item.name || ""}
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-300">Icon</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <select
                          className="w-full appearance-none cursor-pointer rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 pr-8 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                          value={item.icon || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            update("icon", val);
                            if (!item.name && val) {
                              const found = getTechIcon(val);
                              if (found) update("name", found.label);
                            }
                          }}
                        >
                          <option value="" className="bg-navy-900 text-slate-400">
                            Select an icon...
                          </option>
                          {techIcons.map((t) => (
                            <option key={t.key} value={t.key} className="bg-navy-900 text-slate-100">
                              {t.label} ({t.key})
                            </option>
                          ))}
                          {isCustom && (
                            <option value={item.icon} className="bg-navy-900 text-amber-300">
                              {item.icon} (custom)
                            </option>
                          )}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-navy-600 bg-navy-900/60"
                        title={tech ? `${tech.label} (${tech.key})` : item.icon || "No icon selected"}
                      >
                        {tech ? (
                          <TechIcon tech={tech} className="h-5 w-5" />
                        ) : item.name ? (
                          <span className="text-xs font-bold text-accent">
                            {item.name.slice(0, 2).toUpperCase()}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-slate-500">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              );
            }}
          />
        </div>
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={handleSave} onDiscard={handleDiscard} />
    </div>
  );
}
