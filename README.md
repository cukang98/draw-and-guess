# Draw and Guess

A real-time multiplayer drawing and guessing game built with Next.js and Socket.io. Players take turns drawing a word while others race to guess it in the chat.

## Features

- **Real-time multiplayer** — up to 8 players per room via WebSockets
- **Live canvas** — drawing strokes are transmitted instantly to all players
- **Bilingual word sets** — English and Chinese game modes
- **Scoring system** — time bonuses and position bonuses (first correct guess earns more)
- **Lobby & room flow** — create or join rooms with a username and avatar
- **Reconnection support** — 15-second grace period if a player drops

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Next.js 14 (App Router) |
| Styling | Tailwind CSS, Framer Motion |
| Backend | Express.js, Socket.io |
| Runtime | Node.js 18+ |

## Getting Started

```bash
# Install dependencies
npm install

# Run in development mode (hot reload)
npm run dev

# Build and run in production
npm run build
npm start
```

The server runs at `http://localhost:3006` by default.

## Game Rules

1. All players join a room and ready up.
2. Each round, one player is assigned to draw a word — others type guesses in the chat.
3. Correct guesses award points based on speed; the drawer earns points for each correct guess.
4. Roles rotate so everyone draws once per round. The game runs for 3 rounds.
5. The player with the most points at the end wins.

## Project Structure

```
draw-and-guess/
├── app/                  # Next.js App Router pages
│   └── (routes)/
│       ├── lobby/        # Player setup (username, avatar)
│       ├── room/         # Waiting room (ready up, start game)
│       └── game/         # Active game (canvas, chat, timer, scoreboard)
├── components/           # React UI components
│   ├── common/           # Shared (Avatar, Button, Input, Modal)
│   ├── lobby/            # Lobby-specific components
│   ├── room/             # Room-specific components
│   └── game/             # Game-specific components (Canvas, Chat, Timer…)
├── server/               # Backend
│   ├── socket/           # Socket.io event handlers
│   └── rooms/            # Room state management
├── hooks/                # Custom React hooks
├── services/             # Business logic
├── lib/                  # Utilities and Socket.io client setup
└── server.js             # Entry point (Express + Next.js + Socket.io)
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3006` | Port the server listens on |
| `HOSTNAME` | `localhost` | Hostname to bind |
| `NODE_ENV` | `development` | Node environment |

## License

MIT
