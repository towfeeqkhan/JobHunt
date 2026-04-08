import type { Job } from "../types";

export const exportJobsToCSV = (jobs: Job[]) => {
  const headers = [
    "Company",
    "Job Title",
    "Location",
    "Salary Range",
    "Status",
    "Date Added",
    "Summary",
  ];

  const rows = jobs.map((job) => [
    job.company || "",
    job.jobTitle || "",
    job.location || "",
    job.salaryRange || "",
    job.column || "",
    job.dateAdded ? new Date(job.dateAdded).toLocaleDateString() : "",
    job.jobDescriptionSummary || "",
  ]);

  const csvContent = [headers, ...rows]
    .map((e) =>
      e.map((x) => `"${(x || "").toString().replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `job_applications_${new Date().toISOString().split("T")[0]}.csv`,
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
