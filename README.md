# Swarm game server

This project is currently a proof of concept for web strategy game server.

# Setup project

## Launch dependencies

```
cd containers
docker-compose up -d
```

## Build app

```
npm run build
```

## Build app in dev mode

```
npm run build:watch
```

## Start app

```
npm run start
```

# Architecture

## Core

Contains domain logic with mostly pure functions.



## Database

MongoDB implementation for repository methods. Simple adapter to call mongoDB, and define collections.

repository: adapter between domain and mongo DB system, no domain logic
