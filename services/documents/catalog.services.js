// Catálogo de documentos: cada opción dice de dónde salen los datos, cómo se arman y con qué plantilla se pinta.
// Para agregar un documento: nueva opción en DOCUMENT_OPTION, su schema de params, su repositorio y su plantilla.
import { DOCUMENT_OPTION } from '../../globals/enum.globals.js';
import manifestRepositories from '../../repositories/documents/manifest.repositories.js';
import { buildManifests } from './manifest/manifest.builder.js';
import { manifestTemplate } from '../../templates/documents/manifest.template.js';

export const DOCUMENT_CATALOG = Object.freeze({
    [DOCUMENT_OPTION.MANIFEST]: {
        option: DOCUMENT_OPTION.MANIFEST,
        code: 'MANIFEST',
        name: 'Manifiesto',
        description: 'Manifiesto de ingreso, asignación o salida de bodega (formato Rp_ImpManifiesto)',
        params: ['manifests', 'type'],
        // PENDIENTE: definir los objetos del SSO que pueden imprimir (por ahora basta con sesión iniciada)
        permissions: [],
        fileName: params => `manifiesto-${params.manifests.join('-')}`.slice(0, 120),

        async load(params) {
            const manifests = params.manifests.map(code => code.trim().toUpperCase());
            const rows = await manifestRepositories.obtainManifestRows(manifests, params.type);
            const { manifests: built, missing } = buildManifests(rows, manifests);
            return { data: { manifests: built }, empty: built.length === 0, missing };
        },

        render: manifestTemplate
    }
});

export function findDocument(option) {
    return DOCUMENT_CATALOG[option] ?? null;
}

export function listDocuments() {
    return Object.values(DOCUMENT_CATALOG).map(({ option, code, name, description, params }) => ({ option, code, name, description, params }));
}
