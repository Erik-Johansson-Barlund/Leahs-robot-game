# Leahs Robot Rally

A kid-friendly web game where players program robots on a track built with drag-and-drop. I built this game with my daughter after she told me they program robots at school using [unplugged programming principles](https://unpluggedcoding.com/?srsltid=AfmBOor-53tKlRoVprAH58qjtvCLyggFw9OcgG3JX2uP588AG7tbajTc).

## About the game

Leahs Robot Rally has two main modes:

- **Play**: 1-4 players choose a robot, build command sequences, and run them in turn order.
- **Build**: create custom tracks on a 12x12 grid, validate them, and save them to Convex.

The app is built around clear visual feedback, large interaction targets, and playful UI.

## Features

- 12x12 board with tile-based road logic
- Drag-and-drop track building
- Live track validation
- 1-4 start tiles
- Exactly 1 goal tile
- One connected track network
- No dangling/open connector mismatches
- Every start tile must be able to reach the goal
- Turn-based robot programming
- Player-by-player animated playback
- End-of-round results screen
- Localization: Swedish (default) and English
- 4 starter tracks

## Tech stack

- React + Vite
- Tailwind CSS
- Convex (backend)
- Jest (unit tests)
- dnd-kit (drag-and-drop)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally (without Convex)

```bash
npm run dev
```

If `VITE_CONVEX_URL` is not set, the app uses local starter tracks.

### 3. Run with Convex

Start Convex:

```bash
npm run convex:dev
```

Then create a `.env.local` file in the project root:

```env
VITE_CONVEX_URL=https://<your-deployment>.convex.cloud
```

Optional: seed starter tracks:

```bash
npm run convex:seed
```

## Scripts

- `npm run dev` - start development server
- `npm run build` - TypeScript build + Vite production build
- `npm run preview` - preview production build
- `npm test` - run Jest tests
- `npm run test:watch` - run tests in watch mode
- `npm run convex:dev` - start Convex dev backend
- `npm run convex:seed` - seed starter tracks

## Game rules (summary)

- Board: 12x12, 0-based coordinates
- Tile types: `straight`, `corner`, `tee`, `cross`, `start`, `goal`
- Rotation: `0 | 90 | 180 | 270`
- Robots execute sequentially in player order
- Invalid movement stops a robot immediately
- Program length is effectively unlimited

## Testing

This project includes unit tests for:

- tile connectivity
- track validation
- simulation engine
- starter tracks

Run:

```bash
npm test
```

## Project structure

```text
src/
  app/routes/           # Home / Play / Build
  components/
    board/              # Board, Tile, RobotToken
    builder/            # BuilderCanvas, TilePalette, ValidationPanel
    game/               # PlayerSetup, ProgramBuilder, PlaybackView, etc.
  convex/               # Frontend Convex helpers
  engine/               # tileConnectivity, validateTrack, simulate
  i18n/                 # translations + context
  lib/                  # starter tracks, robot catalog
convex/
  schema.ts             # database schema
  tracks.ts             # queries/mutations
  seed.ts               # starter seed script
```

## Environment variable notes

- `.env` and `.env.local` are git-ignored.
- Do not store private secrets in `VITE_*` variables (they are exposed to the client).
