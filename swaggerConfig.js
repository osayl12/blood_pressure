const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API Title', // Replace with your API title
            version: '1.0.0',
            description: 'API documentation for the project',
        },
        servers: [
            {
                url: 'http://localhost:7291', // Update if needed
            },
        ],
    },
    // Paths to the API docs (adjust paths based on your project structure)
    apis: ['./Routers/*.js', './Middleware/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
