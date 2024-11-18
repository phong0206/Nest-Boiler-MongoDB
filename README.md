# [NestArchitectureCleanBase]

## Required

- Nodejs >= 18x
- MSSQL 2022
- NestJs 10.x

## Architecture Overview

### Packaging Rules

List components in source code and explain it.

Example:

```
.
├── src - Source code of the application
│   │
│   ├── domain - Domain layer
│   │   ├── adapters - Interface adapters layer
│   │   ├── config - Configuration interfaces
│   │   ├── exceptions - Exception handling interfaces
│   │   ├── logger - Logger interfaces
│   │   ├── model - Domain entities
│   │   └── repositories - Domain repository interfaces
│   │
│   ├── infrastructure - Infrastructure layer implementations
│   │   ├── common - Common infrastructure utilities
│   │   │   ├── filter - Exception filters
│   │   │   │   └── exception.filter.ts - Exception filter implementation
│   │   │   ├── guards - Security guards
│   │   │   ├── interceptors - Interceptors for request/response handling
│   │   │   │   ├── logger.interceptor.ts - Logger interceptor
│   │   │   │   └── response.interceptor.ts - Response interceptor
│   │   │   ├── strategies - Authentication strategies
│   │   │   ├── swagger - Define Api docs using swagger
│   │   │   └── validator - Define rule for validation
│   │   ├── config - Configuration implementations
│   │   │   └── environment - Environment configuration
│   │   ├── controllers - Controllers handle incoming requests and return responses
│   │   ├── entities - Define entities
│   │   ├── exceptions - Exception handling implementations
│   │   │   ├── exceptions.module.ts - Exceptions module
│   │   │   └── exceptions.service.ts - Exceptions service
│   │   ├── logger - Logger implementations
│   │   │   ├── logger.module.ts - Logger module
│   │   │   └── logger.service.ts - Logger service
│   │   ├── repositories - Repository implementations
│   │   └── services - Infrastructure service implementations
│   │
│   ├── use-cases - Application use-cases
│   │
│   ├── app.module.ts - Root module of the application
│   └── main.ts - Entry point of the application
|
├── database - Database-related files
│   └── migrations - Database migration scripts
│       └── 1716541925682-xxx-xxx.ts - Migration script for creating table
|
├── test - Testing-related files
|
├── docker-compose.yml - Configuration for Docker Compose to set up and run multi-container Docker applications
└── Dockerfile - Instructions to build a Docker image for the application
```

Flow Request



## Get started

### Set up `app`

#### 1. Clone repository

```console
git clone https://github.com/phong0206/Nest-Architecture-Clean-Base
```

#### 2. Copy `.env.example` to `.env`

```console
cp .env.example .env
```

_note: Please fill in the necessary environment variables in the `.env` file._

#### 3. Create network container

```console
docker network create app-network
```

#### 4. Build the application

```console
docker compose build
```

### Run up app container service

```console
docker compose up
```

## App Server

Open http://[ip_network_container_api]:8080

## API Documentation

Open http://[ip_network_container_api]:8080/api

### Commands

#### Execute in the container

```console
docker exec -it app bash
```

#### Install package

```console
docker exec -it app npm install <package-name>
```

#### Run test

```console
# Run coverage test
docker exec -it app npm run test:cov

# Run all tests
docker exec -it app npm run test

# Run test watch with debug
docker exec -it app npm run test:watch <test-file>
```

## Database Migration

Run database migration:

```console
# Up
docker exec -it app npm run migration:run

# Down
docker exec -it app npm run migration:revert

# Generate migration by entity
docker exec -it app npm run migration:generate --name=<migration-name>

# Create migration
docker exec -it app npm run migration:create --name=<migration-name>
```
Technologies used in the project:
- Mail server ( SES + custom smtp server)
- authentication (access token + refresh token)
- swagger
- mongoose
- storage (S3)
- QueueJobs (Bull)
- Redis
