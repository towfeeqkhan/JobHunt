import type { Job } from '../../types';

interface BoardColumnProps {
  title: string;
  count: number;
  indicatorColor: string;
  jobs?: Job[];
  onDropJob?: (jobId: string) => void;
  onJobClick?: (job: Job) => void;
}

export const BoardColumn = ({ title, count, indicatorColor, jobs = [], onDropJob, onJobClick }: BoardColumnProps) => {
  return (
    <div className="flex flex-col flex-1 min-w-0 gap-4 h-full max-h-full">
      {/* Column Header - Hidden on Mobile (Replaced by Filter Pills) */}
      <div className="hidden lg:flex items-center justify-between mb-2 shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${indicatorColor}`} />
          <h3 className="font-body font-bold text-xs tracking-[0.08em] text-on-surface uppercase">{title}</h3>
          <span className="bg-primary-fixed text-primary text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
        </div>
      </div>

      {/* Cards Area Dropzone */}
      <div 
        className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto rounded-xl transition-colors duration-200 pr-1 pb-10"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const jobId = e.dataTransfer.getData('jobId');
          if (jobId && onDropJob) onDropJob(jobId);
        }}
      >
        {jobs.map(job => (
          <div 
            key={job.id} 
            draggable 
            onClick={() => onJobClick?.(job)}
            onDragStart={(e) => {
              e.dataTransfer.setData('jobId', job.id);
              e.dataTransfer.effectAllowed = 'move';
            }}
            className="bg-surface-container-lowest rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 border border-surface-container-high/60 p-5 cursor-grab active:cursor-grabbing flex flex-col group translate-y-0 hover:-translate-y-1 relative z-10"
          >
            <div className="flex items-start justify-between mb-4 pointer-events-none">
               <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center font-display font-extrabold text-primary text-xl shadow-sm">
                 {job.company.charAt(0).toUpperCase()}
               </div>
               <span className="font-body font-bold text-[10px] tracking-wider text-on-surface-variant uppercase">{job.dateAdded}</span>
            </div>
            <div>
               <h4 className="font-body font-bold text-on-surface text-[15px] leading-tight mb-1 transition-colors group-hover:text-primary">{job.jobTitle}</h4>
               <p className="font-body font-medium text-on-surface-variant text-[13px]">{job.company}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
