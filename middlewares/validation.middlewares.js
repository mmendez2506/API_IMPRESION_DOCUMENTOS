import { Response400 } from '../models/responses.models.js';
import { VALIDATION_TYPE } from '../globals/enum.globals.js';
import { JOI_MESSAGES_ES } from '../globals/joiMessages.globals.js';

const validationMiddleware = (
    schema,
    types = [VALIDATION_TYPE.BODY]
) => {
    return (req, res, next) => {
        const options = { abortEarly: false, messages: JOI_MESSAGES_ES };
        let errors = [];

        const validate = (schemaToUse, data, from) => {
            if (!schemaToUse) return;

            const { error } = schemaToUse.validate(data, options);

            if (error) {
                errors.push(
                    ...error.details.map(detail => ({
                        location: from,
                        field: detail.path.join('.'),
                        message: detail.message.replace(/"/g, '')
                    }))
                );
            }
        };

        // Tipo 1: Schema unico
        if (typeof schema.validate === 'function') {
            for (const type of types) {
                switch (type) {
                    case VALIDATION_TYPE.BODY:
                        validate(schema, req.body, 'body');
                        break;
                    case VALIDATION_TYPE.QUERY:
                        validate(schema, req.query, 'query');
                        break;
                    case VALIDATION_TYPE.PARAM:
                        validate(schema, req.params, 'params');
                        break;
                }
            }
        }

        // Tipo 2: Schema por tipo
        else if (typeof schema === 'object') {
            const schemaMap = {
                [VALIDATION_TYPE.BODY]: req.body,
                [VALIDATION_TYPE.QUERY]: req.query,
                [VALIDATION_TYPE.PARAM]: req.params,
            };

            for (const [type, data] of Object.entries(schemaMap)) {
                validate(schema[type], data, type.toLowerCase());
            }
        }
        else {
            return next(new Error('Invalid validation schema configuration'));
        }

        if (errors.length > 0) {
            return res.status(400).json(
                new Response400('Error de validación', 'VALIDATION_ERROR', errors)
            );
        }

        next();
    };
};

export default validationMiddleware;