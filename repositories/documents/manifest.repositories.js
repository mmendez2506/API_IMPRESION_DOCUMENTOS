import { readFile } from 'node:fs/promises';
import { cusser_Pool } from '../../database.js';
import { DATA_SOURCE } from '../../globals/enum.globals.js';
import { MANIFEST_CODE_REGEX } from '../../globals/regex.globals.js';
import { ManifestRowModel } from '../../models/documents/manifest.models.js';

const spName = () => process.env.SP_IMPRESION_MANIFIESTO || 'QA_sp_ImpresionManifiesto';
const SAMPLE_FILE = new URL('../../data/manifiestos-ejemplo.json', import.meta.url);

class ManifestRepositories {

    /* Filas del manifiesto según PRINT_DATA_SOURCE (sp | sample) */
    async obtainManifestRows(manifests, type) {
        // Segunda validación antes de llegar a la base: el SP concatena los códigos
        if (!manifests.every(code => MANIFEST_CODE_REGEX.test(code))) {
            throw new Error('Invalid manifest code');
        }

        const source = (process.env.PRINT_DATA_SOURCE || DATA_SOURCE.SP).toLowerCase();

        switch (source) {
            case DATA_SOURCE.SP:
                return this.fromStoredProcedure(manifests, type);
            case DATA_SOURCE.SAMPLE:
                return this.fromSample(manifests);
            default:
                throw new Error(`Unknown PRINT_DATA_SOURCE: ${source}`);
        }
    }

    /* QA_sp_ImpresionManifiesto opción 1 (opción 2 para tipo A) */
    async fromStoredProcedure(manifests, type) {
        const connection = await cusser_Pool.getConnection();

        try {
            // pManifiesto espera los códigos entre comillas: 'CAP1','CAP2'
            const manifestList = manifests.map(code => `'${code}'`).join(',');
            const option = type === 'A' ? 2 : 1;
            const query = `CALL ${spName()}(?, ?, '', NULL, '', '')`;

            const [result] = await connection.query(query, [option, manifestList]);

            // El CALL devuelve [filas, OkPacket]; se toma el primer conjunto que trae filas
            const rows = Array.isArray(result)
                ? (result.find(set => Array.isArray(set) && set.length && 'numman' in set[0]) ?? [])
                : [];

            return rows.map(row => new ManifestRowModel(row));

        } catch (error) {
            console.error(`Error executing stored procedure ${spName()}:`, error);
            throw new Error("Database error while obtaining manifest");
        } finally {
            connection.release();
        }
    }

    /* Datos de ejemplo para probar sin base de datos */
    async fromSample(manifests) {
        const sample = JSON.parse(await readFile(SAMPLE_FILE, 'utf8'));
        return sample.rows
            .filter(row => manifests.includes(row.numman))
            .map(row => new ManifestRowModel(row));
    }
}

export default new ManifestRepositories();
