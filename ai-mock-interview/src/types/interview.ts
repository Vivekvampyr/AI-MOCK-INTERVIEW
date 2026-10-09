export type ExperienceLevel =
  | "fresher"
  | "1-2"
  | "3-5"
  | "5+";

export interface InterviewSetup {
  experience: ExperienceLevel;
  techStack: string[];
}

export type WarningType =
  | "lip_movement"
  | "eye_movement"
  | "smart_device"
  | "tab_switch"
  | "fullscreen_exit";

export interface WarningEvent {
  id: number;
  type: WarningType;
  timestamp: number;
  questionNumber: number;
  confidence?: number;
}