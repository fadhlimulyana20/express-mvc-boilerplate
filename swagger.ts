import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Express MVC Boilerplate API',
      version: '1.0.0',
      description: 'API documentation for authentication and role management',
    },
    servers: [
      { url: 'http://localhost:3000/api' }
    ],
  },
  apis: ['./routes/*.ts', './controllers/*.ts'], // JSDoc comments in these files
};

export const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
