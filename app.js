import express, { json } from 'express';
import morgan, { token } from 'morgan';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

// Importaciones internas
import { swaggerDocs, swaggerUIOptions } from './config/swagger.js';
import errorMiddleware from './middlewares/error.middlewares.js';
import documentRoutes from './routes/routes.js';
import { Response404 } from './models/responses.models.js';

export const app = express();
app.disable('etag');
app.disable('x-powered-by');

// CORS: si CORS_ORIGINS está definido (lista separada por comas), solo esos orígenes
// pueden consumir la API desde el navegador. Sin la variable se mantiene abierto.
const corsOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

if (corsOrigins.length === 0) {
    console.warn('Warning: CORS_ORIGINS no está definido; la API acepta peticiones de cualquier origen.');
}

// Configuracion de middlewares
app.use(cors(corsOrigins.length > 0 ? { origin: corsOrigins, exposedHeaders: ['X-Documents-Missing', 'Content-Disposition'] } : { exposedHeaders: ['X-Documents-Missing', 'Content-Disposition'] }));
app.use(json({ limit: '1mb', strict: true }));

// Configuración de logs con Morgan
token('timestamp', () => new Date().toISOString());
app.use(morgan(':method - :url - :status - :res[content-length] - :response-time ms - :timestamp'));

// Obtenemos el ambiente
const environment = process.env.APP_ENV?.toUpperCase() || process.env.NODE_ENV?.toUpperCase() || "DEVELOPMENT";

// Middleware de proteccion de swagger
function swaggerProtection(req, res, next) {
    if (environment === "PRODUCTION") {
        return res.status(403).json({ message: "Swagger docs are not available in production" });
    }
    next();
}

export async function initialization() {
    try {
        // Ruta de documentacion con Swagger (Solo disponible en DEVELOPMENT)
        app.use('/docs', swaggerProtection, swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUIOptions));

        // Estado del servicio (para monitoreo)
        app.get('/health', (req, res) => res.json({ status: 'ok' }));

        // Sección de documentos
        app.use('/', documentRoutes);

        // Middleware para manejar rutas no encontradas
        app.use((req, res) => {
            return res.status(404).json(new Response404("Path not found", "PATH_NOT_FOUND"));
        });

        app.use(errorMiddleware);

    } catch (error) {
        console.error('Error iniciando el servidor -', error);
        process.exit(1);
    }
}
