import { OUTPUT_FORMAT } from '../../globals/enum.globals.js';
import { printTimestamp } from '../../utils/date.utils.js';
import { htmlToPdf } from '../../engines/puppeteer.engine.js';
import { findDocument, listDocuments } from './catalog.services.js';

class PrintServices {

    /* Documentos disponibles para imprimir */
    obtainCatalog() {
        return listDocuments();
    }

    /* Genera el documento de la opción indicada en PDF o HTML */
    async printDocument({ option, params, format = OUTPUT_FORMAT.PDF, module }) {
        const document = findDocument(option);

        if (!document) {
            return { status: 404, message: 'El documento solicitado no existe', code: 'DOCUMENT_NOT_FOUND' };
        }

        const { data, empty, missing = [] } = await document.load(params);

        if (empty) {
            return { status: 404, message: 'No se encontró información para imprimir', code: 'DOCUMENT_DATA_NOT_FOUND' };
        }

        const context = {
            module: module || process.env.PRINT_MODULE_NAME || 'SISCAEX WEB',
            printed: printTimestamp(),
            printBar: format === OUTPUT_FORMAT.HTML
        };

        const html = document.render(data, context);
        const fileName = document.fileName(params);

        if (format === OUTPUT_FORMAT.HTML) {
            return { status: 200, contentType: 'text/html; charset=utf-8', body: html, fileName: `${fileName}.html`, missing };
        }

        const pdf = await htmlToPdf(html);
        return { status: 200, contentType: 'application/pdf', body: pdf, fileName: `${fileName}.pdf`, missing };
    }
}

export default new PrintServices();
