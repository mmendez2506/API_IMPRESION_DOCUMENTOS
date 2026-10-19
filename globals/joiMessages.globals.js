// Mensajes en español para los codigos de error nativos de Joi. Se aplican de forma
// global en el middleware de validacion; un schema puede sobreescribirlos puntualmente
// con su propio .messages({...}) (ej. middlewares/schemas/auth/main.schemas.js).
const JOI_MESSAGES_ES = {
    'any.required': '{{#label}} es un campo obligatorio',
    'any.only': '{{#label}} debe ser uno de los siguientes valores: {{#valids}}',
    'any.unknown': '{{#label}} no es un campo permitido',
    'any.invalid': '{{#label}} contiene un valor no válido',

    'string.base': '{{#label}} debe ser de tipo texto',
    'string.empty': '{{#label}} no puede estar vacío',
    'string.min': '{{#label}} debe tener al menos {{#limit}} caracteres',
    'string.max': '{{#label}} no debe tener más de {{#limit}} caracteres',
    'string.length': '{{#label}} debe tener exactamente {{#limit}} caracteres',
    'string.email': '{{#label}} debe ser un correo electrónico válido',
    'string.pattern.base': '{{#label}} no tiene el formato esperado',
    'string.uri': '{{#label}} debe ser una URL válida',
    'string.guid': '{{#label}} debe ser un identificador (GUID) válido',

    'number.base': '{{#label}} debe ser un número',
    'number.integer': '{{#label}} debe ser un número entero',
    'number.positive': '{{#label}} debe ser un número positivo',
    'number.min': '{{#label}} debe ser mayor o igual a {{#limit}}',
    'number.max': '{{#label}} debe ser menor o igual a {{#limit}}',
    'number.greater': '{{#label}} debe ser mayor a {{#limit}}',
    'number.less': '{{#label}} debe ser menor a {{#limit}}',

    'boolean.base': '{{#label}} debe ser verdadero o falso',

    'array.base': '{{#label}} debe ser un arreglo',
    'array.min': '{{#label}} debe contener al menos {{#limit}} elemento(s)',
    'array.max': '{{#label}} no debe contener más de {{#limit}} elemento(s)',
    'array.length': '{{#label}} debe contener exactamente {{#limit}} elemento(s)',

    'object.base': '{{#label}} debe ser un objeto',
    'object.min': '{{#label}} debe tener al menos {{#limit}} campo(s)',
    'object.unknown': '{{#label}} no es un campo permitido',

    'date.base': '{{#label}} debe ser una fecha válida'
};

export { JOI_MESSAGES_ES };
