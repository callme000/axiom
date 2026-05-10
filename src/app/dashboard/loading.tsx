export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto p-6 pb-20 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3">
          <div className="h-12 w-64 bg-foreground/10 rounded-2xl"></div>
          <div className="h-4 w-48 bg-foreground/10 rounded-full"></div>
        </div>
        <div className="flex gap-4">
          <div className="h-20 w-40 bg-foreground/10 rounded-2xl"></div>
          <div className="h-20 w-40 bg-foreground/10 rounded-2xl"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="h-96 bg-foreground/10 rounded-[2.5rem]"></div>
          <div className="h-48 bg-foreground/10 rounded-[2.5rem]"></div>
        </div>
        <div className="lg:col-span-8 space-y-10">
          <div className="space-y-4">
            <div className="h-8 w-48 bg-foreground/10 rounded-full"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 bg-foreground/10 rounded-3xl"></div>
              <div className="h-32 bg-foreground/10 rounded-3xl"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-8 w-48 bg-foreground/10 rounded-full"></div>
            <div className="space-y-4">
              <div className="h-24 bg-foreground/10 rounded-3xl"></div>
              <div className="h-24 bg-foreground/10 rounded-3xl"></div>
              <div className="h-24 bg-foreground/10 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
