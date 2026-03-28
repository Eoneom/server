# Eoneom game server

Proof-of-concept web strategy game. This repository is a **Yarn 4** monorepo: the HTTP API lives in `apps/server`, the React client in `apps/web` (`swarm-web`), and the shared TypeScript client in `packages/api-client`.

## Prerequisites

- **Node.js** (LTS recommended; the stack targets modern Node for native ESM tooling in scripts)
- **Yarn 4** — the repo pins Yarn via Corepack (see root `package.json` `packageManager` field)
- **Docker** — for local MongoDB (optional if you already run MongoDB on `localhost:27017`)

Enable Corepack once so the correct Yarn version is used:

```bash
corepack enable
```

## Install dependencies

From the **repository root**:

```bash
yarn install
```

## Run MongoDB locally

The server connects to MongoDB at `mongodb://localhost:27017/` with database name `eoneom` (see `apps/server/src/adapter/repository/mongo.ts`).

From the repository root:

```bash
docker compose -f containers/docker-compose.yml up -d
```

Data is stored under `containers/data`. To stop:

```bash
docker compose -f containers/docker-compose.yml down
```

(Legacy Docker Compose v1 users can run the same file with `docker-compose` instead of `docker compose`.)

## Launch the API server (from root scripts)

Root `package.json` exposes convenience scripts that delegate to the `server` workspace.

1. Build (TypeScript compile and dist layout):

   ```bash
   yarn server:build
   ```

2. Start (runs compiled output with pretty logs):

   ```bash
   yarn server:start
   ```

The API listens on **port 3000**. Endpoints are wired in `apps/server/src/web/router.ts`.

### Tests

```bash
yarn server:test
```

### Workspace equivalents

The same commands can be run explicitly against the workspace:

```bash
yarn workspace server build
yarn workspace server start
yarn workspace server test
```

Additional scripts (lint, watch build, coverage) are defined only on `apps/server/package.json` — use `yarn workspace server <script>` for those.

## Other root scripts

| Script            | Purpose                                      |
| ----------------- | -------------------------------------------- |
| `yarn client:build` | Build `@eoneom/api-client` (shared package) |
| `yarn web:start`  | Start the React app (`swarm-web`, port **3001**) |
| `yarn web:build`  | Production build of the web app            |

Typical full-stack local setup: MongoDB running, `yarn server:start` in one terminal, `yarn web:start` in another (API on 3000, UI on 3001).

## Interact with the server

With the server running, send HTTP commands and queries to port **3000**. See `apps/server/src/web/router.ts` for available routes.

## Architecture

### Adapter

Implements the application’s outbound ports: database, logging, locking.

#### Database

MongoDB adapter for repository ports. Models follow a common shape:

- `document`: Typegoose document classes and exported models
- `repository`: extends the generic repository and adds domain-specific methods

### App

Features split into commands and queries.

#### Command

Commands brings modification to the API.

#### Port

Interfaces for repositories, logger, and lock implementations.

#### Query

Reads via application services or repositories.

#### Saga

Coordinates multiple commands when a use case spans several commands.

#### Service

Higher-level use cases for player-facing behavior.

### Core

Domain logic and mostly pure functions. Each module is organized as:

- `constant`, `value`, `entity`, `error`, `service`, `type` as needed for that bounded context

### Cron

Scheduled tasks that invoke app commands and queries.

### Shared

Small helpers and types that avoid heavy port indirection.

### Web

`http` boots Express, middleware, and the router. **Handlers** map routes to command/query behavior.
