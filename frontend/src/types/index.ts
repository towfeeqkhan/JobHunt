export interface Job {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  salaryRange: string;
  jobDescriptionRaw: string;
  jobDescriptionSummary?: string;
  resumeBulletSuggestions?: string[];
  column: string;
  dateAdded: string;
}

export type JobFormData = Omit<Job, "id" | "column" | "dateAdded">;

