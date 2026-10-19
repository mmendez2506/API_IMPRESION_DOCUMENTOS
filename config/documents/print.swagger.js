export const documentsPrintSwagger = {
  "obtainCatalog": {
    "request": null,
    "responses": {
      "Response200": {
        "type": "object",
        "properties": {
          "status": { "type": "integer", "example": 200 },
          "message": { "type": "string", "example": "Catálogo de documentos obtenido" },
          "data": {
            "type": "array",
            "items": { "type": "object" },
            "example": [{ "option": 1, "code": "MANIFEST", "name": "Manifiesto", "description": "string", "params": ["manifests", "type"] }]
          },
          "success": { "type": "boolean", "example": true }
        }
      }
    }
  },
  "printDocument": {
    "request": {
      "type": "object",
      "required": ["option", "params"],
      "properties": {
        "option": { "type": "integer", "example": 1, "description": "Documento a imprimir (1 = manifiesto)" },
        "format": { "type": "string", "enum": ["pdf", "html"], "example": "pdf" },
        "module": { "type": "string", "example": "SISCAEX WEB", "description": "Texto de 'Modulo:' en el pie" },
        "params": {
          "type": "object",
          "properties": {
            "manifests": { "type": "array", "items": { "type": "string" }, "example": ["CAP4910693", "CAP4910694"] },
            "type": { "type": "string", "enum": ["I", "A", "E", "P"], "example": "I" }
          }
        }
      }
    },
    "responses": {
      "Response404": {
        "type": "object",
        "properties": {
          "status": { "type": "integer", "example": 404 },
          "message": { "type": "string", "example": "No se encontró información para imprimir" },
          "error": { "type": "object", "properties": { "code": { "type": "string", "example": "DOCUMENT_DATA_NOT_FOUND" } } },
          "success": { "type": "boolean", "example": false }
        }
      }
    }
  }
};
