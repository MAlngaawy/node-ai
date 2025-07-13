import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'A simple Express API with MongoDB for user management',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}`,
        description: 'Development server',
      },
    ],
  },
  apis: [
    process.cwd() + '/src/routes/*.ts',
    process.cwd() + '/src/controllers/*.ts'
  ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
export { swaggerUi };