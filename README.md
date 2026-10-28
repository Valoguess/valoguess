# ValoGuess

ValoGuess is a multiplayer deduction game based on VALORANT. The main
mode is a 1v1 version of *Guess Who?*: each player has a secret agent,
asks questions, and eliminates agents until they can make a guess.

I'm also adding an **Imposter** mode. In this mode, all players receive
the same secret agent except the Imposter, who has to work 
out what everyone else knows without giving themselves away.

## Screenshots

### Lobby and parties

Create or join a party, set up a match, and chat before the game starts.

![Party lobby](public/showcase/lobby-in-party.webp)

### Friends

See who's online and invite friends to play.

![Friends and lobby](public/showcase/lobby.webp)

### Guess the Agent

Players ask questions, mark agents off the board, and try to identify
their opponent's secret agent.

![Guess the Agent match](public/showcase/game.webp)

### Match history

Check previous matches and review your stats.

![Match history](public/showcase/match-history.webp)

### Profile settings

Customize your player card, tagline, display name, and username.

![Profile settings](public/showcase/settings.webp)

## What you can do

-   Sign in with Google, use an email magic link, or play as a guest.
-   Create and join parties using a short code.
-   Invite online friends and chat in the lobby.
-   Play Guess the Agent with preset or custom questions.
-   Configure turn timers, question limits, and guess allowances.
-   Track match results, review match events, and browse match history.
-   Customize your profile and player card.
-   Play the upcoming Imposter mode once it is ready.

## Tech stack

-   **Web app and server-side code:** Next.js 16, React 19,
    TypeScript 7
-   **Styling:** Tailwind CSS, Shadcn UI, Radix UI, Framer Motion
-   **Authentication:** Better Auth
-   **Database:** PostgreSQL with Drizzle ORM
-   **Client state:** Zustand
-   **Real-time communication:** Socket.IO
-   **Temporary state and presence:** Redis
-   **Email:** Resend
-   **Avatar uploads:** Cloudinary

## How it works

The Next.js app handles the pages, authentication, profile settings, and
database operations. PostgreSQL stores persistent data such as user
profiles and match history, with Drizzle ORM used to query and update
it.

Live gameplay runs through a separate [ValoGuess Socket Server](https://github.com/Valoguess/valoguess-socket-server). The web
client connects to it over Socket.IO. The socket server manages parties,
match state, turns, timers, and player presence, using Redis for
temporary state.

``` text
Browser
   |
   v
Next.js
   |---- Better Auth
   |---- Drizzle ORM ------ PostgreSQL
   |
   | Socket.IO
   v
ValoGuess Socket Server
   |
   v
 Redis
```

## Run locally

You'll need Node.js 22 or later, pnpm, PostgreSQL, Redis, and a running
[ValoGuess Socket Server](https://github.com/Valoguess/valoguess-socket-server).

Clone the repository and install dependencies:

``` bash
git clone https://github.com/Valoguess/valoguess.git
cd valoguess
pnpm install
```
Copy the example environment file to `.env` and fill in your own values:

``` bash
cp .env.example .env
```

Apply the Drizzle schema to your local database and start Next.js:

``` bash
pnpm exec drizzle-kit push
pnpm run dev
```

Open <http://localhost:3000>. PostgreSQL, Redis, and the socket server
should be running as well.

## Related repository

- [ValoGuess Socket Server](https://github.com/Valoguess/valoguess-socket-server) ---
  handles live connections, parties, game state, timers, and presence.

## License

[MIT](LICENSE)
