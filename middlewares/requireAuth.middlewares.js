import { Response401 } from '../models/responses.models.js';
import { verifyInternalToken, extractBearerToken } from '../utils/token.utils.js';

const environment = process.env.APP_ENV?.toUpperCase() || process.env.NODE_ENV?.toUpperCase() || 'DEVELOPMENT';
const authDisabled = environment !== 'PRODUCTION' && process.env.PRINT_AUTH_DISABLED === 'true';

if (authDisabled) {
    console.warn('Warning: PRINT_AUTH_DISABLED=true; las rutas de impresión no piden token.');
}

/* Exige un token interno válido (el mismo que usa SISCAEX Web).
   Pendiente: revisar permisos por objeto del SSO según el documento (ver catálogo). */
const requireAuth = (req, res, next) => {
    if (authDisabled) {
        req.currentUser = { id: 0, correo: 'pruebas.locales' };
        return next();
    }

    const token = extractBearerToken(req);

    if (!token) {
        return res.status(401).json(new Response401("Token requerido", "TOKEN_REQUIRED"));
    }

    try {
        req.currentUser = verifyInternalToken(token).userData;
    } catch {
        return res.status(401).json(new Response401("Token invalido o expirado", "INVALID_TOKEN"));
    }

    next();
};

export default requireAuth;
