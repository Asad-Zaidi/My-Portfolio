import { ChevronUp, ChevronDown, Trash2, Plus, GripVertical } from "lucide-react";
import FieldInput from "./FieldInput";

function emptyValueFor(type) {
  if (type === "number") return 0;
  if (type === "boolean") return false;
  return "";
}

function makeEmptyItem(fields, needsId, idPrefix) {
  const item = {};
  fields.forEach((f) => {
    item[f.key] = emptyValueFor(f.type);
  });
  if (needsId) item.id = `${idPrefix}-${Date.now().toString(36)}`;
  return item;
}

function makeEmptyString() {
  return "";
}

/**
 * Generic editor for an array — either an array of plain strings
 * (`stringMode`) or an array of objects described by `fields` (the same
 * shape used in sectionsConfig.js). Fully local/controlled: the parent owns
 * the array and receives the whole updated array on every change.
 */
export default function ItemListEditor({
  items = [],
  onChange,
  fields,
  stringMode = false,
  needsId = false,
  idPrefix = "item",
  itemLabel = "item",
}) {
  const move = (index, dir) => {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remove = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const add = () => {
    const newItem = stringMode ? makeEmptyString() : makeEmptyItem(fields, needsId, idPrefix);
    onChange([...items, newItem]);
  };

  const updateItemField = (index, key, val) => {
    const next = [...items];
    next[index] = { ...next[index], [key]: val };
    onChange(next);
  };

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
        <div
          key={index}
          className="group flex gap-3 rounded-xl border border-navy-700 bg-navy-800/60 p-4 transition-colors hover:border-navy-600"
        >
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
            {stringMode ? (
              <input
                type="text"
                value={item}
                onChange={(e) => updateString(index, e.target.value)}
                className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map((f) => (
                  <div key={f.key} className={f.type === "textarea" || f.type === "richtext" || f.type === "image" ? "sm:col-span-2" : ""}>
                    <FieldInput field={f} value={item[f.key]} onChange={(val) => updateItemField(index, f.key, val)} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => remove(index)}
            className="h-fit shrink-0 rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
            aria-label={`Remove ${itemLabel}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-navy-600 py-3 text-sm font-semibold text-slate-400 transition-colors hover:border-accent/60 hover:text-accent-light"
      >
        <Plus className="h-4 w-4" /> Add {itemLabel}
      </button>
    </div>
  );
}
