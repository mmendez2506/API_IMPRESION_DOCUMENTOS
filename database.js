import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Obtenemos el ambiente actual
const environment =
    process.env.APP_ENV?.toUpperCase() ||
    process.env.NODE_ENV?.toUpperCase() ||
    'DEVELOPMENT';

// Configuración de MySQL según el ambiente
const SiscaexDbConfig = (() => {
    const PRODUCTION = {
        HOST: process.env.SISCAEX_DB_HOST_PRODUCTION,
        USER: process.env.SISCAEX_DB_USER_PRODUCTION,
        PASSWORD: process.env.SISCAEX_DB_PASSWORD_PRODUCTION
    };

    const DEVELOPMENT = {
        HOST: process.env.SISCAEX_DB_HOST_DEVELOPMENT,
        USER: process.env.SISCAEX_DB_USER_DEVELOPMENT,
        PASSWORD: process.env.SISCAEX_DB_PASSWORD_DEVELOPMENT
    };

    return environment === 'PRODUCTION'
        ? PRODUCTION
        : DEVELOPMENT;
})();

/**
 * Pool de conexiones MySQL - base cusser.
 * mysql2 no abre conexiones hasta la primera consulta, así que con
 * PRINT_DATA_SOURCE=sample la API levanta sin base de datos.
 */
export const cusser_Pool = createPool({
    host: SiscaexDbConfig.HOST,
    user: SiscaexDbConfig.USER,
    password: SiscaexDbConfig.PASSWORD,
    port: Number(process.env.DB_PORT || 3306),
    database: 'cusser',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 50,
    idleTimeout: 60000
});

/**
 * Cierra el pool
 */
export async function closePools() {
    try {
        await cusser_Pool.end();
        console.log('Connection pools closed');
    } catch (error) {
        console.error('Error closing pools:', error.message);
    }
}
