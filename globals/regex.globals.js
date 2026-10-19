// Código de manifiesto: solo letras, números y guion.
// Es obligatorio porque el SP arma el IN(...) concatenando texto.
export const MANIFEST_CODE_REGEX = /^[A-Za-z0-9-]{1,30}$/;
