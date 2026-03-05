type EventHandler<T> = (payload: T) => void

export class EventBus<Events extends Record<string, any>> {
    private listeners = new Map<keyof Events, Set<EventHandler<any>>>()

    private forwardableEvents: (keyof Events)[] = [];

    constructor(forwardableEvents: (keyof Events)[] = []) {
        this.forwardableEvents = forwardableEvents;
    }

    on<K extends keyof Events>(
        event: K,
        handler: EventHandler<Events[K]>
    ) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set())
        }

        this.listeners.get(event)!.add(handler)

        return () => {
            this.listeners.get(event)!.delete(handler)
        }
    }

    off<K extends keyof Events>(
        event: K,
        handler: EventHandler<Events[K]>
    ) {
        this.listeners.get(event)?.delete(handler)
    }

    emit<K extends keyof Events>(event: K, payload: Events[K]) {
        this.listeners.get(event)?.forEach(fn => {
            try {
                fn(payload);
            } catch (e) {
                console.error(`Handler error for ${String(event)}:`, e);
            }
        });

        if (this.forwardableEvents.includes(event)) {
            window.parent.postMessage({
                source: 'v-player-engine',
                event: String(event),
                payload
            }, '*');
        }
    }

    clear() {
        this.listeners.clear()
    }
}
