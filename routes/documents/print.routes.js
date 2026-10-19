import { Router } from 'express';
const router = Router();
import requireAuth from '../../middlewares/requireAuth.middlewares.js';
router.use(requireAuth);

// Importación de controllers
import printController from '../../controllers/documents/print.controllers.js';

// Importación de middlewares
import validationMiddleware from '../../middlewares/validation.middlewares.js';

// Importación de schemas
import { printBodySchema } from '../../middlewares/schemas/documents/print.schemas.js';
import { VALIDATION_TYPE } from '../../globals/enum.globals.js';

/* Listado de documentos disponibles */
/**
 * @swagger
 * /documents/catalog/v1:
 *   get:
 *     tags:
 *       - Documentos
 *     summary: Listado de documentos que se pueden imprimir
 *     responses:
 *       200:
 *         description: Catálogo de documentos obtenido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/documents/print/obtainCatalog/responses/Response200'
 *       401:
 *         description: Token requerido o invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/general/main/general/responses/Response401'
 *       500:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/general/main/general/responses/Response500'
 */
router.get('/catalog/v1', printController.obtainCatalog);

/* Generar un documento */
/**
 * @swagger
 * /documents/print/v1:
 *   post:
 *     tags:
 *       - Documentos
 *     summary: Generar un documento en PDF o HTML
 *     description: |
 *       `option` indica el documento (1 = manifiesto). `params` depende del documento.
 *       Con `format: html` devuelve la vista con botón de imprimir (window.print()).
 *       Si algún código no trae datos, se imprime el resto y se informa en el header `X-Documents-Missing`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/documents/print/printDocument/request'
 *     responses:
 *       200:
 *         description: Documento generado
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           text/html:
 *             schema:
 *               type: string
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/general/main/general/responses/Response400'
 *       401:
 *         description: Token requerido o invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/general/main/general/responses/Response401'
 *       404:
 *         description: No se encontró información para imprimir
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/documents/print/printDocument/responses/Response404'
 *       500:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/general/main/general/responses/Response500'
 */
router.post('/print/v1', validationMiddleware(printBodySchema, [VALIDATION_TYPE.BODY]), printController.printDocument);

export default router;
