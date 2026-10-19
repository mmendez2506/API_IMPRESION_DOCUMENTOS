// Tipos de validacion para middleware
export const VALIDATION_TYPE = Object.freeze({
    BODY: "BODY",
    QUERY: "QUERY",
    PARAM: "PARAM"
});

// Documentos que sabe imprimir la API (la "opción" que envía el cliente)
export const DOCUMENT_OPTION = Object.freeze({
    MANIFEST: 1
    // Siguientes documentos: agregarlos aquí y en services/documents/catalog.services.js
});

// Formato de salida
export const OUTPUT_FORMAT = Object.freeze({
    PDF: 'pdf',
    HTML: 'html'
});

// Origen de los datos de cada documento
export const DATA_SOURCE = Object.freeze({
    SP: 'sp',
    SAMPLE: 'sample'
});
