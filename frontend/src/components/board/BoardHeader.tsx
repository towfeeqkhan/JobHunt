export const BoardHeader = ({ onExport }: { onExport?: () => void }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between items-start gap-4 mb-8 mt-6 shrink-0">
      <div>
        <h1 className="font-display font-extrabold text-[40px] leading-tight mb-2 text-on-surface tracking-tight">
          Active Applications
        </h1>
        <p className="font-body text-on-surface-variant text-[17px]">
          Manage and track the progress of your current job opportunities.
        </p>
      </div>
      <div>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-high hover:bg-surface-container-highest active:bg-surface-dim text-on-surface font-semibold rounded-2xl transition-all shadow-sm active:scale-95 text-sm"
        >
          <svg
            className="w-5 h-5 text-on-surface-variant"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Export CSV
        </button>
      </div>
    </div>
  );
};
