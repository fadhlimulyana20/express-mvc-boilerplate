
## How To Deploy Free
1. Deploy Free using Railway https://railway.com/
2. Use Free MySQl using https://www.clever-cloud.com/

## Project Directory Structure

```
├── controllers/      # Route controllers for handling requests
├── db/               # Database connection and configuration
├── middlewares/      # Express middlewares (auth, logger, etc.)
├── migrations/       # Database migration files
├── models/           # Database models
├── routes/           # Route definitions
├── seeds/            # Database seeders
├── services/         # Business logic and service layer
├── types/            # TypeScript type definitions
├── utils/            # Utility/helper functions (logger, mail, etc.)
├── Dockerfile        # Docker configuration
├── index.ts          # Main entry point
├── knexfile.ts       # Knex configuration
├── openapi.yaml      # OpenAPI (Swagger) specification
├── package.json      # Project dependencies and scripts
├── swagger.ts        # Swagger setup
├── tsconfig.json     # TypeScript configuration
```

### Key Directories and Files

- **controllers/**: Handles incoming HTTP requests and calls services.
- **db/**: Sets up and exports the database connection (Knex).
- **middlewares/**: Custom Express middlewares (e.g., authentication, logging).
- **migrations/**: Knex migration files for database schema changes.
- **models/**: TypeScript interfaces and database model logic.
- **routes/**: Express route definitions and route grouping.
- **seeds/**: Knex seed files for populating the database with initial data.
- **services/**: Business logic, interacts with models and database.
- **types/**: Custom TypeScript type definitions and module augmentation.
- **utils/**: Utility functions (logging, mail, response formatting, etc.).
- **Dockerfile**: Docker container configuration for deployment.
- **index.ts**: Main application entry point.
- **knexfile.ts**: Knex configuration for migrations and seeds.
- **openapi.yaml**: API documentation in OpenAPI format.
- **package.json**: Project metadata, dependencies, and scripts.
- **swagger.ts**: Swagger UI and docs setup for Express.
- **tsconfig.json**: TypeScript compiler options.