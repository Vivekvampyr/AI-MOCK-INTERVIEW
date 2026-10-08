export interface InterviewQuestion {
  id: number;
  question_number: number;
  question: string;
  answer: string;
  technical_score: number | null;
  communication_score: number | null;
  completeness_score: number | null;
  overall_score: number | null;
  feedback: Record<string, unknown>;
}

export interface Interview {
  id: number;
  experience: string;
  tech_stack: string[];
  total_questions: number;
  current_question: number;
  total_score: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  questions: InterviewQuestion[];
  warnings: InterviewWarning[];
}

export interface InterviewWarning {
  id: number;
  question_number: number;
  warning_type:
    | "lip_movement"
    | "eye_movement"
    | "smart_device";
  timestamp_seconds: number;
  confidence: number | null;
  screenshot: string | null;
  created_at: string;
}