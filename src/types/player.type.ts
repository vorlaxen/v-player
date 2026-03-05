import { PLAYER_EVENTS } from "@/core/constants"

export type MediaSourceType = "mp4" | "hls" | "webm"

export interface MediaSource {
    url: string;
    type?: MediaSourceType;
    resolution: number;
}

export type MediaSourceMapType = Record<string, MediaSource>

export interface SubtitleTrackType {
    lang: string
    label?: string
    src: string
    default?: boolean
}

export interface PlayerEventMapType {
    /* player lifecycle */
    [PLAYER_EVENTS.READY]: void
    [PLAYER_EVENTS.DESTROY]: void
    [PLAYER_EVENTS.ERROR]: MediaError | null

    /* media control */
    [PLAYER_EVENTS.PLAY]: void
    [PLAYER_EVENTS.PAUSE]: void
    [PLAYER_EVENTS.PLAYING]: void
    [PLAYER_EVENTS.BUFFERING]: void
    [PLAYER_EVENTS.BUFFER_UPDATE]: number
    [PLAYER_EVENTS.ENDED]: void
    [PLAYER_EVENTS.CAN_PLAY]: void

    /* seek */
    [PLAYER_EVENTS.SEEK]: number
    [PLAYER_EVENTS.SEEKING]: void
    [PLAYER_EVENTS.SEEKED]: void
    [PLAYER_EVENTS.TIME]: number

    /* ui */
    [PLAYER_EVENTS.SHOW_CONTROLLER]: void
    [PLAYER_EVENTS.HIDE_CONTROLLER]: void
    [PLAYER_EVENTS.SHOW_SETTINGS]: void
    [PLAYER_EVENTS.HIDE_SETTINGS]: void
    [PLAYER_EVENTS.FULLSCREEN_CHANGE]: boolean

    /* audio */
    [PLAYER_EVENTS.VOLUME_CHANGE]: number
    [PLAYER_EVENTS.MUTE_TOGGLE]: boolean

    /* subtitles */
    [PLAYER_EVENTS.SUBTITLE_TOGGLE]: boolean
}

export interface VideoMetadata {
    id?: string
    title: string
    description?: string
    poster?: string
    duration?: number

    sources: MediaSourceMapType
    subtitles?: SubtitleTrackType[]
}
