# Dev App

Dev App is a desktop application built with [**Tauri**](https://v2.tauri.app/) that allows managing development tools in a single place. It provides a simple interface to toggle [**Cloudflared Tunnel**](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/) and [**Uniform Server**](https://www.uniformserver.com/).

> **Note**: This application is designed specifically for Windows due to its integration with Uniform Server.

# Features

- Toggle Cloudflared Tunnel client
- Toggle Uniserver Database (Apache & MySQL)
- Fetch DNS to find dev websites origins, then copy them to the clipboard or open them in a browser (Edge or Opera, normal or private mode)
- Settings page to change the application theme (Light or Dark) and language (English or French) on the fly
- Config page to setup Cloudflare API token and Uniform Server paths

# Requirements

- [**Node.js**](https://nodejs.org/) (version 22 or later)
- [**Rust**](https://www.rust-lang.org/) (version 1.70 or later)

# Installation

Simply run the installer available in the [**Releases**](https://github.com/Darco2903/dev-app/releases) section.

# Build

Install the dependencies:

```bash
npm install
// or
pnpm install
```

Then, to build the application:

```bash
cargo tauri build
```

# Run in Development Mode

To run the application in development mode, use:

```bash
cargo tauri dev
```
