// Utilidades compartidas por todas las plantillas
import { readFileSync } from 'node:fs';

const LOGO_PNG = readFileSync(new URL('../assets/logo.png', import.meta.url));
export const LOGO_DATA_URI = `data:image/png;base64,${LOGO_PNG.toString('base64')}`;

// Escapa texto que viene de la base antes de ponerlo en el HTML
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

// Escapa texto para usarlo dentro de content: "..." en CSS
export const cssString = value => String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/[\r\n]/g, ' ');
