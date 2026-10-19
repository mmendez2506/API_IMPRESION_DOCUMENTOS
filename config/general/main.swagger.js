// Generate Schema from Model
export const generateSchema = (model) => {
    const instance = new model({});
    const properties = Object.keys(instance).reduce((acc, key) => {
        let type;

        if (typeof instance[key] === 'number') {
            type = 'number';
        } else if (typeof instance[key] === 'string') {
            type = 'string';
        } else if (Array.isArray(instance[key])) {
            type = 'array';
        } else {
            type = 'object';
        }

        acc[key] = { type };
        return acc;
    }, {});

    return { type: 'object', properties };
};

export const generateExample = (model) => {
    const instance = new model({});
    return buildExample(instance);
};

function buildExample(obj) {
    if (obj === null || obj === undefined) return 0;

    if (typeof obj === "string") return "string";
    if (typeof obj === "number") return 0;
    if (typeof obj === "boolean") return true;
    if (obj instanceof Date) return new Date().toISOString();

    if (Array.isArray(obj)) return [];

    const example = {};
    for (const key of Object.keys(obj)) {
        const value = obj[key];
        example[key] = buildExample(value);
    }

    return example;
}

const schemas = {
    general: {
        responses: {
            Response500: {
                type: "object",
                properties: {
                    status: { type: "integer", example: 500 },
                    message: { type: "string", example: "Internal server error" },
                    error: {
                        type: "object",
                        properties: {
                            code: { type: "string", example: "INTERNAL_SERVER_ERROR" },
                        },
                    },
                    success: { type: "boolean", example: false },
                }
            },
            Response403: {
                type: "object",
                properties: {
                    status: { type: "integer", example: 403 },
                    message: { type: "string", example: "No tiene permisos para realizar esta acción" },
                    error: {
                        type: "object",
                        properties: {
                            code: { type: "string", example: "FORBIDDEN_NOT_ADMIN" },
                        },
                    },
                    success: { type: "boolean", example: false },
                }
            },
            Response401: {
                type: "object",
                properties: {
                    status: { type: "integer", example: 401 },
                    message: { type: "string", example: "Token requerido" },
                    error: {
                        type: "object",
                        properties: {
                            code: { type: "string", example: "TOKEN_REQUIRED" },
                        },
                    },
                    success: { type: "boolean", example: false },
                }
            },
            Response400: {
                type: "object",
                properties: {
                    status: { type: "integer", example: 400 },
                    message: { type: "string", example: "Error de validación" },
                    error: {
                        type: "object",
                        properties: {
                            code: { type: "string", example: "VALIDATION_ERROR" },
                            details: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        location: { type: "string", example: "query" },
                                        field: { type: "string", example: "guia" },
                                        message: { type: "string", example: "guia es un campo obligatorio" }
                                    }
                                }
                            }
                        },
                    },
                    success: { type: "boolean", example: false },
                }
            }
        }
    }
};

export const generalMainSwagger = {
    general: {
        request: null,
        responses: {
            Response500: schemas.general.responses.Response500,
            Response403: schemas.general.responses.Response403,
            Response401: schemas.general.responses.Response401,
            Response400: schemas.general.responses.Response400
        }
    }
};