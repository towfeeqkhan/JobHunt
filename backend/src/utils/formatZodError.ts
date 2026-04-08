import { ZodError } from "zod";

export const formatZodError = (zodError: ZodError) => {
  const formattedZodErrors: Record<string, string[]> = {};

  for (const issue of zodError.issues) {
    const field = issue.path.join(".") || "root";

    if (!formattedZodErrors[field]) {
      formattedZodErrors[field] = [];
    }

    formattedZodErrors[field].push(issue.message);
  }

  return formattedZodErrors;
};
