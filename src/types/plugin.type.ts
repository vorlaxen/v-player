import { EngineContextType } from "@/types/engine.type"

export type PluginSlotPosition =
    | 'topLeft' | 'topRight'
    | 'bottomLeft' | 'bottomRight'
    | 'center';

export interface PluginUIConfigType {
    settings?: {
        id: string;
        label: string;
        icon: any;
        status?: () => string;
        panel: React.ComponentType<{ onBack: () => void }>;
    };
    slots?: {
        [key in PluginSlotPosition]?: React.ComponentType<{ ctx: EngineContextType }>[];
    };
}

export interface PlayerPluginType {
    readonly name: string
    readonly version: string

    init(ctx: EngineContextType): void | Promise<void>
    ui?: PluginUIConfigType;

    onEnable?(): void
    onDisable?(): void

    destroy?(): void
}