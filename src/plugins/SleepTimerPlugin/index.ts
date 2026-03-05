import { logger } from "@/utils";
import { BasePlugin } from "../BasePlugin";
import { PluginUIConfigType } from "@/types/plugin.type";
import { Timer } from "lucide-react";
import SleepTimerSubMenu from "@/plugins/SleepTimerPlugin/components/settings/sleep-timer.settings";

export class SleepTimerPlugin extends BasePlugin {
    name = "sleep-timer-plugin";
    version = "1.0.0";

    ui: PluginUIConfigType = {
        settings: {
            id: "sleep-timer",
            label: "Uyku Zamanlayıcısı",
            icon: Timer,
            status: () => {
                const mins = this.getRemainingMinutes();
                return mins > 0 ? `${mins} dk` : "Kapalı";
            },
            panel: SleepTimerSubMenu as any
        }
    };

    private timerId: ReturnType<typeof setTimeout> | null = null;
    private endTime: number | null = null;

    protected onInit(): void {
        logger.info(this.name, "Plugin Activated!");
    }

    public setTimer(minutes: number) {
        this.clearTimer();
        if (minutes <= 0) return;

        this.endTime = Date.now() + minutes * 60 * 1000;

        this.timerId = setTimeout(() => {
            this.ctx.pause();
            this.endTime = null;
            this.ctx.emit('SLEEP_TIMER_UPDATE' as any, 0);
            logger.info(this.name, "Sleep time filled, media paused!")
        }, minutes * 60 * 1000);

        logger.info(this.name, `Sleep time setted: ${minutes.toString()}`)

        this.ctx.emit('SLEEP_TIMER_UPDATE' as any, minutes);
    }

    public clearTimer() {
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
            this.endTime = null;
            this.ctx.emit('SLEEP_TIMER_UPDATE' as any, 0);
            logger.info(this.name, `Sleep time cleared!`)
        }
    }

    public getRemainingMinutes(): number {
        if (!this.endTime) return 0;
        const diff = this.endTime - Date.now();
        return Math.max(0, Math.ceil(diff / 1000 / 60));
    }
}