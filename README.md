# Eoneom game server

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

## Interact with the server

Once launched, the app is listening on port `3000` and accept HTTP requests for commands and queries.
You can find every possible endpoints in the `router.ts` file.

## Architecture

### Adapter

Contains implementation of the app required ports. It includes database connection and queries, logger and lock mechanism.

#### Database

MongoDB implementation for repository port methods. Simple adapter to call mongoDB, and define collections.

Every model is built on the same pattern:

- `document`: declare document classes and export Typegoose model
- `repository`: extends the generic repository and implement specific methods

### App

Contains all the app features, divided into commands and queries.

#### Command

It is designed to follow a `fetch -> exec -> save` pattern to prevent persisting stuff when an error occurs.

- fetch necessary data for application service
- calls application service
- persist updates on entities

#### Port

Describes necessary external methods for the application to work. It includes repository queries, logger and lock mechanism interfaces.

#### Query

Calls the application service or the repository directly to read data.

#### Saga

Orchestrate multiple commands when a serie of use cases needs to be called.

#### Service

Implement high level use cases to respond to player's needs.

### Core

Contains domain logic with mostly pure functions.

Core modules represent the different contexts of the application.

There is a similar architecture for every module:

- `constant`: store every constants needed by the domain
- `value`: contains value objects needed by the domain
- `entity`: declare entities used by the domain
- `error`: declare all errors thrown by the domain
- `service`: implement business logic when multiple entities are needed
- `type`: declare additional useful types used in entities

### Cron

Contains scheduled tasks that call commands and queries of the app.

### Shared

Contains useful helpers and types that does not fit directly in the model, or call simple external libraries. Prevent from using heavy interfacing with the ports and adapters.

### Web

`http` file launches a simple HTTP server using middlewares and router.
The router declares all possible endpoints and link it to their corresponding handler.

#### Handler

Defines how the server will respond for every type of request
