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
}