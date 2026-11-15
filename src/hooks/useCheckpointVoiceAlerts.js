
import { useEffect, useRef } from "react";

export default function useCheckpointVoiceAlerts({
  distance,
  checkpointName,
  enabled,
  routeKey,
}) {
  const spokenAlerts = useRef({
    routeKey: null,
    alerts: new Set(),
  });

  useEffect(() => {
    // Reset alerts when the tourist selects another route
    if (spokenAlerts.current.routeKey !== routeKey) {
      spokenAlerts.current = {
        routeKey,
        alerts: new Set(),
      };
    }

    if (!enabled || distance == null || !checkpointName) {
      return;
    }

    if (!("speechSynthesis" in window)) {
      console.warn("Speech synthesis is not supported.");
      return;
    }

    let stage = null;
    let message = "";

    if (distance <= 50) {
      stage = "arrival";
      message = `Attention! You are arriving at ${checkpointName} Checkpost. Please cooperate with the eco screening process.`;
    } else if (distance <= 200) {
      stage = "200m";
      message = `You are approximately 200 metres away from ${checkpointName} Checkpost. Please dispose of prohibited single-use plastic responsibly.`;
    } else if (distance <= 500) {
      stage = "500m";
      message = `Attention tourist! You are approximately 500 metres away from ${checkpointName} Checkpost. Please check your vehicle for single-use plastic items such as bottles, cups and covers. Dispose of prohibited plastic responsibly before entering the checkpost. Help protect the Nilgiris!`;
    }

    if (!stage || spokenAlerts.current.alerts.has(stage)) {
      return;
    }

    // Mark before speaking to prevent repeated announcements
    spokenAlerts.current.alerts.add(stage);

    const announcement = new SpeechSynthesisUtterance(message);

    announcement.lang = "en-IN";
    announcement.rate = 0.9;
    announcement.pitch = 1;
    announcement.volume = 1;

    window.speechSynthesis.speak(announcement);

  }, [distance, checkpointName, enabled, routeKey]);
}
