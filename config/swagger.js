import { generalMainSwagger } from './general/main.swagger.js';
import { documentsPrintSwagger } from './documents/print.swagger.js';

import swaggerJsDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'API_IMPRESION_DOCUMENTOS',
            version: '1.0.0',
            description: 'Documentación de la API de impresión de documentos de SISCAEX Web'
        },
        servers: [
            { url: `${process.env.SWAGGER_URL || ''}/`, description: 'API Documentation' }
        ],
        components: {
            schemas: {
                general: {
                    main: generalMainSwagger
                },
                documents: {
                    print: documentsPrintSwagger
                }
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            { bearerAuth: [] }
        ]
    },
    apis: [
        './routes/documents/*.js'
    ]
};

const swaggerUIOptions = {
    customCss: `
    .swagger-ui .models {
        display: none !important;
    }
    .swagger-ui .topbar {
        background-color: #03243D;
    }
    .swagger-ui .scheme-container {
        background-color: #ECF0F1;
    }
    .swagger-ui .opblock-summary {
        font-weight: bold;
    }
    .swagger-ui .button {
        background-color: #F04E4E;
        color: white;
    }
    `
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerDocs, swaggerUIOptions };
