import { useParams } from "react-router-dom";
import { Loader2, AlertTriangle } from "lucide-react";
import { sectionsConfig } from "../config/sectionsConfig";
import ObjectSectionEditor from "../components/ObjectSectionEditor";
import ArraySectionEditor from "../components/ArraySectionEditor";
import { usePortfolioData } from "../context/PortfolioDataContext";

// One route handles every section — the config decides the shape and the
// field list, so adding a new section only ever means editing
// sectionsConfig.js.
export default function SectionPage() {
  const { sectionKey } = useParams();
  const { data, loading, error } = usePortfolioData();
  const config = sectionsConfig[sectionKey];

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

  if (!config) {
    return <p className="text-sm text-slate-400">Unknown section: {sectionKey}</p>;
  }

  return config.kind === "array" ? (
    <ArraySectionEditor sectionKey={sectionKey} config={config} />
  ) : (
    <ObjectSectionEditor sectionKey={sectionKey} config={config} />
  );
}
