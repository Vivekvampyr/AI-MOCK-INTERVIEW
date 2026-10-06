import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface MediaContextValue {
  stream: MediaStream | null;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  startMedia: () => Promise<void>;
  stopMedia: () => void;
}

const MediaContext =
  createContext<MediaContextValue | undefined>(undefined);

interface MediaProviderProps {
  children: ReactNode;
}

export function MediaProvider({
  children,
}: MediaProviderProps) {
  const streamRef = useRef<MediaStream | null>(null);

  const [stream, setStream] =
    useState<MediaStream | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const isReady = useMemo(() => {
    if (!stream) {
      return false;
    }

    const videoReady = stream
      .getVideoTracks()
      .some((track) => track.readyState === "live");

    const audioReady = stream
      .getAudioTracks()
      .some((track) => track.readyState === "live");

    return videoReady && audioReady;
  }, [stream]);

  const stopCurrentStream = () => {
    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;
    setStream(null);
  };

  const startMedia = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Camera and microphone access is not supported in this browser/context."
        );
      }

      stopCurrentStream();

      // Test camera
      let cameraStream: MediaStream;

      try {
        cameraStream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
      } catch (error) {
        console.error("Camera error:", error);

        if (error instanceof DOMException) {
          throw new Error(
            `Camera error: ${error.name} - ${
              error.message || "Unable to access camera."
            }`
          );
        }

        throw new Error("Unable to access camera.");
      }

      // Test microphone
      let microphoneStream: MediaStream;

      try {
        microphoneStream =
          await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          });
      } catch (error) {
        console.error("Microphone error:", error);

        // Camera succeeded, so clean it up.
        cameraStream.getTracks().forEach((track) => {
          track.stop();
        });

        if (error instanceof DOMException) {
          throw new Error(
            `Microphone error: ${error.name} - ${
              error.message || "Unable to access microphone."
            }`
          );
        }

        throw new Error("Unable to access microphone.");
      }

      // Combine tracks into a single stream.
      const combinedStream = new MediaStream([
        ...cameraStream.getVideoTracks(),
        ...microphoneStream.getAudioTracks(),
      ]);

      streamRef.current = combinedStream;
      setStream(combinedStream);

    } catch (err) {
      console.error("Media access failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to access camera and microphone."
      );

      stopCurrentStream();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopMedia = useCallback(() => {
    stopCurrentStream();
  }, []);

  const value = useMemo(
    () => ({
      stream,
      isLoading,
      isReady,
      error,
      startMedia,
      stopMedia,
    }),
    [
      stream,
      isLoading,
      isReady,
      error,
      startMedia,
      stopMedia,
    ]
  );

  return (
    <MediaContext.Provider value={value}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const context = useContext(MediaContext);

  if (!context) {
    throw new Error(
      "useMedia must be used inside MediaProvider"
    );
  }

  return context;
}