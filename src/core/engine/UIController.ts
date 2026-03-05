import { PLAYER_EVENTS } from "../constants";
import { PlayerEngine } from "./index";

export class UIController {
    constructor(private engine: PlayerEngine) {
        this.setupGlobalListeners();
    }

    private setupGlobalListeners() {
        document.addEventListener("fullscreenchange", () => {
            this.engine.emit(PLAYER_EVENTS.FULLSCREEN_CHANGE, !!document.fullscreenElement);
        });
    }

    async togglePlay() {
        return this.engine.paused ? this.engine.play() : this.engine.pause();
    }

    async seekRelative(seconds: number) {
        const target = this.engine.currentTime + seconds;
        return this.engine.seek(target);
    }

    toggleMute() {
        const newState = !this.engine.muted;
        this.engine.setMuted(newState);
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.engine.container.requestFullscreen?.().catch(err => {
                console.error("FS Error", err);
            });
        } else {
            document.exitFullscreen?.();
        }
    }

    public toggleSettings() {
        this.engine.emit(PLAYER_EVENTS.SIDE_MENU_TOGGLE, 'settings');
    }

    public openSideMenu(type: string) {
        this.engine.emit(PLAYER_EVENTS.SIDE_MENU_OPEN, type);
    }

    public closeSideMenu() {
        this.engine.emit(PLAYER_EVENTS.SIDE_MENU_CLOSE, undefined);
    }
}