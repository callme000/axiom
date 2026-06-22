export default function DashboardLoading() {
  return (
    <div className="fixed inset-0 bg-black z-100 flex items-center justify-center px-8 md:px-12 animate-pulse font-mono">
      {/* Grid background overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      <div className="max-w-7xl w-full h-150 grid lg:grid-cols-[1.1fr_1.4fr] gap-16 md:gap-24 items-stretch relative z-10">
        {/* Left Side Skeleton - Phase Indicator & Instructions */}
        <div className="flex flex-col justify-center h-full border-r border-white/5 pr-12 space-y-6">
          <div className="h-24 w-32 bg-white/5 rounded-none border border-white/10" />{" "}
          {/* Roman Numeral Box */}
          <div className="h-12 w-64 bg-white/10 rounded-none" /> {/* Title Bar */}
          <div className="space-y-3">
            <div className="h-2.5 w-full bg-white/5 rounded-none" />
            <div className="h-2.5 w-5/6 bg-white/5 rounded-none" />
            <div className="h-2.5 w-4/6 bg-white/5 rounded-none" />
          </div>
        </div>

        {/* Right Side Skeleton - Clinical Setup Panel */}
        <div className="h-full bg-[#0a0a0a] border border-white/10 rounded-none p-10 md:p-14 flex flex-col justify-between shadow-2xl">
          <div className="space-y-12">
            <div className="h-6 w-48 bg-white/5 rounded-none border border-white/5" />{" "}
            {/* Header Block */}
            <div className="space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <div className="h-10 bg-white/5 rounded-none border-b border-white/10" />
                <div className="h-10 bg-white/5 rounded-none border-b border-white/10" />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="h-10 bg-white/5 rounded-none border-b border-white/10" />
                <div className="h-10 bg-white/5 rounded-none border-b border-white/10" />
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-12">
            <div className="h-12 w-64 bg-white/5 rounded-none border border-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
