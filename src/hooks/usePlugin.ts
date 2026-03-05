import { useEffect } from "react"
import { EngineContextType } from "@/types/engine.type"
import { PlayerPluginType } from "@/types/plugin.type"

export function usePlugins(engine: EngineContextType | null, plugins: PlayerPluginType[] = []) {
  useEffect(() => {
    if (!engine) return

    plugins.forEach(plugin => plugin.init(engine as any))

    return () => {
      plugins.forEach(plugin => plugin.destroy?.())
    }
  }, [engine, plugins])
}
