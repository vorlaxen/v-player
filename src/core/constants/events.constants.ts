export const PLAYER_EVENTS = {
    /* player lifecycle */
    READY: "player:ready",
    DESTROY: "player:destroy",
    ERROR: "player:error",

    /* media control */
    PLAY: "media:play",
    PAUSE: "media:pause",
    PLAYING: "media:playing",
    BUFFERING: "media:buffering",
    BUFFER_UPDATE: "media:buffer:update",
    SEEK: "media:seek",
    SEEKING: "media:seeking",
    SEEKED: "media:seeked",
    TIME: "media:time",
    ENDED: "media:ended",
    CAN_PLAY: "media:canplay",

    /* ui */
    SHOW_CONTROLLER: "ui:controller:show",
    HIDE_CONTROLLER: "ui:controller:hide",
    SIDE_MENU_TOGGLE: "ui:sidemenu:toggle",
    SIDE_MENU_OPEN: "ui:sidemenu:open",
    SIDE_MENU_CLOSE: "ui:sidemenu:close",
    SHOW_SETTINGS: "ui:settings:show",
    HIDE_SETTINGS: "ui:settings:hide",
    FULLSCREEN_CHANGE: "ui:fullscreen:change",

    /* audio */
    VOLUME_CHANGE: "volume:change",
    MUTE_TOGGLE: "mute:toggle",

    /* subtitles */
    SUBTITLE_TOGGLE: "subtitle:toggle"
} as const

export type PlayerEvent =
    typeof PLAYER_EVENTS[keyof typeof PLAYER_EVENTS]
