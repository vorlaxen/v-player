let sharedContext: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!sharedContext) {
    sharedContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }
  return sharedContext;
}