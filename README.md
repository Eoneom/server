# Swarm game server

This project is currently a proof of concept for web strategy game server.

## Setup project

### Launch dependencies

```
cd containers
docker-compose up -d
```

### Build app

```
npm run build
```

### Build app in dev mode

```
npm run build:watch
```

### Start app

```
npm run start
```

Once the app is started, a sample city will be created. It will start gathering plastic and mushroom every second, and will finish building upgrades if there is any. You can then interact with the app with the several commands.

```
# display the sample city data
g.city()

# launch recycling plant upgrade
g.launchRecyclingPlantUpgrade()

# launch mushroom farm upgrade
g.launchMushroomFarmUpgrade()
```

## Roadmap

- feat: create other buildings
- feat: research technologies
- feat: create units
- tech: add unit tests
- tech: add web adapter (HTTP for signup/login and WebSocket for the rest)

## Architecture

### Core

Contains domain logic with mostly pure functions.

The app is built with every module declared in core.
The factory is here to help creating these modules, and handle dependencies between queries and commands.

### Modules

There is a similar architecture for every module:

- domain: business logic only
  - constants: store every constants needed by the domain
  - entity: declare entities used by the domain
  - errors: declare all errors thrown by the domain
  - service: implement business logic to handle commands and queries
- commands: interact with the application to update things
- module: group queries and commands
- queries: ask the application for some data
- repository: declare repositories for the needed entities

The current modules are:

- building: build new buildings if the conditions are met
- city: gather resources

### Database

MongoDB implementation for repository methods. Simple adapter to call mongoDB, and define collections.

- models: declare document classes to create new collections
- generic: implement CRUD calls to MongoDB
- repository: group several repositories together

Every model is built on the same pattern:

- document: declare document classes and export Typegoose model
- repository: extends the generic repository and implement specific methods
