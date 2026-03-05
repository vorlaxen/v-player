export const KEYBOARD_SHORTCUTS = {
  PLAY_PAUSE: [" ", "k"],
  MUTE: ["m"],
  FULLSCREEN: ["f"],
  SUBTITLE_TOGGLE: ["c"],

  SEEK_FORWARD: ["ArrowRight"],
  SEEK_BACKWARD: ["ArrowLeft"],

  VOLUME_UP: ["ArrowUp"],
  VOLUME_DOWN: ["ArrowDown"],
} as const

export type KeyboardShortcutKey =
  typeof KEYBOARD_SHORTCUTS[keyof typeof KEYBOARD_SHORTCUTS][number]

export const SEEK_STEP_SECONDS = 5
export const VOLUME_STEP = 0.05