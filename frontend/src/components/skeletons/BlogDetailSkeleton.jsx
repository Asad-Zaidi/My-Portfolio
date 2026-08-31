import Skeleton from "../ui/Skeleton";

export function BlogDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white text-slate-800 dark:bg-navy-950 dark:text-slate-200">
      {/* Skeleton Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-navy-800">
        <div className="mx-auto max-w-7xl flex h-full items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" className="h-10 w-10" />
            <div className="space-y-1.5 hidden sm:block">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-16 hidden sm:block" />
            <Skeleton variant="circular" className="h-9 w-9" />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-32 sm:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Big Post Hero Banner Skeleton */}
        <div className="relative min-h-[380px] sm:min-h-[460px] md:min-h-[520px] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/60 dark:border-navy-700/60 bg-slate-100 dark:bg-navy-900 flex flex-col items-center justify-center p-6 sm:p-10 text-center">
          <div className="max-w-3xl w-full flex flex-col items-center space-y-4">
            {/* Category & Tags */}
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            {/* Date & Read Time */}
            <Skeleton className="h-4 w-48" />

            {/* Title Lines */}
            <div className="space-y-3 w-full max-w-2xl py-2">
              <Skeleton className="h-10 sm:h-12 w-full mx-auto" />
              <Skeleton className="h-10 sm:h-12 w-4/5 mx-auto" />
            </div>

            {/* Author */}
            <div className="flex items-center justify-center gap-2.5 pt-4">
              <Skeleton variant="circular" className="h-9 w-9" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>

        {/* Article Body */}
        <article className="mt-10 max-w-full space-y-6">
          {/* Excerpt box */}
          <div className="rounded-2xl border-l-4 border-accent/40 bg-slate-50/80 p-5 sm:p-6 dark:bg-navy-900/50 space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
          </div>

          {/* Body paragraphs */}
          <div className="space-y-4 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          <div className="space-y-4 pt-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 border-t border-slate-200 pt-6 dark:border-navy-700">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </article>
      </main>
    </div>
  );
}

export default BlogDetailSkeleton;
