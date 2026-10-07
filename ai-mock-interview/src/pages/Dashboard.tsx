import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/react";
import { useNavigate, Link } from "react-router-dom";
import {
  Plus,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
} from "lucide-react";

import InterviewSetupModal from "../components/InterviewSetupModal";
import type { InterviewSetup } from "../types/interview";
import { getInterviews, startInterview } from "../services/api";
import type { Interview } from "../types/api";

interface SessionRecord {
  id: number;
  role: string;
  techStack: string[];
  seniority: string;
  date: string;
  duration: string;
  score: number;
  status: "completed" | "in_progress";
  interview: Interview;
}


export default function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const handleInterviewSetup = async (setup: InterviewSetup) => {
    try {
      const token = await getToken();

      if (!token) {
        throw new Error("Authentication token unavailable.");
      }

      const interview = await startInterview(token, setup);

      setIsSetupOpen(false);

      navigate("/interview/permission", {
        state: {
          setup,
          interview,
        },
      });
    } catch (error) {
      console.error("Failed to start interview:", error);
    }
  };

  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const token = await getToken();

        if (!token) {
          throw new Error("Authentication token unavailable.");
        }

        const interviews = await getInterviews(token);

        const sessionRecords: SessionRecord[] = interviews.map(
          (interview) => ({
            id: interview.id,
            role: "Technical Interview",
            techStack: interview.tech_stack,
            seniority: `${interview.experience} yrs`,
            date: new Date(interview.created_at).toLocaleDateString(
              "en-IN",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            ),
            duration: "—",
            score: interview.total_score ?? 0,
            status:
              interview.status === "completed"
                ? "completed"
                : "in_progress",
            interview,
          })
        );

        setSessions(sessionRecords);
      } catch (error) {
        console.error("Failed to load interview history:", error);
      }
    };

    loadInterviews();
  }, [getToken]);

  const avgScore =
    sessions.length > 0
      ? Math.round(
          sessions.reduce((acc, session) => acc + session.score, 0) /
            sessions.length
        )
      : 0;

  const bestScore =
    sessions.length > 0
      ? Math.max(...sessions.map((session) => session.score))
      : 0;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#FAFAF8] text-[#1A1A1A] py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E5E0] pb-6">
          <div>
            <span className="text-xs font-medium text-[#0F5C5C] uppercase tracking-wider">
              Candidate Workspace
            </span>

            <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1A1A1A]">
              Welcome back, {user?.firstName || "Candidate"}
            </h1>

            <p className="mt-1 text-sm text-[#6B6B6B]">
              Track your technical interview progress, review feedback
              breakdowns, and run practice sessions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsSetupOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-[#0F5C5C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0A4444] shadow-subtle"
          >
            <Plus className="h-4 w-4" />
            <span>Start New Interview</span>
          </button>
        </div>

        {/* Overview Metric Row */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#E5E5E0] bg-white p-5 shadow-subtle">
            <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
              <span>Completed Sessions</span>
              <CheckCircle2 className="h-4 w-4 text-[#0F5C5C]" />
            </div>

            <div className="mt-2 text-2xl sm:text-3xl font-semibold text-[#1A1A1A]">
              {sessions.length}
            </div>

            <p className="mt-1 text-[11px] text-[#8C8C88]">
              Across 4 engineering specialties
            </p>
          </div>

          <div className="rounded-xl border border-[#E5E5E0] bg-white p-5 shadow-subtle">
            <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
              <span>Average Assessment Score</span>
              <TrendingUp className="h-4 w-4 text-[#0F5C5C]" />
            </div>

            <div className="mt-2 text-2xl sm:text-3xl font-semibold text-[#1A1A1A]">
              {avgScore}
              <span className="text-sm font-normal text-[#8C8C88]">/100</span>
            </div>

            <p className="mt-1 text-[11px] text-[#1F5F3F] font-medium">
              +11 pts improvement over last month
            </p>
          </div>

          <div className="rounded-xl border border-[#E5E5E0] bg-white p-5 shadow-subtle">
            <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
              <span>Highest Score</span>
              <Clock className="h-4 w-4 text-[#0F5C5C]" />
            </div>

            <div className="mt-2 text-2xl sm:text-3xl font-semibold text-[#1A1A1A]">
              {bestScore}
              <span className="text-sm font-normal text-[#8C8C88]">/100</span>
            </div>

            <p className="mt-1 text-[11px] text-[#8C8C88]">
              Achieved in Full Stack (React x Django)
            </p>
          </div>
        </div>

        {/* Score Trajectory */}
        <div className="rounded-xl border border-[#E5E5E0] bg-white p-6 shadow-subtle">
          <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-4">
            <div>
              <h2 className="text-sm font-semibold text-[#1A1A1A]">
                Score Trajectory
              </h2>

              <p className="mt-0.5 text-xs text-[#6B6B6B]">
                Performance trend across your last 4 evaluated technical
                sessions
              </p>
            </div>

            <span className="text-xs font-mono font-medium text-[#0F5C5C]">
              Recent: 85%
            </span>
          </div>

          <div className="mt-6">
            <div className="w-full">
              <svg
                viewBox="0 0 600 160"
                className="w-full h-36 overflow-visible"
                aria-label="Score trajectory line chart"
              >
                <line
                  x1="40"
                  y1="20"
                  x2="580"
                  y2="20"
                  stroke="#E5E5E0"
                  strokeDasharray="3 3"
                />

                <text
                  x="15"
                  y="24"
                  fontSize="10"
                  fill="#8C8C88"
                  fontFamily="sans-serif"
                >
                  100
                </text>

                <line
                  x1="40"
                  y1="60"
                  x2="580"
                  y2="60"
                  stroke="#E5E5E0"
                  strokeDasharray="3 3"
                />

                <text
                  x="18"
                  y="64"
                  fontSize="10"
                  fill="#8C8C88"
                  fontFamily="sans-serif"
                >
                  80
                </text>

                <line
                  x1="40"
                  y1="100"
                  x2="580"
                  y2="100"
                  stroke="#E5E5E0"
                  strokeDasharray="3 3"
                />

                <text
                  x="18"
                  y="104"
                  fontSize="10"
                  fill="#8C8C88"
                  fontFamily="sans-serif"
                >
                  60
                </text>

                <line
                  x1="40"
                  y1="140"
                  x2="580"
                  y2="140"
                  stroke="#E5E5E0"
                  strokeDasharray="3 3"
                />

                <text
                  x="18"
                  y="144"
                  fontSize="10"
                  fill="#8C8C88"
                  fontFamily="sans-serif"
                >
                  40
                </text>

                <polyline
                  fill="none"
                  stroke="#0F5C5C"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="90,72 230,64 380,58 530,50"
                />

                <g>
                  <circle cx="90" cy="72" r="4" fill="#0F5C5C" />

                  <text
                    x="90"
                    y="90"
                    textAnchor="middle"
                    fontSize="11"
                    fill="#1A1A1A"
                    fontWeight="500"
                  >
                    74%
                  </text>

                  <text
                    x="90"
                    y="155"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#8C8C88"
                  >
                    Sep 15
                  </text>
                </g>

                <g>
                  <circle cx="230" cy="64" r="4" fill="#0F5C5C" />

                  <text
                    x="230"
                    y="82"
                    textAnchor="middle"
                    fontSize="11"
                    fill="#1A1A1A"
                    fontWeight="500"
                  >
                    78%
                  </text>

                  <text
                    x="230"
                    y="155"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#8C8C88"
                  >
                    Sep 22
                  </text>
                </g>

                <g>
                  <circle cx="380" cy="58" r="4" fill="#0F5C5C" />

                  <text
                    x="380"
                    y="76"
                    textAnchor="middle"
                    fontSize="11"
                    fill="#1A1A1A"
                    fontWeight="500"
                  >
                    81%
                  </text>

                  <text
                    x="380"
                    y="155"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#8C8C88"
                  >
                    Sep 29
                  </text>
                </g>

                <g>
                  <circle cx="530" cy="50" r="4" fill="#0F5C5C" />

                  <text
                    x="530"
                    y="40"
                    textAnchor="middle"
                    fontSize="11"
                    fill="#0F5C5C"
                    fontWeight="600"
                  >
                    85%
                  </text>

                  <text
                    x="530"
                    y="155"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#8C8C88"
                  >
                    Oct 6
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Past Interview Sessions */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#1A1A1A]">
                Past Interview Sessions
              </h2>

              <p className="text-xs text-[#6B6B6B]">
                Detailed logs of all completed technical evaluations
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsSetupOpen(true)}
              className="text-xs font-medium text-[#0F5C5C] hover:text-[#0A4444]"
            >
              + Practice another role
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#E5E5E0] bg-white shadow-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#E5E5E0] bg-[#FAFAF8] text-[#6B6B6B]">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Role & Focus
                    </th>

                    <th scope="col" className="px-4 py-3 font-medium">
                      Date
                    </th>

                    <th scope="col" className="px-4 py-3 font-medium">
                      Seniority
                    </th>

                    <th scope="col" className="px-4 py-3 font-medium">
                      Duration
                    </th>

                    <th scope="col" className="px-4 py-3 font-medium">
                      Score
                    </th>

                    <th scope="col" className="px-4 py-3 font-medium">
                      Status
                    </th>

                    <th
                      scope="col"
                      className="px-5 py-3 text-right font-medium"
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E5E5E0] text-[#1A1A1A]">
                  {sessions.map((session) => (
                    <tr
                      key={session.id}
                      className="hover:bg-[#FAFAF8] transition"
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-[#1A1A1A]">
                          {session.role}
                        </div>

                        <div className="mt-0.5 text-[11px] text-[#6B6B6B]">
                          {session.techStack.join(" · ")}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-[#6B6B6B]">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-[#8C8C88]" />
                          {session.date}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-[#6B6B6B]">
                        {session.seniority}
                      </td>

                      <td className="px-4 py-3.5 text-[#6B6B6B] font-mono">
                        {session.duration}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-mono font-semibold text-[#0F5C5C]">
                          {session.score}%
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 rounded bg-[#EBF6EF] px-2 py-0.5 text-[11px] font-medium text-[#1F5F3F] border border-[#C8E5D3]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#1F5F3F]" />
                          Completed
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <Link
                          to="/interview/report"
                          state={{
                            interview: session.interview,
                          }}
                          className="inline-flex items-center gap-1 font-medium text-[#0F5C5C] hover:text-[#0A4444]"
                        >
                          <span>View Report</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      <InterviewSetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onContinue={handleInterviewSetup}
      />
    </div>
  );
}