export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 animate-pulse">
          <div className="aspect-square bg-slate-200 dark:bg-slate-700" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}
