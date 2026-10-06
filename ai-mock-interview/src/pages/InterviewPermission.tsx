import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useMedia } from "../context/MediaContext";

import type { InterviewSetup } from "../types/interview";

interface LocationState {
  setup?: InterviewSetup;
}

export default function InterviewPermission() {
  const navigate = useNavigate();
  const location = useLocation();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const {
    stream,
    isLoading,
    isReady,
    error,
    startMedia,
  } = useMedia();

  const state =
    location.state as LocationState | null;

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

  const handleContinue = () => {
    if (!isReady) {
      return;
    }

    navigate("/interview", {
      state: {
        setup: state?.setup,
      },
    });
  };

  if (!state?.setup) {
    return null;
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-medium text-violet-400">
            Step 2 of 3
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Camera & Microphone Check
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
            Your camera and microphone are required for
            interview recording and real-time interview
            monitoring.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Camera */}
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            <div className="relative aspect-video bg-black">
              {stream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl">
                      📷
                    </div>

                    <p className="mt-3 text-sm text-zinc-400">
                      Camera preview will appear here
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-zinc-800 px-5 py-4">
              <div>
                <p className="text-sm font-medium">
                  Camera
                </p>

                <p className="text-xs text-zinc-500">
                  Used for video recording and monitoring
                </p>
              </div>

              <StatusBadge
                ready={Boolean(
                  stream?.getVideoTracks().some(
                    (track) =>
                      track.readyState === "live"
                  )
                )}
              />
            </div>
          </div>

          {/* Permission panel */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold">
              Before you begin
            </h2>

            <div className="mt-6 space-y-4">
              <DeviceStatus
                title="Camera"
                description="Your camera will be recorded during the interview."
                ready={Boolean(
                  stream?.getVideoTracks().some(
                    (track) =>
                      track.readyState === "live"
                  )
                )}
              />

              <DeviceStatus
                title="Microphone"
                description="Audio will be recorded with your interview video."
                ready={Boolean(
                  stream?.getAudioTracks().some(
                    (track) =>
                      track.readyState === "live"
                  )
                )}
              />
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {!isReady && (
              <button
                type="button"
                onClick={startMedia}
                disabled={isLoading}
                className="mt-8 w-full rounded-xl bg-violet-600 px-5 py-3 font-medium text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-zinc-700"
              >
                {isLoading
                  ? "Requesting Permission..."
                  : "Allow Camera & Microphone"}
              </button>
            )}

            {isReady && (
              <button
                type="button"
                onClick={handleContinue}
                className="mt-8 w-full rounded-xl bg-violet-600 px-5 py-3 font-medium text-white hover:bg-violet-500"
              >
                Continue to Interview
              </button>
            )}

            <div className="mt-5 rounded-xl bg-zinc-950 p-4">
              <p className="text-xs leading-5 text-zinc-500">
                Monitoring currently includes lip movement,
                eye movement, and smart-device detection.
                Microphone access is used for audio recording,
                not question-reading detection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

interface StatusBadgeProps {
  ready: boolean;
}

function StatusBadge({
  ready,
}: StatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        ready
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-zinc-800 text-zinc-500"
      }`}
    >
      {ready ? "Ready" : "Not ready"}
    </span>
  );
}

interface DeviceStatusProps {
  title: string;
  description: string;
  ready: boolean;
}

function DeviceStatus({
  title,
  description,
  ready,
}: DeviceStatusProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <div>
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-zinc-500">
          {description}
        </p>
      </div>

      <StatusBadge ready={ready} />
    </div>
  );
}