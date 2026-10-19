# API_IMPRESION_DOCUMENTOS

API de impresión de documentos de SISCAEX Web. Recibe **una opción** (qué documento) y sus **parámetros**, trae los datos de la base, los pinta con una plantilla HTML/CSS y devuelve un **PDF** (con Puppeteer) o la **vista HTML** para imprimir con `window.print()`.

Sigue la misma estructura y las mismas convenciones de API_SISCAEX_WEB: routes → controllers → services → repositories → models, validación con Joi, respuestas `Response200/404/...` y Swagger.

> **Estado:** el manifiesto (opción 1) funciona con el SP `QA_sp_ImpresionManifiesto` y con datos de ejemplo. Lo que falta definir está en **Pendientes** (al final).

## Cómo correrlo

Requisitos: Node 20.9 o superior.

```bash
npm install          # descarga también Chromium para Puppeteer (solo la primera vez)
cp .env.example .env # y completar
npm run dev
```

Con `PRINT_DATA_SOURCE=sample` y `PRINT_AUTH_DISABLED=true` levanta sin base de datos y sin token, para probar.

- Swagger: `http://localhost:3100/docs` (no disponible en PRODUCTION)
- Estado: `GET /health`

## Endpoints

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/documents/catalog/v1` | Lista los documentos que se pueden imprimir |
| POST | `/documents/print/v1` | Genera el documento en PDF o HTML |

Las dos rutas piden el token de SISCAEX Web (`Authorization: Bearer ...`), validado con el mismo `ACCESS_TOKEN_SECRET`.

### Ejemplo: imprimir manifiestos

```http
POST /documents/print/v1
Content-Type: application/json

{
  "option": 1,
  "format": "pdf",
  "module": "SISCAEX WEB",
  "params": { "manifests": ["CAP4910693", "CAP4910694"], "type": "I" }
}
```

| Campo | Obligatorio | Descripción |
|---|---|---|
| `option` | Sí | Documento: `1` = manifiesto |
| `format` | No | `pdf` (por defecto) o `html` |
| `module` | No | Texto de "Modulo:" en el pie. Si no viene, usa `PRINT_MODULE_NAME` |
| `params.manifests` | Sí | De 1 a 25 códigos; solo letras, números y guion |
| `params.type` | No | `A` usa la opción 2 del SP; los demás, la opción 1 |

Respuestas:

- **200:** el PDF (`application/pdf`) o el HTML. Si algún código no trajo datos, se imprimen los demás y se informa en el header `X-Documents-Missing`.
- **400:** validación (código con caracteres no permitidos, opción que no existe...).
- **401:** sin token o token vencido.
- **404:** ninguno de los manifiestos trajo datos.

### Consumirlo desde la web (F10)

```ts
const res = await api.post('/documents/print/v1',
  { option: 1, params: { manifests: [manifiesto] } },
  { responseType: 'blob' });

const url = URL.createObjectURL(res.data);
window.open(url);          // se abre en el visor del navegador; Ctrl+P para imprimir
```

## Estructura

```
index.js / app.js                         arranque, CORS, Swagger, rutas, cierre ordenado
database.js                               pool cusser (mismas variables que API_SISCAEX_WEB)
routes/documents/print.routes.js          rutas + documentación Swagger
controllers/documents/print.controllers.js
services/documents/catalog.services.js    catálogo de documentos (opción -> datos, armado, plantilla)
services/documents/print.services.js      genera el PDF o el HTML
services/documents/manifest/manifest.builder.js   agrupa por servicio y calcula los totales
repositories/documents/manifest.repositories.js   origen de datos: sp | sample
models/documents/manifest.models.js       columnas que devuelve QA_sp_ImpresionManifiesto
templates/documents/manifest.template.js  plantilla HTML/CSS con el formato de Rp_ImpManifiesto
engines/puppeteer.engine.js               HTML -> PDF (reutiliza Chromium, limita páginas simultáneas)
middlewares/                              token, validación Joi, errores
data/manifiestos-ejemplo.json             filas de ejemplo con las columnas reales del SP
assets/logo.png                           logo tomado del reporte original
```

## Cómo agregar otro documento

1. Agregar la opción en `globals/enum.globals.js` (`DOCUMENT_OPTION`).
2. Agregar su schema de `params` en `middlewares/schemas/documents/print.schemas.js`.
3. Crear su repositorio (de dónde salen los datos) y su plantilla en `templates/documents/`.
4. Registrarlo en `services/documents/catalog.services.js`.

Las rutas, el controller y el motor de PDF no cambian.

## Origen de datos

Los datos salen del SP. Se elige con `PRINT_DATA_SOURCE`:

| Valor | Qué usa |
|---|---|
| `sp` (por defecto) | `QA_sp_ImpresionManifiesto`. El nombre se cambia con `SP_IMPRESION_MANIFIESTO` (por ejemplo, para producción) |
| `sample` | `data/manifiestos-ejemplo.json`, sin base de datos, para pruebas o demos |

Se llama a la opción 1 del SP (opción 2 si `type` es `A`), con los códigos entre comillas: `'CAP1','CAP2'`. Como el SP arma el `IN(...)` concatenando texto, los códigos se validan dos veces (en Joi y en el repositorio) y solo se aceptan letras, números y guion.

## Pendientes

- [ ] **Probar con QA** y confirmar el nombre del SP para producción (`SP_IMPRESION_MANIFIESTO`).
- [ ] **Totales:** confirmar con qué códigos de servicio (`numdig`) se calcula cada total (`MANIFEST_TOTALS` en el builder). Hoy se clasifica por la descripción del servicio.
- [ ] **Permisos:** definir qué objetos del SSO pueden imprimir (`permissions` en el catálogo). Hoy basta con tener sesión.
- [ ] **Variantes:** tipo P (`Rp_Imprimir_Manifiesto`) y Honduras (`sp_ImpresionManifiestoHN`).
- [ ] **Impresión automática:** al Finalizar la Salida o solo con F10.
- [ ] **Servidor:** dónde corre la API y si Chromium se descarga con npm o se usa uno instalado (`PUPPETEER_EXECUTABLE_PATH`).
- [ ] **Caché:** guardar el PDF de manifiestos cerrados para no consultarlos de nuevo.
