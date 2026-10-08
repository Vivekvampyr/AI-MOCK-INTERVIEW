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

export async function getInterviews(
  token: string
): Promise<Interview[]> {
  const response = await fetch(
    `${API_BASE_URL}/interviews/`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to fetch interviews."
    );
  }

  return data as Interview[];
}

export async function submitAnswer(
  token: string,
  interviewId: number,
  questionNumber: number,
  answer: string
) {
  const response = await fetch(
    `${API_BASE_URL}/interviews/${interviewId}/answer/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        question_number: questionNumber,
        answer,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to save answer."
    );
  }

  return data;
}

export async function terminateInterview(
  token: string,
  interviewId: number
) {
  const response = await fetch(
    `${API_BASE_URL}/interviews/${interviewId}/terminate/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to terminate interview."
    );
  }

  return data;
}

export async function createWarningEvent(
  token: string,
  interviewId: number,
  warningType:
    | "lip_movement"
    | "eye_movement"
    | "smart_device",
  questionNumber: number,
  timestampSeconds: number,
  confidence?: number,
  screenshot?: Blob
) {
  const formData = new FormData();

  formData.append("warning_type", warningType);
  formData.append(
    "question_number",
    String(questionNumber)
  );
  formData.append(
    "timestamp_seconds",
    String(timestampSeconds)
  );

  if (confidence !== undefined) {
    formData.append(
      "confidence",
      String(confidence)
    );
  }

  if (screenshot) {
    formData.append(
      "screenshot",
      screenshot,
      `warning-${Date.now()}.jpg`
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/interviews/${interviewId}/warning/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to save warning event."
    );
  }

  return data;
}

export async function uploadInterviewRecording(
  token: string,
  interviewId: number,
  recording: Blob
) {
  const formData = new FormData();

  formData.append(
    "recording",
    recording,
    `interview-${interviewId}.webm`
  );

  const response = await fetch(
    `${API_BASE_URL}/interviews/${interviewId}/recording/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Failed to upload interview recording."
    );
  }

  return data;
}