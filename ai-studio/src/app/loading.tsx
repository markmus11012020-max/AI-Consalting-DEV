export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5">
      <div className="w-full max-w-2xl space-y-4" aria-hidden="true">
        <div className="h-3 w-24 animate-pulse rounded-full bg-card" />
        <div className="h-10 w-4/5 animate-pulse rounded-xl bg-card" />
        <div className="h-10 w-3/5 animate-pulse rounded-xl bg-card" />
        <div className="h-4 w-full animate-pulse rounded-lg bg-card" />
        <div className="h-4 w-2/3 animate-pulse rounded-lg bg-card" />
      </div>
      <span className="sr-only">Загрузка…</span>
    </div>
  );
}
