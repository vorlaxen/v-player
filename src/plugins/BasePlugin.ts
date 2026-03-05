import { EngineContextType } from "@/types/engine.type"
import React from "react"

export abstract class BasePlugin {
  protected ctx!: EngineContextType

  abstract name: string
  abstract version: string

  init(ctx: EngineContextType) {
    this.ctx = ctx
    this.onInit()
  }

  protected abstract onInit(): void

  render?(): React.ReactNode;

  destroy?(): void
}