import { Response500 } from '../models/responses.models.js';

// Último middleware: cualquier error no controlado responde 500 con el formato de la API
// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    if (res.headersSent) return;

    return res.status(500).json(new Response500("Ha ocurrido un error en el proceso", "PROCESS_FAILURE"));
};

export default errorMiddleware;
