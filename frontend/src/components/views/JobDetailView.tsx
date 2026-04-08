import { useState } from "react";
import { ArrowLeftIcon, SparklesIcon, EditIcon, TrashIcon } from "../icons";
import type { Job } from "../../types";

export const JobDetailView = ({
  job,
  onBack,
  onEdit,
  onDelete,
  onUpdateStatus,
}: {
  job: Job;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateStatus: (newStatus: string) => void;
}) => {
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const statuses = [
    "Applied",
    "Phone Screen",
    "Interview",
    "Offer",
    "Rejected",
  ];

  return (
    <div className="flex-1 flex flex-col w-full h-full p-6 lg:p-12 overflow-y-auto animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary font-body font-bold text-[14px] bg-transparent border-0 cursor-pointer w-fit p-0 hover:text-primary/80 transition-colors"
        >
          <ArrowLeftIcon /> Back to Board
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onEdit}
            className="bg-surface-container-lowest text-primary border border-surface-container-high/60 shadow-sm rounded-lg px-4 py-2 font-body font-bold text-[13px] flex items-center gap-2 cursor-pointer hover:bg-surface-container/50 transition-colors"
          >
            <EditIcon /> Edit
          </button>
          <button
            onClick={onDelete}
            className="bg-surface-container-lowest text-[#b91c1c] border border-surface-container-high/60 shadow-sm rounded-lg px-4 py-2 font-body font-bold text-[13px] flex items-center gap-2 cursor-pointer hover:bg-[#fef2f2] transition-colors"
          >
            <TrashIcon /> Delete
          </button>
          <div className="relative">
            <button
              onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
              className="bg-primary text-white shadow-[0_2px_10px_rgba(17,73,240,0.2)] rounded-lg px-5 py-2 border-0 font-body font-bold text-[13px] cursor-pointer hover:bg-primary/95 transition-colors"
            >
              Update Status
            </button>

            {isStatusMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsStatusMenuOpen(false)}
                />
                <div className="absolute top-full right-0 mt-3 border border-surface-container-high/50 bg-surface-container-lowest rounded-xl shadow-[0_8px_30px_rgba(25,28,30,0.08)] min-w-50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="py-2">
                    {statuses.map((status) => (
                      <div
                        key={status}
                        onClick={() => {
                          onUpdateStatus(status);
                          setIsStatusMenuOpen(false);
                        }}
                        className={`px-4 py-3 cursor-pointer flex items-center font-body text-[14px] font-medium transition-colors ${job.column === status ? "bg-primary-fixed/50 text-primary" : "text-on-surface hover:bg-surface-container-low"}`}
                      >
                        {status}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-10">
        <div className="w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center shadow-sm shrink-0">
          <span className="font-display font-extrabold text-primary text-3xl">
            {job.company.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="font-display font-extrabold text-on-surface text-3xl mb-1.5">
            {job.jobTitle}
          </h1>
          <p className="font-body text-on-surface-variant text-[16px] font-medium tracking-wide">
            {job.company} • {job.location || "Remote"}
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-8 shadow-sm max-w-4xl">
        <h2 className="font-display font-bold text-[22px] text-on-surface mb-8">
          Application Overview
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10 pb-10 border-b border-surface-container-high">
          <div>
            <p className="font-body font-bold text-[11px] uppercase tracking-widest text-on-surface-variant mb-3">
              Status
            </p>
            <span className="bg-primary text-white font-body font-bold text-[13px] px-3.5 py-1.5 rounded-full inline-flex cursor-pointer transition-colors shadow-sm">
              {job.column}
            </span>
          </div>
          <div>
            <p className="font-body font-bold text-[11px] uppercase tracking-widest text-on-surface-variant mb-3">
              Applied Date
            </p>
            <p className="font-body font-bold text-[15px] text-on-surface">
              {job.dateAdded}
            </p>
          </div>
          <div>
            <p className="font-body font-bold text-[11px] uppercase tracking-widest text-on-surface-variant mb-3">
              Salary Range
            </p>
            <p className="font-body font-bold text-[15px] text-on-surface">
              {job.salaryRange || "Not specified"}
            </p>
          </div>
          <div>
            <p className="font-body font-bold text-[11px] uppercase tracking-widest text-on-surface-variant mb-3">
              Source
            </p>
            <p className="font-body font-bold text-[15px] text-on-surface">
              Direct Application
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-body font-bold text-[16px] text-on-surface mb-4">
            Job Description Summary
          </h3>
          {job.jobDescriptionSummary ? (
            <p className="font-body text-[15px] leading-relaxed text-on-surface-variant">
              {job.jobDescriptionSummary}
            </p>
          ) : (
            <p className="font-body text-[14px] text-outline-variant italic">
              No AI summary yet. Edit this application and use "AI Parse
              Description" to generate one.
            </p>
          )}
        </div>
      </div>

      {job.resumeBulletSuggestions && job.resumeBulletSuggestions.length > 0 ? (
        <div className="bg-primary/5 rounded-3xl p-8 max-w-4xl mt-8 mb-12 border border-primary/10 transition-colors">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
              <SparklesIcon />
            </div>
            <div>
              <h2 className="font-display font-bold text-[22px] text-on-surface mb-0.5">
                AI Resume Enhancements
              </h2>
              <p className="font-body text-primary font-semibold text-[14px]">
                Tailored for the &lsquo;{job.jobTitle}&rsquo; role
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-surface-container-high/50 transition-colors">
            <p className="font-body font-bold text-[11px] uppercase tracking-widest text-on-surface-variant mb-5">
              Recommended Bullet Points:
            </p>
            <ul className="space-y-3 list-none m-0 p-0">
              {job.resumeBulletSuggestions.map((bullet, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-primary/50 shrink-0" />
                  <p className="font-body text-[15px] text-on-surface/80 leading-relaxed m-0">
                    {bullet}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container rounded-3xl p-8 max-w-4xl mt-8 mb-12 border border-surface-container-high/40">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center text-outline-variant shrink-0">
              <SparklesIcon />
            </div>
            <div>
              <h2 className="font-display font-bold text-[18px] text-on-surface-variant mb-0.5">
                AI Resume Enhancements
              </h2>
              <p className="font-body text-outline-variant text-[14px]">
                Use &ldquo;AI Parse Description&rdquo; when adding a job to
                generate tailored bullet point suggestions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
