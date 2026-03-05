# 🎬 Vorlaxen's Web Player

Enterprise-grade, modular, event-driven video player engine built with **TypeScript + React + Vite**.

Designed to compete with production-level platforms such as Netflix, YouTube, Disney+, and Udemy — with a clean architecture, plugin extensibility, and long-term scalability in mind.

---

## 🚀 Vision

V-Player is built with a simple philosophy:

> Keep the core minimal. Everything else is a plugin.

The system is engineered to deliver:

* High performance playback
* Seamless quality & audio switching
* Strong type-safety with full TypeScript coverage
* Event-driven extensibility
* Future-ready architecture (WebCodecs, AV1, adaptive pipelines)

---

## 🧠 Architecture Overview

The project follows a **Core + Plugin Architecture**.

```
Player Core
 ├── EventBus (Strict Typed)
 ├── Engine Layer (Media + Audio)
 ├── Plugin Manager
 └── Public API

Plugins
 ├── Format Plugins (MP4, HLS, DASH)
 ├── Audio Processing
 ├── Metadata Providers
 ├── Ads / Analytics
 └── Debug / DevTools
```

### Core Principles

* Core never depends on plugins.
* Plugins extend behavior via lifecycle hooks.
* All communication is event-driven.
* Every event is strictly typed.

---

## ⚙️ Technology Stack

* **React (SPA Architecture)**
* **TypeScript (Strict Mode)**
* **Vite (Bundler)**
* **Web Audio API**
* **Modular Plugin System**

---

## 🧩 Plugin System

All plugins must extend the abstract `BasePlugin` class.

### Lifecycle

* `init(core)`
* `destroy()`
* `onEvent()` (optional)

Plugins are:

* Initialized by the core
* Event-driven
* Isolated from each other
* Fully typed

### Example Plugin Categories

| Plugin             | Purpose                                      |
| ------------------ | -------------------------------------------- |
| MP4Plugin          | Native MP4 playback                          |
| HLSPlugin          | Adaptive streaming via HLS                   |
| MetadataPlugin     | Platform-specific metadata integration       |
| AudioPlugin        | Advanced audio pipeline & processing layer   |
| SleepTimerPlugin   | Playback auto-stop scheduling system         |
| ADSPlugin          | Advertisement system                         |
| IframeBridgePlugin | Cross-window / embedded player communication |

---

## 🔊 AudioPlugin

`AudioPlugin` replaces the old AudioBoost-specific design and provides a more extensible audio processing layer.

Capabilities:

* Volume normalization
* Dynamic gain control
* Custom audio graph injection
* Toggleable enhancement pipeline
* Future support for spatial audio or advanced DSP modules

Built on top of the Web Audio API with a controlled and isolated audio graph.

The design allows stacking multiple audio processors internally without leaking implementation details to the core.

---

## ⏳ SleepTimerPlugin

The `SleepTimerPlugin` enables timed playback shutdown.

Features:

* Set timer (e.g., 10 / 30 / 60 minutes)
* Emits scheduled stop events
* Graceful pause instead of hard stop
* Fully event-driven

Ideal for long-form content platforms (courses, podcasts, series playback).

The timer logic is isolated and does not directly control media — it only emits typed events.

---

## 🪟 IframeBridgePlugin

The `IframeBridgePlugin` enables secure communication between:

* Embedded players
* Parent windows
* Cross-origin iframe integrations

Built on top of `postMessage` with strict message typing.

Capabilities:

* Parent → Player control (play, pause, seek)
* Player → Parent analytics events
* Strict origin validation
* Typed message contracts

This makes the engine embeddable in LMS systems, SaaS dashboards, or third-party platforms without modifying the core.

---

## 🔁 Event-Driven System

All interactions flow through a strictly typed `EventBus`.

### Example Events

* `play`
* `pause`
* `seek`
* `qualityChange`
* `audioChange`
* `metadataLoaded`
* `sleepTimerTriggered`
* `iframeMessageReceived`

Each event:

* Must exist in `PlayerEventMapType`
* Cannot be emitted if not typed
* Is fully compile-time validated

This prevents runtime inconsistencies and ensures predictable plugin behavior.

---

## 🎥 Multi-Format Support

Supported formats via plugins:

* MP4
* HLS
* DASH (planned via plugin abstraction)

The core interacts only through the plugin interface — never directly with format libraries.

---

## 🔄 Seamless Switching

### Quality Switching

* No playback interruption
* Buffered data preserved
* Adaptive switching supported

### Audio Track / Dubbing Switching

* No playback pause
* Event-driven change
* Independent from quality pipeline

Both systems are designed to be reusable across plugins.

---

## 🛡 Stability & Performance

* Minimal core footprint
* Strict listener cleanup
* Memory leak prevention strategy
* Defensive event handling
* Controlled plugin lifecycle

Designed for long-running sessions.

---

## 🧪 Development Mode

UI is intentionally minimal.

The project includes:

* Basic DOM test controls
* Simple test buttons
* Debug-ready structure

The architecture is fully UI-ready but UI implementation is intentionally separated from core logic.

---

## 📁 Project Structure

```
src/
 ├── core/
 │   ├── engine/
 │   ├── events/
 │   └── constants/
 │
 ├── plugins/
 │   ├── MP4Plugin/
 │   ├── HLSPlugin/
 │   ├── MetadataPlugin/
 │   ├── AudioPlugin/
 │   ├── SleepTimerPlugin/
 │   └── IframeBridgePlugin/
 │
 ├── components/
 ├── hooks/
 ├── types/
 └── utils/
```

Clear separation between:

* Engine logic
* Plugin layer
* UI layer
* Context layer

---

## 🧱 Type System

Strict TypeScript usage across the project:

* `PlayerEventMapType`
* `PluginEventMap`
* `EngineTypes`
* Plugin lifecycle types

No untyped event emission allowed.

---

## 🔮 Future Roadmap

* WebCodecs integration
* AV1 support
* MediaCapabilities API integration
* Analytics plugin
* DRM abstraction layer
* Adaptive bitrate intelligence plugin

The architecture is intentionally future-proof.

---

## 🛠 Installation

```bash
pnpm install
pnpm dev
```

---

## 📄 License

This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**.

🛡️ **Commercial Use is Strictly Prohibited.** If you intend to use this engine for a commercial product, please contact the author for a separate commercial license.

[View License Summary](https://creativecommons.org/licenses/by-nc-sa/4.0/)

---

## ✨ Final Note

V-Player is not a UI experiment.
It is an engine-first, architecture-driven system designed for production-scale streaming platforms.

The UI is replaceable.
The core is permanent.