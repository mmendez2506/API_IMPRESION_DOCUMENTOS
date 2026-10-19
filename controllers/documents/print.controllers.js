import { Response200, Response404, Response500 } from '../../models/responses.models.js';
import printServices from '../../services/documents/print.services.js';

class PrintController {

    /* Listado de documentos que se pueden imprimir */
    async obtainCatalog(req, res, next) {
        try {
            return res.status(200).json(new Response200('Catálogo de documentos obtenido', printServices.obtainCatalog()));
        } catch (err) {
            next(err);
        }
    }

    /* Genera el documento (PDF o HTML) */
    async printDocument(req, res, next) {
        try {
            const result = await printServices.printDocument(req.body);

            switch (result?.status) {
                case 200:
                    res.setHeader('Content-Type', result.contentType);
                    res.setHeader('Content-Disposition', `inline; filename="${result.fileName}"`);
                    res.setHeader('Cache-Control', 'no-store');
                    // Códigos pedidos que no trajeron datos (los demás sí se imprimen)
                    if (result.missing.length) {
                        res.setHeader('X-Documents-Missing', result.missing.join(','));
                        res.setHeader('Access-Control-Expose-Headers', 'X-Documents-Missing');
                    }
                    return res.status(200).send(result.body);

                case 404:
                    return res.status(404).json(new Response404(result.message, result.code));

                default:
                    return res.status(500).json(new Response500("Ha ocurrido un error en el proceso", "PROCESS_FAILURE"));
            }
        } catch (err) {
            next(err);
        }
    }
}

export default new PrintController();
