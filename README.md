# dev-app

Dev App created to access and toggle dev tools faster

# Features

- Toggle Cloudflared Tunnel
- Toggle Uniserver Database (Apache & MySQL)

# Requirements

- [Node.js](https://nodejs.org/) (version 22 or later)
- [Rust](https://www.rust-lang.org/) (version 1.70 or later)

# Installation

Simply run the installer which can be found in the [**Releases**](https://github.com/Darco2903/dev-app/releases) section.

# Build

To build the application, run the following command:

```bash
npm install
```

or

```bash
pnpm install
```

Then, to build the application, run:

```bash
cargo tauri build
```

# Run

To run the application in development mode, use:

```bash
cargo tauri dev
```
