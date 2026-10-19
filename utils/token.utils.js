import jwt from 'jsonwebtoken';

// Valida el token interno que emite el login de API_SISCAEX_WEB (mismo ACCESS_TOKEN_SECRET)
export function verifyInternalToken(token) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

/**
 * Extrae el token del header `Authorization: Bearer <token>`.
 *
 * @param {import('express').Request} req
 * @returns {string|undefined} El token, o undefined si el header falta o no trae valor.
 */
export function extractBearerToken(req) {
    const authHeader = req.headers.authorization;
    return authHeader && authHeader.split(' ')[1];
}
