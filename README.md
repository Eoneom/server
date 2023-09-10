# Swarm game server (outdated README)

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

## Architecture

### App

Contains all the app features, divided into commands and queries

### Core

Contains domain logic with mostly pure functions.

The app is built with every module declared in core.
The factory is here to help creating these modules, and handle dependencies between queries and commands.

### Principles

#### Application service

The commands and queries that interact with the app have the following role:

- retrieve entities from the repository (storage)
- call business logic methods on entities itself or with domain services
- save the changes if any

### Modules

There is a similar architecture for every module:

- `domain`: business logic only
  - `constants`: store every constants needed by the domain
  - `entity`: declare entities used by the domain
  - `errors`: declare all errors thrown by the domain
  - `service`: implement business logic to handle commands and queries
- `model`: related to data storage and repository
- `commands`: interact with the application to update things
- `module`: group queries and commands
- `queries`: ask the application for some data

The current modules are:

- `building`: upgrade buildings
- `city`: gather resources
- `migration`: create initial data and update existing one
- `player`: init account and store player name
- `pricing`: handle costs for building, technologies and units
- `technology`: research technologies

### Database

MongoDB implementation for repository methods. Simple adapter to call mongoDB, and define collections.
Each document type and model is specified in their own module, inside the `core` folder.

- `generic`: implement CRUD calls to MongoDB
- `repository`: group several repositories together

Every model is built on the same pattern:

- `document`: declare document classes and export Typegoose model
- `repository`: extends the generic repository and implement specific methods

## Interact with the server

Once launched, the app is listening on port `3000` and accept HTTP requests for commands and queries.
