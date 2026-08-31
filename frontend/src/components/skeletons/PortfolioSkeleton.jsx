import Skeleton from "../ui/Skeleton";

export function PortfolioSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-navy-950 text-slate-800 dark:text-slate-200 overflow-x-hidden">
      {/* Skeleton Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-navy-800">
        <div className="container mx-auto flex h-full items-center justify-between px-8 md:px-32">
          {/* Logo & Name */}
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" className="h-10 w-10" />
            <div className="space-y-1.5 hidden sm:block">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>

          {/* Actions: Theme toggle & Resume button */}
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" className="h-9 w-9" />
            <Skeleton className="h-9 w-24 rounded-lg hidden sm:block" />
          </div>
        </div>
      </header>

      <main className="px-8 md:px-32 pt-28 pb-16">
        {/* Skeleton Hero Section */}
        <section className="py-12 md:py-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Greeting pill */}
              <Skeleton className="h-8 w-44 rounded-full" />

              {/* Heading / Name */}
              <div className="space-y-3">
                <Skeleton className="h-12 w-3/4 sm:h-14 sm:w-2/3" />
                <Skeleton className="h-10 w-1/2 sm:h-12" />
              </div>

              {/* Title & Tagline */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-full max-w-lg" />
                <Skeleton className="h-4 w-4/5 max-w-md" />
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-3 pt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} variant="circular" className="h-10 w-10" />
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Skeleton className="h-12 w-36 rounded-lg" />
                <Skeleton className="h-12 w-36 rounded-lg" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-xl">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-xl border border-slate-200/60 dark:border-navy-800 bg-slate-50 dark:bg-navy-900 p-3 text-center space-y-2">
                    <Skeleton className="h-6 w-12 mx-auto" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column / Avatar Visual */}
            <div className="relative mx-auto w-full max-w-sm flex items-center justify-center">
              <div className="aspect-square w-72 sm:w-80 rounded-3xl overflow-hidden p-3 border border-slate-200/60 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-900/50 flex items-center justify-center">
                <Skeleton className="h-full w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Skeleton About Section */}
        <section className="py-16 border-t border-slate-200/60 dark:border-navy-800">
          <div className="mb-10 space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>

          <div className="grid gap-10 lg:grid-cols-2 items-start">
            {/* Left text & traits */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />

              <div className="grid sm:grid-cols-2 gap-3 pt-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Right info card */}
            <div className="rounded-2xl border border-slate-200/60 dark:border-navy-800 bg-white dark:bg-navy-900 p-6 space-y-4">
              <Skeleton className="h-6 w-36 mb-4" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton variant="circular" className="h-8 w-8" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skeleton Projects Section */}
        <section className="py-16 border-t border-slate-200/60 dark:border-navy-800">
          <div className="mb-8 text-center sm:text-left space-y-2">
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-4 w-72" />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <Skeleton className="h-7 w-16 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>

          {/* 3 Project Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-slate-200/60 dark:border-navy-800 bg-white dark:bg-navy-800/90 shadow-card flex flex-col"
              >
                {/* 16:9 Banner */}
                <Skeleton className="aspect-[16/9] w-full rounded-none" />
                {/* Card Content */}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-navy-700/60">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skeleton Experience & Skills Section */}
        <section className="py-16 border-t border-slate-200/60 dark:border-navy-800">
          <div className="grid gap-12 lg:grid-cols-5 items-start">
            {/* Experience (3 cols) */}
            <div className="lg:col-span-3 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>

              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="rounded-xl border border-slate-200/60 dark:border-navy-800 bg-white dark:bg-navy-800 p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-3.5 w-32" />
                      </div>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            </div>

            {/* Skills (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-4 w-48" />
              </div>

              {/* Progress bars card */}
              <div className="rounded-xl border border-slate-200/60 dark:border-navy-800 bg-white dark:bg-navy-800 p-5 space-y-4">
                <Skeleton className="h-4 w-24 uppercase" />
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PortfolioSkeleton;
