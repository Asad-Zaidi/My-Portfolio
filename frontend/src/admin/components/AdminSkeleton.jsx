import Skeleton from "../../components/ui/Skeleton";

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Title & subtitle */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* 5 Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-navy-700 dark:bg-navy-800/50"
          >
            <div className="space-y-2">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-3.5 w-24" />
            </div>
            <Skeleton variant="rounded" className="h-11 w-11 rounded-xl" />
          </div>
        ))}
      </div>

      {/* Last Updated Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-700 dark:bg-navy-800/50 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" className="h-4 w-4" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Quick Links Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-700 dark:bg-navy-800/50 space-y-4">
        <Skeleton className="h-4 w-24" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-navy-700"
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminSectionSkeleton({ title = "Loading Section" }) {
  return (
    <div className="space-y-6">
      {/* Top action header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-navy-700">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      {/* Form Container Cards */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-700 dark:bg-navy-800/50 space-y-6">
        <Skeleton className="h-5 w-40" />

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </div>

        <div className="grid gap-6 sm:grid-cols-3 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* List items cards */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-navy-700 dark:bg-navy-800/50"
          >
            <div className="flex items-center gap-3">
              <Skeleton variant="rounded" className="h-12 w-12 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminSectionSkeleton;
