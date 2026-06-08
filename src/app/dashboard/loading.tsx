export default function DashboardLoading() {
  return (
    <div className="fixed inset-0 bg-black z-100 flex items-center justify-center px-8 md:px-12 animate-pulse">
      <div className="max-w-7xl w-full h-150 grid lg:grid-cols-[1.1fr_1.4fr] gap-16 md:gap-24 items-stretch">
        {/* Left Side Skeleton - Roman Numeral & Text */}
        <div className="flex flex-col justify-center h-full border-r border-white/5 pr-12 space-y-6">
          <div className="h-32 w-48 bg-white/5 rounded-2xl" />{" "}
          {/* Roman Numeral */}
          <div className="h-16 w-64 bg-white/10 rounded-xl" /> {/* Title */}
          <div className="space-y-3">
            <div className="h-4 w-full bg-white/5 rounded-full" />
            <div className="h-4 w-5/6 bg-white/5 rounded-full" />
            <div className="h-4 w-4/6 bg-white/5 rounded-full" />
          </div>
        </div>

        {/* Right Side Skeleton - Luxury Card */}
        <div className="h-full bg-white/2 border border-white/10 rounded-3xl p-10 md:p-14 flex flex-col justify-between">
          <div className="space-y-12">
            <div className="h-8 w-48 bg-white/5 rounded-lg" />{" "}
            {/* Form Header */}
            <div className="space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <div className="h-12 bg-white/5 rounded-lg border-b border-white/10" />
                <div className="h-12 bg-white/5 rounded-lg border-b border-white/10" />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="h-12 bg-white/5 rounded-lg border-b border-white/10" />
                <div className="h-12 bg-white/5 rounded-lg border-b border-white/10" />
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-12">
            <div className="h-14 w-64 bg-white/5 rounded-full border border-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
