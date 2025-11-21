# V-Player

V-Player is a modular and extensible web-based media player framework designed for advanced media playback requirements. Built on React, Vite, and the Web Audio API, it supports iframe-based media streaming, providing high performance, low latency, and precise playback control.

V-Player is tailored for modern developers building sophisticated web applications, video platforms, interactive media applications, e-learning platforms, and media-centric SaaS solutions.

---

## Features

### Core Features

* **Iframe Media Core**: Media content is loaded via iframes, ensuring security and isolation.
* **Custom Handler Architecture**: Modular handler-based structure for playback, timeline, audio, shortcuts, mini-plugins, and additional control layers.
* **Web Audio Processing**: Advanced audio processing modules including volume, gain, compressor, normalizer, and equalizer (EQ).
* **Redux State Integration**: Centralized management of player configuration, themes, user preferences, and global metadata.
* **Tailwind UI Layer**: Scalable, theme-driven, and fully customizable user interface built on TailwindCSS.

### Advanced Features

* **HLS/DASH Support**: Powered by hls.js and dash.js for adaptive streaming.
* **Plugin API**: Fully documented and open plugin interface for third-party feature extensions.
* **Event Bus**: Low-latency communication between handlers and UI components.
* **Custom Shortcuts (Hotkeys)**: Fully configurable keyboard shortcuts.
* **Overlay Components**: Subtitle rendering, thumbnail preview, quality selector, and playback speed controls.
* **Theme Engine**: Dark/light mode support with optional custom theme definitions.

## Installation

### Requirements

* Node.js 18+
* Vite 5+
* React 18+
* TailwindCSS

### Setup

```bash
git clone https://github.com/v-player/v-player.git
cd v-player
yarn install
yarn dev
```

---

## Usage

### Plugin API

V-Player provides a plugin infrastructure that allows third-party developers to extend built-in functionality.

```ts
VPlayer.use(MyThumbnailPlugin);
```

---

## Contributing

Pull requests and issues are welcome. Code style is enforced with ESLint and Prettier.

---

## License

MIT License

---

V-Player transforms iframe-based media infrastructure into a developer-friendly, extensible, and fully controllable playback solution, adhering to modern web standards and performance best practices.
