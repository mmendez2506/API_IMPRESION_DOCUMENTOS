// Importación de librerias
import Joi from 'joi';
import { DOCUMENT_OPTION, OUTPUT_FORMAT } from '../../../globals/enum.globals.js';
import { MANIFEST_CODE_REGEX } from '../../../globals/regex.globals.js';

// Parámetros de cada documento. El cuerpo se valida contra el de la opción enviada.
export const manifestParamsSchema = Joi.object({
    // Hasta 25 códigos: el SP recibe la lista en un VARCHAR(1000)
    manifests: Joi.array()
        .items(Joi.string().trim().pattern(MANIFEST_CODE_REGEX).messages({
            'string.pattern.base': 'El código de manifiesto solo puede tener letras, números y guion'
        }))
        .min(1)
        .max(25)
        .unique()
        .required(),
    // Tipo del manifiesto (I, A, E, P). Con A se usa la opción 2 del SP; con los demás, la 1.
    type: Joi.string().valid('I', 'A', 'E', 'P').optional()
});

const PARAMS_BY_OPTION = {
    [DOCUMENT_OPTION.MANIFEST]: manifestParamsSchema
};

export const printBodySchema = Joi.object({
    option: Joi.number()
        .integer()
        .valid(...Object.values(DOCUMENT_OPTION))
        .required()
        .messages({ 'any.only': 'La opción no corresponde a ningún documento' }),

    format: Joi.string()
        .valid(...Object.values(OUTPUT_FORMAT))
        .default(OUTPUT_FORMAT.PDF),

    // Texto de "Modulo:" en el pie (en el reporte original era el nombre de la máquina)
    module: Joi.string().max(60).optional(),

    params: Joi.when('option', {
        switch: Object.entries(PARAMS_BY_OPTION).map(([option, schema]) => ({ is: Number(option), then: schema.required() })),
        otherwise: Joi.forbidden()
    })
});
