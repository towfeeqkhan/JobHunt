import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { CloseIcon, SparklesIcon, LocationIcon, MoneyIcon } from "../icons";
import type { Job, JobFormData } from "../../types";
import {
  createApplication,
  parseJobDescription,
  type ParsedJobData,
} from "../../api/application";
import { addJobSchema, type AddJobFormValues } from "../../utils/validation";

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (job: JobFormData) => void;
  initialJob?: Job;
}

export const AddJobModal = ({
  isOpen,
  onClose,
  onSave,
  initialJob,
}: AddJobModalProps) => {
  const queryClient = useQueryClient();
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedJobData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddJobFormValues>({
    resolver: zodResolver(addJobSchema),
    defaultValues: {
      jobTitle: initialJob?.jobTitle || "",
      company: initialJob?.company || "",
      location: initialJob?.location || "",
      salaryRange: initialJob?.salaryRange || "",
      jobDescriptionRaw: initialJob?.jobDescriptionRaw || "",
    },
  });

  const jobDescriptionValue = watch("jobDescriptionRaw");

  const mutation = useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application created successfully!");
      reset();
      setParsedData(null);
      onClose();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error("Failed to create application:", error);
      toast.error(
        error.response?.data?.message || "Failed to create application",
      );
    },
  });

  if (!isOpen) return null;

  const handleParse = async () => {
    const raw = jobDescriptionValue?.trim();
    if (!raw || raw.length < 20) {
      toast.error(
        "Please paste a job description (at least a few sentences) before parsing.",
      );
      return;
    }

    setIsParsing(true);

    try {
      const parsed = await parseJobDescription(raw);
      setParsedData(parsed);

      // Autofill form fields with parsed data
      if (parsed.jobTitle) setValue("jobTitle", parsed.jobTitle);
      if (parsed.company) setValue("company", parsed.company);
      if (parsed.location) setValue("location", parsed.location);
      if (parsed.salaryRange) setValue("salaryRange", parsed.salaryRange);

      toast.success("Job description parsed successfully!");
    } catch (error: unknown) {
      const axiosErr = error as AxiosError<{ message?: string }>;
      console.error("Parse error:", axiosErr);
      toast.error(
        axiosErr.response?.data?.message || "Failed to parse job description",
      );
    } finally {
      setIsParsing(false);
    }
  };

  const onSubmit = (data: AddJobFormValues) => {
    if (initialJob && onSave) {
      onSave({
        jobTitle: data.jobTitle,
        company: data.company,
        location: data.location || "",
        salaryRange: data.salaryRange || "",
        jobDescriptionRaw: data.jobDescriptionRaw,
      });
      return;
    }

    mutation.mutate({
      ...data,
      jobDescriptionSummary: parsedData?.jobDescriptionSummary,
      resumeBulletSuggestions: parsedData?.resumeBulletSuggestions,
      status: "Applied",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#08060d]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative w-full max-w-212.5 bg-surface-container-lowest rounded-xl shadow-2xl flex flex-col overflow-y-auto max-h-[95vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 md:p-8 pb-4 md:pb-6">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-on-surface mb-1">
              Add New Application
            </h2>
            <p className="font-body text-on-surface-variant text-[15px]">
              Paste a job description and let JobHunt handle the details.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface bg-transparent border-0 cursor-pointer p-1 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 px-6 pb-6 md:px-8 md:pb-8 items-stretch">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-4">
            <p className="font-body font-bold text-[11px] uppercase tracking-wider text-on-surface-variant">
              Job Description
            </p>
            <div className="relative flex-1 min-h-37.5 md:min-h-75 flex flex-col">
              <textarea
                {...register("jobDescriptionRaw")}
                className={`flex-1 w-full bg-surface-container rounded-lg border p-5 font-body text-sm resize-none focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder:text-outline-variant ${errors.jobDescriptionRaw ? "border-red-500 text-red-500" : "border-transparent text-on-surface"}`}
                placeholder="Paste the full job post text here to extract data automatically..."
              />
              {errors.jobDescriptionRaw && (
                <p className="text-red-500 text-xs mt-1 absolute -bottom-5 right-0">
                  {errors.jobDescriptionRaw.message}
                </p>
              )}
              <div className="absolute bottom-4 right-5 flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${parsedData ? "bg-secondary" : "bg-primary/60"}`}
                />
                <span
                  className={`font-body text-xs font-semibold ${parsedData ? "text-secondary" : "text-primary/80"}`}
                >
                  {parsedData ? "Parsed ✓" : "Ready for parsing"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleParse}
              disabled={isParsing}
              className="w-full bg-primary hover:bg-[color-mix(in_srgb,var(--color-primary)_90%,black)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-white border-0 py-3.5 rounded-lg flex items-center justify-center gap-2 font-body font-bold text-[14px] cursor-pointer shadow-sm mt-4"
            >
              {isParsing ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Parsing with AI...
                </>
              ) : (
                <>
                  <SparklesIcon />
                  AI Parse Description
                </>
              )}
            </button>

            {/* Parsed Summary Preview */}
            {parsedData?.jobDescriptionSummary && (
              <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4 mt-1">
                <p className="font-body font-bold text-[11px] uppercase tracking-wider text-secondary mb-2">
                  AI Summary
                </p>
                <p className="font-body text-sm text-on-surface leading-relaxed">
                  {parsedData.jobDescriptionSummary}
                </p>
              </div>
            )}

            {/* Resume Bullet Suggestions */}
            {parsedData?.resumeBulletSuggestions &&
              parsedData.resumeBulletSuggestions.length > 0 && (
                <div className="bg-tertiary/5 border border-tertiary/20 rounded-lg p-4">
                  <p className="font-body font-bold text-[11px] uppercase tracking-wider text-tertiary mb-2">
                    Resume Bullet Suggestions
                  </p>
                  <ul className="list-disc list-inside space-y-1.5">
                    {parsedData.resumeBulletSuggestions.map((bullet, idx) => (
                      <li
                        key={idx}
                        className="font-body text-sm text-on-surface leading-relaxed"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col gap-6 pt-1">
            <div className="flex flex-col gap-2">
              <label className="font-body font-bold text-[11px] uppercase tracking-wider text-on-surface-variant">
                Job Title
              </label>
              <input
                {...register("jobTitle")}
                type="text"
                className={`w-full bg-surface-container-lowest border rounded-md px-3 py-2.5 font-body text-[15px] font-medium text-on-surface focus:outline-none focus:border-primary transition-colors placeholder:text-outline-variant/60 ${errors.jobTitle ? "border-red-500" : "border-surface-container-high"}`}
                placeholder="e.g. Senior Creative Director"
              />
              {errors.jobTitle && (
                <p className="text-red-500 text-xs">
                  {errors.jobTitle.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-body font-bold text-[11px] uppercase tracking-wider text-on-surface-variant">
                Company
              </label>
              <input
                {...register("company")}
                type="text"
                className={`w-full bg-surface-container-lowest border rounded-md px-3 py-2.5 font-body text-[15px] font-medium text-on-surface focus:outline-none focus:border-primary transition-colors placeholder:text-outline-variant/60 ${errors.company ? "border-red-500" : "border-surface-container-high"}`}
                placeholder="e.g. Acme Studio"
              />
              {errors.company && (
                <p className="text-red-500 text-xs">{errors.company.message}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="font-body font-bold text-[11px] uppercase tracking-wider text-on-surface-variant">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                    <LocationIcon />
                  </div>
                  <input
                    {...register("location")}
                    type="text"
                    className={`w-full bg-surface-container-lowest border rounded-md pl-8 pr-3 py-2.5 font-body text-[15px] font-medium text-on-surface focus:outline-none focus:border-primary transition-colors placeholder:text-outline-variant/60 ${errors.location ? "border-red-500" : "border-surface-container-high"}`}
                    placeholder="Remote / NY"
                  />
                </div>
                {errors.location && (
                  <p className="text-red-500 text-xs">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <label className="font-body font-bold text-[11px] uppercase tracking-wider text-on-surface-variant">
                  Salary Range
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                    <MoneyIcon />
                  </div>
                  <input
                    {...register("salaryRange")}
                    type="text"
                    className={`w-full bg-surface-container-lowest border rounded-md pl-8 pr-3 py-2.5 font-body text-[15px] font-medium text-on-surface focus:outline-none focus:border-primary transition-colors placeholder:text-outline-variant/60 ${errors.salaryRange ? "border-red-500" : "border-surface-container-high"}`}
                    placeholder="$120k - $160k"
                  />
                </div>
                {errors.salaryRange && (
                  <p className="text-red-500 text-xs">
                    {errors.salaryRange.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-auto flex items-center justify-end pt-8 gap-6">
              <button
                type="button"
                onClick={onClose}
                className="bg-transparent border-0 font-body font-bold text-sm text-primary hover:text-primary/70 transition-colors cursor-pointer px-2"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="bg-[#111] hover:bg-black text-white border-0 font-body font-semibold text-sm px-6 py-3 rounded-lg cursor-pointer transition-colors shadow-sm disabled:opacity-50"
              >
                {mutation.isPending ? "Saving..." : "Save Application"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
