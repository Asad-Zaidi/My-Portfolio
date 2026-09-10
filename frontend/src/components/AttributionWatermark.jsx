const OFFICIAL_HOSTS = new Set(["asadzaidi.vercel.app", "www.asadzaidi.vercel.app"]);

export default function AttributionWatermark() {
  const hostname = typeof window === "undefined" ? "" : window.location.hostname.toLowerCase();

  if (OFFICIAL_HOSTS.has(hostname)) return null;

  return (
    <div className="fixed bottom-3 right-3 z-50 rounded-full border border-slate-300/70 bg-white/90 px-3 py-1.5 text-[11px] font-medium text-slate-600 shadow-lg backdrop-blur dark:border-white/15 dark:bg-navy-950/90 dark:text-slate-300">
      Asad Zaidi
    </div>
  );
}
