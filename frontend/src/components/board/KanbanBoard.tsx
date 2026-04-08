import { useState } from "react";
import { BoardHeader } from "./BoardHeader";
import { BoardColumn } from "./BoardColumn";
import { RocketIcon } from "../icons";
import type { Job } from "../../types";
import { exportJobsToCSV } from "../../utils/export";

export const KanbanBoard = ({
  jobs = [],
  onMoveJob,
  onJobClick,
}: {
  jobs?: Job[];
  onMoveJob?: (id: string, col: string) => void;
  onJobClick?: (job: Job) => void;
}) => {
  const [activeTab, setActiveTab] = useState("Applied");

  const columns = [
    {
      title: "Applied",
      count: jobs.filter((j) => j.column === "Applied").length,
      color: "bg-primary",
    },
    {
      title: "Phone Screen",
      count: jobs.filter((j) => j.column === "Phone Screen").length,
      color: "bg-tertiary",
    },
    {
      title: "Interview",
      count: jobs.filter((j) => j.column === "Interview").length,
      color: "bg-secondary",
    },
    {
      title: "Offer",
      count: jobs.filter((j) => j.column === "Offer").length,
      color: "bg-secondary-fixed-dim",
    },
    {
      title: "Rejected",
      count: jobs.filter((j) => j.column === "Rejected").length,
      color: "bg-outline-variant",
    },
  ];

  if (jobs.length === 0) {
    return (
      <div className="flex-1 w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-500 bg-surface">
        <div className="w-20 h-20 bg-primary-fixed rounded-3xl flex items-center justify-center mb-6 text-primary shadow-sm">
          <RocketIcon />
        </div>
        <h2 className="font-display font-bold text-[22px] text-on-surface mb-3">
          No Applications Found
        </h2>
        <p className="font-body text-on-surface-variant text-[15px] max-w-[320px] text-center leading-relaxed">
          Get started by adding your first job application using the Add new job
          button in the sidebar.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <BoardHeader onExport={() => exportJobsToCSV(jobs)} />

      {/* Mobile Filters */}
      <div
        className="lg:hidden flex overflow-x-auto gap-3 pb-4 shrink-0 transition-colors"
        style={{ scrollbarWidth: "none" }}
      >
        {columns.map((col, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(col.title)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full font-body text-sm font-semibold transition-colors border-0 cursor-pointer ${
              activeTab === col.title
                ? "bg-primary text-white shadow-sm"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {col.title} ({col.count})
          </button>
        ))}
      </div>

      {/* Board Scrollable Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex lg:gap-6 h-full items-start w-full">
          {columns.map((col, idx) => (
            <div
              key={idx}
              className={`h-full w-full lg:w-auto lg:flex-1 lg:min-w-0 ${activeTab === col.title ? "block" : "hidden lg:block"}`}
            >
              <BoardColumn
                title={col.title}
                count={col.count}
                indicatorColor={col.color}
                jobs={jobs.filter((j) => j.column === col.title)}
                onDropJob={(jobId) => onMoveJob?.(jobId, col.title)}
                onJobClick={onJobClick}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
