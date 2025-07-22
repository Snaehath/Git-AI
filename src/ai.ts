import * as dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function generateCommitMessage(diff: string): Promise<string> {
  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Generate a short, clear, single-line conventional Git commit message (e.g., feat: add login support) for the following Git diff:\n\n${diff}`,
              },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error("API Error:", res.status, await res.text());
      return "chore: update code";
    }

    const data = (await res.json()) as any;

    const message = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return message || "chore: update code";
  } catch (err) {
    console.error("Error generating commit message:", err);
    return "chore: update code";
  }
}

export async function generateReadmeFromFiles(
  fileSnippets: string[]
): Promise<string> {
  try {
    const prompt = `You are an experienced software engineer. Generate a professional and informative README.md file for the following project. Include sections like Project Description, Installation, Usage, and License if appropriate.\n\nHere are the code files:\n\n${fileSnippets.join(
      "\n\n"
    )}`;

    const res = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error("README API Error:", res.status, await res.text());
      return "# Project Title\n\nGenerated README content.";
    }

    const data = (await res.json()) as any;
    const readme = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return readme || "# Project Title\n\nGenerated README content.";
  } catch (err) {
    console.error("Error generating README:", err);
    return "# Project Title\n\nGenerated README content.";
  }
}
