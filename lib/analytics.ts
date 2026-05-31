import type { PostHog } from "posthog-js";

type AnalyticsMode = "off" | "basic" | "full";
type PostHogSessionRecordingControls = {
  startRecording?: () => void;
  stopRecording?: () => void;
};

const mode = (process.env.NEXT_PUBLIC_ANALYTICS_MODE ?? "off").toLowerCase() as AnalyticsMode;
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

let posthog: PostHog | null = null;
let initialized = false;
let initPromise: Promise<void> | null = null;
const queuedEvents: Array<{ event: string; props?: Record<string, unknown>; isExit?: boolean }> = [];

const basicEvents = new Set(["enter_begin", "enter_vine_crown", "exit"]);

function shouldTrackEvent(event: string) {
  if (mode === "off") {
    return false;
  }

  if (mode === "basic") {
    return basicEvents.has(event);
  }

  return true;
}

function flushQueuedEvents() {
  if (!posthog) {
    return;
  }

  for (const queued of queuedEvents) {
    if (queued.isExit) {
      posthog.capture(queued.event, queued.props, { transport: "sendBeacon" });
    } else {
      posthog.capture(queued.event, queued.props);
    }
  }

  queuedEvents.length = 0;
}

function getSessionRecordingControls() {
  return posthog?.sessionRecording as PostHogSessionRecordingControls | undefined;
}

async function initPostHog() {
  if (typeof window === "undefined") {
    return;
  }

  if (initialized) {
    return;
  }

  if (mode === "off") {
    return;
  }

  if (!posthogKey || !posthogHost) {
    return;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = import("posthog-js")
    .then(({ default: ph }) => {
      ph.init(posthogKey, {
        api_host: posthogHost,
        autocapture: false,
        disable_session_recording: mode !== "full",
        persistence: "localStorage",
        persistence_name: "ph",
      });

      posthog = ph;
      initialized = true;
      flushQueuedEvents();
    })
    .catch(() => {
      initPromise = null;
    });

  return initPromise;
}

export function initAnalytics() {
  void initPostHog();
}

export function stopSessionRecording() {
  if (typeof window === "undefined") {
    return;
  }

  const sessionRecording = getSessionRecordingControls();

  if (sessionRecording?.stopRecording) {
    sessionRecording.stopRecording();
  }
}

export function startSessionRecording() {
  if (typeof window === "undefined" || mode !== "full") {
    return;
  }

  const sessionRecording = getSessionRecordingControls();

  if (sessionRecording?.startRecording) {
    sessionRecording.startRecording();
    return;
  }

  void initPostHog().then(() => {
    const initializedSessionRecording = getSessionRecordingControls();

    if (initializedSessionRecording?.startRecording) {
      initializedSessionRecording.startRecording();
    }
  });
}

export function capture(event: string, props: Record<string, unknown> = {}) {
  if (!shouldTrackEvent(event)) {
    return;
  }

  if (initialized && posthog) {
    if (event === "exit") {
      posthog.capture(event, props, { transport: "sendBeacon" });
      return;
    }

    posthog.capture(event, props);
    return;
  }

  queuedEvents.push({ event, props, isExit: event === "exit" });
  void initPostHog();
}

export function getAnalyticsMode(): AnalyticsMode {
  return mode;
}
