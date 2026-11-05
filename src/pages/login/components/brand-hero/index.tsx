export function BrandHero() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      {/* Background SVG with the organic convex curved boundary and subtle ambient waves */}
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none"
        viewBox="0 0 650 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sribeesHeroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#59083c" />
            <stop offset="45%" stopColor="#800b55" />
            <stop offset="100%" stopColor="#D9145A" />
          </linearGradient>

          <linearGradient id="waveStroke1" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.04" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
          </linearGradient>

          <linearGradient id="waveStroke2" x1="0%" y1="20%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.02" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Main Curved Silhouette matching the reference curve */}
        <path
          d="M 0,0 L 460,0 C 620,240 650,400 650,500 C 650,600 620,760 460,1000 L 0,1000 Z"
          fill="url(#sribeesHeroGrad)"
        />

        {/* Layered fluid wave contours for rich organic depth */}
        <path
          d="M -50,150 Q 150,50 350,220 T 600,320"
          fill="none"
          stroke="url(#waveStroke1)"
          strokeWidth="48"
          strokeLinecap="round"
        />

        <path
          d="M -100,550 Q 180,420 360,650 T 630,680"
          fill="none"
          stroke="url(#waveStroke2)"
          strokeWidth="64"
          strokeLinecap="round"
        />

        <path
          d="M -20,850 Q 200,720 400,900 T 580,850"
          fill="none"
          stroke="url(#waveStroke1)"
          strokeWidth="36"
          strokeLinecap="round"
        />
      </svg>

      {/* Centered Brand Emblem & Typography */}
      <div className="relative z-10 flex flex-col items-center justify-center px-8 text-center select-none pr-8 lg:pr-16">
        {/* Brand Name with stylized ribbon loops mirroring the reference mark */}
        <div className="flex items-center gap-1.5 text-4xl sm:text-5xl xl:text-6xl font-black text-white tracking-tight">
          <span>Sri</span>

          {/* Stylized Modern Salon Wave / Ribbon Symbol */}
          <span className="inline-flex items-center justify-center px-0.5">
            <svg
              className="h-9 w-11 sm:h-11 sm:w-14 text-white"
              viewBox="0 0 64 48"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M12 36 C6 36 2 31.5 2 24 C2 16.5 6 12 12 12 C18 12 24 17 28 24 C32 31 38 36 44 36 C52 36 58 29.5 58 24 C58 18.5 52 12 44 12 C38 12 32 17 28 24 C24 31 18 36 12 36 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="28" cy="24" r="3.5" fill="currentColor" />
            </svg>
          </span>

          <span>bees</span>
        </div>

        {/* Subtitle matching "Order Management" in our Salon POS theme */}
        <p className="mt-3 text-base sm:text-lg font-medium tracking-wide text-primary-lighter/95">
          Salon Management
        </p>

        {/* Point of Sale badge */}
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-xs border border-white/15">
          <span>Point of Sale Edition</span>
        </div>
      </div>
    </div>
  );
}

export default BrandHero;
