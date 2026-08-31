import Skeleton from "../ui/Skeleton";

export function BlogsSkeleton() {
  return (
    <div className="min-h-screen bg-white text-slate-800 dark:bg-navy-950 dark:text-slate-200">
      {/* Skeleton Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-navy-800">
        <div className="mx-auto max-w-6xl flex h-full items-center justify-between px-6 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" className="h-10 w-10" />
            <div className="space-y-1.5 hidden sm:block">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-16 hidden sm:block" />
            <Skeleton className="h-4 w-16 hidden sm:block" />
            <Skeleton variant="circular" className="h-9 w-9" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-32 sm:px-8 lg:px-10">
        {/* Header Section */}
        <section className="border-b border-slate-200 pb-10 dark:border-navy-700 space-y-4">
          <Skeleton className="h-4 w-20" />
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="space-y-2 max-w-2xl w-full">
              <Skeleton className="h-10 w-4/5 sm:h-12" />
              <Skeleton className="h-8 w-2/3" />
            </div>
            <Skeleton className="h-10 w-full max-w-sm" />
          </div>
        </section>

        {/* Latest Posts Title Bar */}
        <section className="py-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* 6 Blog Card Skeletons */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 flex flex-col justify-between shadow-sm"
              >
                <div>
                  {/* Thumbnail Artwork Skeleton */}
                  <Skeleton className="h-48 w-full rounded-none" />

                  {/* Card Body */}
                  <div className="p-5 pb-0 space-y-3">
                    {/* Category & Date */}
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-3.5 w-24" />
                    </div>
                    {/* Title */}
                    <div className="space-y-1.5 pt-1">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-3/4" />
                    </div>
                    {/* Excerpt */}
                    <div className="space-y-1.5 pt-1">
                      <Skeleton className="h-3.5 w-full" />
                      <Skeleton className="h-3.5 w-5/6" />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-5 pt-4">
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-navy-700/60">
                    <Skeleton className="h-3.5 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default BlogsSkeleton;
