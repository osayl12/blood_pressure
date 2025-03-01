const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API Title',
            version: '1.0.0',
            description: 'API documentation for the project',
        },
        servers: [
            {
                url: 'http://localhost:7291',
            },
        ],
    },
    apis: ['./Routers/*.js', './Middleware/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
