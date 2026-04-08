import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ParsedJobData {
  jobTitle: string;
  company: string;
  location: string;
  salaryRange: string;
  jobDescriptionSummary: string;
  resumeBulletSuggestions: string[];
}

export async function parseJobDescription(
  jobDescription: string,
): Promise<ParsedJobData> {
  const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-120b:free",
    temperature: 0.2,

    response_format: { type: "json_object" },

    messages: [
      {
        role: "system",
        content: `
Extract structured job information from the job description.
If a field is not found, use an empty string (or empty array for resumeBulletSuggestions).

Return JSON format:

{
  "jobTitle": "",
  "company": "",
  "location": "",
  "salaryRange": "",
  "jobDescriptionSummary": "",
  "resumeBulletSuggestions": []
}

Rules:
- jobTitle: The exact job title from the posting.
- company: The company or organization name.
- location: Location or "Remote" if applicable.
- salaryRange: Salary range if mentioned, otherwise "".
- jobDescriptionSummary: A concise 2-3 sentence summary of the role.
- resumeBulletSuggestions: 3-5 tailored resume bullet points a candidate could use.
`,
      },
      {
        role: "user",
        content: jobDescription,
      },
    ],
  });

  const content = response.choices[0].message.content;

  if (!content) {
    throw new Error("OpenAI returned an empty response");
  }

  return JSON.parse(content) as ParsedJobData;
}
