const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Blood Pressure Monitoring',
            version: '1.0.0',
            description: 'תיעוד API עבור מערכת שמנהלת פרופילי משתמשים, מתעדת מדידות תקינות ומפיקה דוחות סיכום.',
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
