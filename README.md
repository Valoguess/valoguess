# ValoGuess Web

ValoGuess is a real-time 1v1 tactical deduction web game inspired by the classic "Guess Who?", adapted for the Valorant universe. Two players face off on an interactive board of 29 Valorant agents (excluding Hush, the new agent), ask targeted questions to eliminate possibilities, and race to deduce the opponent's secret agent.

This repository hosts the frontend web client and primary application service, built with Next.js 16, React 19, and Tailwind CSS. It manages the player-facing interface, user authentication, profile customization, career match history, and communicates over WebSockets with the [ValoGuess Socket Server](https://github.com/Valoguess/valoguess-socket-server).


## Table of Contents

- [Showcase](#showcase)
- [Implemented Features](#implemented-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Related Repositories](#related-repositories)
- [License](#license)

## Showcase

### In-Game Match Interface
Players eliminate agents on their board, review the combat activity log, track turn timers, and submit guesses.

![In-Game Tactical Board](public/showcase/game.webp)

### Tactical Lobby & Matchmaking
Players configure match settings, select game modes, share party codes, and chat in real time.

![Lobby In Party](public/showcase/lobby-in-party.webp)

### Friends & Party Controls
Real-time friends sidebar docked on the home shell showing player status and direct invite triggers.

![Lobby Main View](public/showcase/lobby.webp)

### Career Match History
Paginated match logs fetched directly from PostgreSQL, calculating win rates and question stats.

![Match History](public/showcase/match-history.webp)

### Profile & Identity Settings
Customizable player cards with unlocked agent banners, taglines, and cooldown-protected name updates.

![Player Settings](public/showcase/settings.webp)

### Leaderboards
Coming Soon.

![Leaderboards](public/showcase/lb.webp)

---

## Implemented Features

- **Authentication System**:
  - Google OAuth sign-in.
  - Passwordless email authentication via magic links (sent through Resend).
  - Anonymous guest login for instant play without registration.
  - Session tokens issued as signed JWTs, validated by the socket server against a public JWKS endpoint.

- **Unified Home Shell**:
  - Persistent top navigation bar across `/lobby`, `/settings`, `/history`, and `/leaderboard`.
  - Docked collapsible friends sidebar accessible across all home routes.
  - Global How-to-Play guide and logout confirmation modals.

- **Party & Matchmaking**:
  - Create and join 1v1 parties using short party codes (e.g., `#a1b2c`).
  - Real-time party chat with custom timestamped messages.
  - Host controls to change match parameters, kick guests, or start the game.
  - Direct party invitations sent to online friends via sockets.

- **Match Modes & Custom Rules**:
  - **Preset Mode**: Server delivers a pool of difficulty-weighted questions (low, medium, high). Players take turns asking questions from the pool and answering YES or NO.
  - **Freeform Mode**: Players ask custom freeform questions; answering NO consumes from an allotted NO quota.
  - Configurable timers (15s to 90s or infinite per turn), custom question counts, and maximum guess allowances.

- **Tactical Match Board**:
  - Interactive grid displaying all 29 Valorant agents (excluding Hush the new agent) with roles and portraits.
  - Manual elimination mechanic (clicking agent cards strikes them out).
  - Secret agent display showing the card assigned to you that your opponent is trying to guess.
  - Live opponent question prompts requiring immediate YES / NO confirmation.
  - Final accusation modal to submit your definitive agent guess.
  - Match intro and victory/defeat cinematic overlays.

- **Post-Match Breakdown (`/play/result`)**:
  - Summary cards comparing secret agents, outcome (Victory, Defeat, Tie), and rounds played.
  - Complete match action timeline tracking every question, answer, and elimination.
  - Performance metrics: total questions asked, questions answered, and accuracy.

- **Social & Presence**:
  - Friend search by username or email.
  - Send, accept, decline, and cancel friend requests with live socket sync.
  - Real-time presence indicators (Online, In Lobby, Offline) backed by Redis sets.

- **Profile Customization (`/settings`)**:
  - Selectable player card banners categorized by agent role (Duelist, Initiator, Controller, Sentinel).
  - Custom player taglines.
  - Display name and username updates with a 30-day change cooldown enforced at the database level.

- **Career Records (`/history`)**:
  - Match history pagination using Next.js Server Actions and IntersectionObserver infinite scrolling.
  - Overall win-rate calculation and match-specific stat cards.

---

## Tech Stack

- **Framework**: Next.js 16.4.0 (App Router, Turbopack, React 19)
- **Styling**: Tailwind CSS v4, Lucide React icons, Sonner notifications
- **Client State**: Zustand (auth, party, active game, presence, friend list, incoming invites)
- **Real-Time Client**: Socket.IO Client 4.8
- **Authentication**: Better-Auth 1.7 (Drizzle adapter, Redis session caching, JWT plugin with JWKS)
- **Database & ORM**: PostgreSQL with Drizzle ORM
- **Transactional Email**: Resend
- **Media Storage**: Cloudinary (avatar uploads)
- **Package Manager**: pnpm

---

## Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Next.js 16 Client                    │
│                                                        │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────┐  │
│  │ (home) Layout  │ │ /play Board    │ │ /settings  │  │
│  │ TopNav+Sidebar │ │ Grid+Questions │ │ Profiles   │  │
│  └───────┬────────┘ └───────┬────────┘ └─────┬──────┘  │
│          │                  │                │         │
│          ▼                  ▼                ▼         │
│    Zustand Stores (auth, party, game, friends, presence)│
│                            │                           │
│                            ▼                           │
│                     SocketProvider                     │
└────────────────────────────┼───────────────────────────┘
                             │ WebSockets (Socket.IO + JWT)
                             ▼
┌────────────────────────────────────────────────────────┐
│             ValoGuess Socket Server (Node.js)          │
│                                                        │
│  - Token verification against Next.js JWKS             │
│  - Redis token-bucket rate limiting                    │
│  - Turn timers, question pools, and game state         │
│  - Real-time presence and party synchronization       │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
               ▼                          ▼
      ┌────────────────┐         ┌─────────────────┐
      │  NextJS Cache  │         │ PostgreSQL (DB) │
      │  Session/State │         │ Drizzle Schema  │
      └────────────────┘         └─────────────────┘
```

1. **Authentication Flow**: When a player signs in through Better-Auth, a session is created and cached in Redis. Better-Auth's JWT plugin signs a token exposing the player's ID and username, while publishing public keys at `/api/auth/jwks`.
2. **Socket Handshake**: The client [`SocketProvider`](src/components/SocketProvider.tsx) grabs the JWT and supplies it in `socket.handshake.auth.token`. The socket server verifies this token against the Next.js JWKS endpoint before accepting the connection.
3. **State Management**: Socket events update shared Zustand stores (`usePartyStore`, `useGameStore`, `usePresenceStore`, `useFriendStore`). UI components subscribe to store changes rather than opening direct socket listeners.
4. **Data Fetching**: Persistent operations (match history, friendship queries, profile adjustments) execute via Next.js Server Actions directly against PostgreSQL via Drizzle ORM. Real-time ephemeral operations (turn changes, eliminations, game timers) travel through WebSockets and Redis.

---

## Project Structure

```
src/
├── actions/              # Server actions for friends, game records, and user profiles
├── app/
│   ├── (auth)/           # Authentication routes (/login, /signup, /register)
│   ├── (protected)/
│   │   ├── (home)/       # Centralized layout with TopNavbar and FriendsSidebar
│   │   │   ├── history/  # Match history page with infinite scroll
│   │   │   ├── leaderboard/ # Leaderboards page (coming soon)
│   │   │   ├── lobby/    # 1v1 party lobby, podiums, and settings drawers
│   │   │   └── settings/ # Profile customization, banners, and account management
│   │   ├── play/         # Active game screen, agent grid, and question panels
│   │   │   └── result/   # Post-match face-off and timeline breakdown
│   │   └── welcome/      # Onboarding screen for new accounts
│   ├── api/auth/         # Better-Auth route handler and JWKS endpoint
│   ├── layout.tsx        # Root HTML layout with providers and theme wrappers
│   └── globals.css       # Tailwind v4 theme, fonts, and dark mode scrollbars
├── components/           # Reusable UI widgets, navigation, chat, and dialogs
├── consts/               # Agent roster data, banners, roles, and default avatars
├── db/                   # Drizzle ORM schema files, migrations, and database client
├── hooks/                # Client hooks (useFriends, usePlayState, etc.)
├── lib/                  # Auth configuration, Redis client, and Resend client
├── socket/               # Socket.IO client instance, event schemas, and emitters
├── store/                # Zustand stores for client state management
└── types/                # Shared TypeScript models (game, party, friends, user)
```

---

## Getting Started

### Prerequisites

- Node.js 22+
- [pnpm](https://pnpm.io/)
- PostgreSQL database
- Redis instance (standalone or Docker)
- Running instance of [ValoGuess Socket Server](https://github.com/Valoguess/valoguess-socket-server)

### 1. Clone & Install

```bash
git clone https://github.com/Valoguess/valoguess.git
cd valoguess
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Application
NODE_ENV=development
BASE_URL=http://localhost:3000

# Better-Auth
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000

# Database & Cache
DATABASE_URL=postgres://postgres:password@localhost:5432/valoguess
REDIS_URL=redis://localhost:6379

# Socket Server
NEXT_PUBLIC_SOCKET_SERVER_URL=http://localhost:5000

# Social Authentication (Google OAuth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Service (Magic Links)
RESEND_API_KEY=re_your_resend_api_key

# Asset Uploads
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

### 3. Database Migration

Push the schema directly to your PostgreSQL database using Drizzle Kit:

```bash
pnpm exec drizzle-kit push
```

### 4. Run Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Related Repositories

- **Backend / Socket Server**: [Valoguess/valoguess-socket-server](https://github.com/Valoguess/valoguess-socket-server) — Socket.IO server handling match rooms, turn timers, player presence, rate limiting, and Redis state.

---

## License

This project is licensed under the [MIT License](LICENSE).
