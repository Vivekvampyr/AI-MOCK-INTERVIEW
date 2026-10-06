import type {
  Interview,
} from "../types/api";

import type {
  InterviewSetup,
} from "../types/interview";

const API_BASE_URL =
  "http://127.0.0.1:8000/api";

export async function startInterview(
  token: string,
  setup: InterviewSetup
): Promise<Interview> {

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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Failed to start interview."
    );
  }

  return data as Interview;
}