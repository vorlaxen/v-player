import { PlayerEventMapType } from "@/types/player.type";
import { EventBus } from "./EventBus";
import { PLAYER_EVENTS } from "../constants";

export class IframeBridge {
  private readonly SOURCE_TAG = 'V_PLAYER_ENGINE';
  private readonly ALLOWED_PARENT_SOURCE = 'V_PLAYER_HOST';

  constructor(private eventBus: EventBus<PlayerEventMapType>, private engine: any) {
    this.setupInbound();
    this.setupOutbound();
  }

  private setupInbound() {
    window.addEventListener('message', (event) => {
      if (event.data?.source !== this.ALLOWED_PARENT_SOURCE) return;

      const { type, payload } = event.data;

      switch (type) {
        case 'COMMAND:PLAY': this.engine.play(); break;
        case 'COMMAND:PAUSE': this.engine.pause(); break;
        case 'COMMAND:SEEK': this.engine.seek(payload); break;
        case 'COMMAND:SET_VOLUME': this.engine.setVolume(payload); break;
      }
    });
  }

  private setupOutbound() {
    const forwardable = [
      PLAYER_EVENTS.PLAY,
      PLAYER_EVENTS.PAUSE,
      PLAYER_EVENTS.TIME,
      PLAYER_EVENTS.READY,
      PLAYER_EVENTS.VOLUME_CHANGE
    ];

    forwardable.forEach(evt => {
      this.eventBus.on(evt, (payload) => {
        window.parent.postMessage({
          source: this.SOURCE_TAG,
          event: evt,
          payload
        }, '*');
      });
    });
  }
}