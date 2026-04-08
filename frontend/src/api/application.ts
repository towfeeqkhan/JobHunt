import api from "./axios";

export interface CreateApplicationPayload {
  jobDescriptionRaw: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  salaryRange?: string;
  jobDescriptionSummary?: string;
  resumeBulletSuggestions?: string[];
  status?: string;
}

export interface ParsedJobData {
  jobTitle: string;
  company: string;
  location: string;
  salaryRange: string;
  jobDescriptionSummary: string;
  resumeBulletSuggestions: string[];
}

export const createApplication = async (data: CreateApplicationPayload) => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/applications`;
  const response = await api.post(url, data);
  return response.data;
};

export const getApplications = async () => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/applications`;
  const response = await api.get(url);
  return response.data;
};

export const parseJobDescription = async (
  jobDescriptionRaw: string,
): Promise<ParsedJobData> => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/applications/parse`;
  const response = await api.post(url, { jobDescriptionRaw });
  return response.data.parsed;
};

