# An example of React Router v7 + Cloudflare Workers: Breakout Game

This project was created to demonstrate how React Router v7 and Cloudflare Workers enable you to build and deploy full-stack applications easily and at low cost. As a deployed application example, we chose a "Breakout" game. Since I am organizers of the [Functional Programming Matsuri (FP Matsuri)](https://2025.fp-matsuri.org/), the ball in the game uses the FP Matsuri logo as a fun touch.

## Features

- 🚀 Server-side rendering with React Router
- ⚡️ Hot Module Replacement (HMR) for fast development
- 📦 Asset bundling and optimization via Vite
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎨 TailwindCSS for styling
- ☁️ Cloudflare Workers ready (with Wrangler)
- 🕹️ Includes a playable Breakout game

## Game Overview

This project includes a classic "Breakout" game implemented in React.  
You control a paddle to bounce a ball and break all the bricks.  
- Move the paddle with your mouse or arrow keys.
- The game ends when you lose all your lives or clear all bricks.
- The ball's bounce angle changes depending on where it hits the paddle.
- The game uses a custom React reducer for state management and canvas for rendering.

## Project Structure

```
/app
  /game-breakout   # Breakout game implementation (React + Canvas)
  /routes          # Application routes (home loads the game)
/public            # Static assets
/worker-configuration.d.ts # Cloudflare Worker types
/vite.config.ts    # Vite configuration
/wrangler.jsonc    # Cloudflare Wrangler config
```

## Tech Stack

- **React 19**
- **React Router 7**
- **TypeScript**
- **Vite**
- **TailwindCSS**
- **Cloudflare Workers** (via Wrangler)
- **pnpm** for package management

## Getting Started

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm run dev
```
App will be available at `http://localhost:5173`.

### Build

```bash
pnpm run build
```

### Preview Production Build

```bash
pnpm run preview
```

### Deploy to Cloudflare Workers

```bash
pnpm run deploy
```

## License

MIT

---

## Credits & Acknowledgements

This Breakout game implementation is heavily inspired by and based on the excellent tutorial from MDN Web Docs:

[2D Breakout game using pure JavaScript (MDN)](https://developer.mozilla.org/ja/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript)

Special thanks and full respect to the MDN contributors for their clear, educational, and open resources on web game development.

We would also like to express our gratitude to Cloudflare for providing an outstanding developer experience and a powerful platform that makes global deployment simple and affordable.
