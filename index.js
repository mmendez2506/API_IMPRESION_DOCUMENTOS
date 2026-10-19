import 'dotenv/config';
import { app, initialization } from './app.js';
import { closePools } from './database.js';
import { closeBrowser } from './engines/puppeteer.engine.js';

const PORT = Number(process.env.SERVER_PORT || 3100);
const HOST = process.env.SERVER_IP || '0.0.0.0';

await initialization();

const server = app.listen(PORT, HOST, () => {
    console.log(`API_IMPRESION_DOCUMENTOS escuchando en http://${HOST}:${PORT}`);
    console.log(`Origen de datos: ${process.env.PRINT_DATA_SOURCE || 'sp'}`);
});

// Cierre ordenado: deja de recibir peticiones, cierra Chromium y el pool
async function shutdown(signal) {
    console.log(`${signal} recibido, cerrando...`);
    server.close();
    await closeBrowser();
    await closePools();
    process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
