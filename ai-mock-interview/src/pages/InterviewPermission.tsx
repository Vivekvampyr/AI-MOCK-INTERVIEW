import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Camera,
  Mic,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  Video,
} from "lucide-react";

import { useMedia } from "../context/MediaContext";
import type { Interview } from "../types/api";
import type { InterviewSetup } from "../types/interview";

interface LocationState {
  setup?: InterviewSetup;
  interview?: Interview;
}

export default function InterviewPermission() {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [fullscreenError, setFullscreenError] = useState("");

  const {
    stream,
    isLoading,
    isReady,
    error,
    startMedia,
  } = useMedia();

  const state = location.state as LocationState | null;

  useEffect(() => {
    if (!state?.setup) {
      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [state, navigate]);

  useEffect(() => {
    if (!videoRef.current || !stream) {
      return;
    }

    videoRef.current.srcObject = stream;
  }, [stream]);

  const handleContinue = async () => {
    if (!isReady) {
      return;
    }

    setFullscreenError("");

    try {
      if (!document.fullscreenElement) {
        const root = document.documentElement;

        if (typeof root.requestFullscreen !== "function") {
          throw new Error("Fullscreen is not supported.");
        }

        await root.requestFullscreen();
      }

      navigate("/interview", {
        state: {
          setup: state?.setup,
        },
      });
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);

      setFullscreenError(
        "Could not enable fullscreen. Please allow fullscreen access and click Continue to Interview again."
      );
    }
  };

  if (!state?.setup) {
    return null;
  }

  const cameraLive = Boolean(
    stream?.getVideoTracks().some((track) => track.readyState === "live")
  );
  const micLive = Boolean(
    stream?.getAudioTracks().some((track) => track.readyState === "live")
  );

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#FAFAF8] text-[#1A1A1A] py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Top Back navigation */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Page Header */}
        <div className="border-b border-[#E5E5E0] pb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#0F5C5C] uppercase tracking-wider">
              Step 2 of 3
            </span>
            <span className="text-xs text-[#8C8C88]">·</span>
            <span className="text-xs text-[#6B6B6B]">
              {state.setup.experience} Years Seniority · {state.setup.techStack.join(", ")}
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1A1A1A]">
            Hardware & Audio Verification
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#6B6B6B]">
            Confirm your camera and microphone access prior to entering the technical interview.
            This ensures your speech recognition and video feed operate reliably.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          {/* Camera Frame Preview */}
          <div className="overflow-hidden rounded-xl border border-[#E5E5E0] bg-white shadow-subtle">
            <div className="relative aspect-video w-full bg-[#1A1A1A]">
              {stream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#2A2A2A] text-[#8C8C88]">
                    <Video className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-xs font-medium text-[#8C8C88]">
                    Camera preview will display here once authorized
                  </p>
                </div>
              )}

              {/* Status overlay */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-md bg-white/95 px-2.5 py-1 text-xs font-medium text-[#1A1A1A] border border-[#E5E5E0]">
                <span
                  className={`h-2 w-2 rounded-full ${
                    cameraLive ? "bg-[#1F5F3F]" : "bg-[#8C8C88]"
                  }`}
                />
                <span>{cameraLive ? "Camera Live" : "Not connected"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#E5E5E0] px-5 py-3.5">
              <div>
                <p className="text-xs font-medium text-[#1A1A1A]">
                  Video Stream
                </p>
                <p className="text-[11px] text-[#8C8C88]">
                  Used for real-time pacing and presence check
                </p>
              </div>

              <StatusBadge ready={cameraLive} />
            </div>
          </div>

          {/* Checklist & Permissions Control */}
          <div className="flex flex-col justify-between rounded-xl border border-[#E5E5E0] bg-white p-6 shadow-subtle">
            <div>
              <h2 className="text-sm font-semibold text-[#1A1A1A]">
                Device Checklist
              </h2>
              <p className="mt-1 text-xs text-[#6B6B6B]">
                Verify both devices before proceeding to the questions.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-[#E5E5E0] bg-[#FAFAF8] p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white border border-[#E5E5E0] text-[#0F5C5C]">
                      <Camera className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#1A1A1A]">
                        Video Camera
                      </p>
                      <p className="text-[11px] text-[#8C8C88]">
                        High-definition webcam
                      </p>
                    </div>
                  </div>
                  <StatusBadge ready={cameraLive} />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-[#E5E5E0] bg-[#FAFAF8] p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white border border-[#E5E5E0] text-[#0F5C5C]">
                      <Mic className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#1A1A1A]">
                        Microphone
                      </p>
                      <p className="text-[11px] text-[#8C8C88]">
                        Voice recording & transcription
                      </p>
                    </div>
                  </div>
                  <StatusBadge ready={micLive} />
                </div>
              </div>

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-[#ECC5C5] bg-[#FCF0F0] p-3 text-xs text-[#962828]">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="mt-8 space-y-4">
              {fullscreenError && (
                <div
                  role="alert"
                  className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {fullscreenError}
                </div>
              )}
              {!isReady ? (
                <button
                  type="button"
                  onClick={startMedia}
                  disabled={isLoading}
                  className="w-full rounded-md bg-[#0F5C5C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0A4444] disabled:bg-[#D1D1CB] disabled:text-[#8C8C88]"
                >
                  {isLoading
                    ? "Requesting Device Access..."
                    : "Allow Camera & Microphone"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full rounded-md bg-[#0F5C5C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0A4444]"
                >
                  Continue to Interview
                </button>
              )}

              <div className="flex items-start gap-2 rounded-lg bg-[#F5F5F2] p-3 text-[11px] leading-relaxed text-[#6B6B6B]">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#0F5C5C] mt-0.5" />
                <span>
                  Audio and video permissions are utilized solely during your active mock interview.
                  Your recordings remain private to your candidate account.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ ready }: { ready: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-medium ${
        ready
          ? "bg-[#EBF6EF] text-[#1F5F3F] border border-[#C8E5D3]"
          : "bg-[#F5F5F2] text-[#6B6B6B] border border-[#E5E5E0]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          ready ? "bg-[#1F5F3F]" : "bg-[#8C8C88]"
        }`}
      />
      {ready ? "Ready" : "Not ready"}
    </span>
  );
}