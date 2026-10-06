import type { InterviewSetup } from "../types/interview";

const API_BASE_URL =
  "http://127.0.0.1:8000/api";

export async function startInterview(
  token: string,
  setup: InterviewSetup
) {
  const response = await fetch(
    `${API_BASE_URL}/interviews/start/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        experience: setup.experience,
        techStack: setup.techStack,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.error ||
        "Failed to start interview."
    );
  }

  return response.json();
}