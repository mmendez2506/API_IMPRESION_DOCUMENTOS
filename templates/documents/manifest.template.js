// Plantilla HTML/CSS del manifiesto, con el mismo formato del reporte Rp_ImpManifiesto.
// La misma plantilla sirve para el PDF (Puppeteer) y para la vista HTML con window.print().
import { escapeHtml, cssString, LOGO_DATA_URI } from '../template.utils.js';

const footerText = context => `Modulo: ${context.module} Fecha y hora de impresion: ${context.printed.date} Hora: ${context.printed.time}`;

function styles(context) {
    return `
  /* El pie con "Página X de Y" usa las cajas de margen de @page (Chrome 131+) */
  @page {
    size: letter;
    margin: 9mm 5mm 16mm;
    @bottom-left {
      content: "${cssString(footerText(context))}";
      font: bold 8pt Arial, Helvetica, sans-serif; vertical-align: top; padding-top: 1.2mm;
      border-top: 0.7mm solid #000; margin-top: 4mm;
    }
    @bottom-right {
      content: "Página " counter(page) " de " counter(pages);
      font: bold 8pt Arial, Helvetica, sans-serif; vertical-align: top; padding-top: 1.2mm; padding-right: 8mm;
      border-top: 0.7mm solid #000; margin-top: 4mm;
    }
  }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #000; margin: 0; }
  .manifiesto { break-after: page; }
  .manifiesto:last-child { break-after: auto; }

  .titulo { position: relative; height: 15mm; }
  .titulo img { position: absolute; left: 4mm; top: 0.5mm; height: 13mm; width: auto; }
  .titulo h1 { margin: 0; padding-top: 2.5mm; text-align: center; font-size: 17pt; }

  .cabecera { display: flex; align-items: stretch; gap: 3mm; margin: 2.5mm 0 0 2.5mm; }
  .caja { flex: 0 0 87.5%; display: flex; border: 0.3mm solid #000; padding: 2mm 3mm 0.5mm; font-weight: bold; font-size: 9pt; line-height: 1.45; }
  .caja .izq { flex: 0 0 51%; }
  .caja .izq .num { font-size: 12.5pt; text-align: center; margin-bottom: 0.6mm; }
  .caja .der .fila { display: flex; }
  .caja .der .fila span:first-child { width: 34mm; }
  .tipo { flex: 0 0 18.5mm; border: 0.9mm double #000; outline: 0.3mm solid #000; outline-offset: 0.6mm;
          display: flex; align-items: center; justify-content: center; font-size: 34pt; margin: 0.6mm; }

  .servicio { margin: 4mm 0 0 4.5mm; font-size: 9pt; font-weight: bold; break-inside: avoid; }
  .cols, .det { display: grid; grid-template-columns: 18.1% 34.6% 28.6% 18.7%; padding-left: 3.5mm; }
  .cols { font-weight: bold; font-size: 9pt; margin-top: 0.8mm; align-items: end; }
  .cols span:last-child { position: relative; top: -0.6mm; }
  .det { font-size: 9pt; line-height: 1.15; break-inside: avoid; }
  .det span:nth-child(2) { padding-left: 1mm; }

  .totales { margin-top: 8mm; border-top: 1.4mm double #000; border-bottom: 1.4mm double #000; padding: 0.8mm 0;
             text-align: center; font-weight: bold; font-size: 11.5pt; line-height: 1.3; break-inside: avoid; }
  .firmas { display: flex; justify-content: center; gap: 7.5mm; margin: 11mm 0 0 -5mm; break-inside: avoid; }
  .firmas div { width: 69mm; border-top: 1mm double #000; text-align: center; font-weight: bold; font-size: 11pt; padding-top: 1.5mm; }

  @media screen {
    body { background: #e2e8f0; }
    .hoja { background: #fff; width: 216mm; min-height: 279mm; margin: 16px auto; padding: 9mm 5mm; box-shadow: 0 2px 10px #0003; display: flex; flex-direction: column; }
    .pie-pantalla { display: flex; justify-content: space-between; border-top: 0.7mm solid #000; margin-top: auto; padding-top: 1.2mm; font: bold 8pt Arial; }
    .barra { position: sticky; top: 0; background: #003a63; color: #fff; padding: 10px; text-align: center; z-index: 1; }
    .barra button { font-size: 14px; padding: 6px 18px; cursor: pointer; }
  }
  @media print { .barra, .pie-pantalla { display: none; } .hoja { padding: 0; } }
  `;
}

function manifestBlock(manifest, context) {
    const services = manifest.services.map(service => `
    <div class="servicio">Servicio: ${escapeHtml(service.code)} - ${escapeHtml(service.description)}</div>
    <div class="cols"><span>GUIA</span><span>REMITENTE</span><span>DESTINATARIO</span><span>STATUS</span></div>
    ${service.rows.map(row => `<div class="det"><span>${escapeHtml(row.service)}&nbsp;&nbsp;&nbsp;${escapeHtml(row.guide)}</span><span>${escapeHtml(row.sender)}</span><span>${escapeHtml(row.recipient)}</span><span>${escapeHtml(row.status)}</span></div>`).join('')}
  `).join('');

    return `
  <section class="manifiesto hoja">
    <div class="titulo"><img src="${LOGO_DATA_URI}" alt="Cargo Expreso"><h1>Cargo Expreso, S.A.</h1></div>
    <div class="cabecera">
      <div class="caja">
        <div class="izq">
          <div class="num">MANIFIESTO: ${escapeHtml(manifest.manifest)}</div>
          <div>Bodega: ${escapeHtml(manifest.warehouse)}</div>
          <div>Ruta: ${escapeHtml(manifest.route)}</div>
          <div>Piloto: ${escapeHtml(manifest.pilot)}</div>
        </div>
        <div class="der">
          <div class="fila"><span>Fecha de manifiesto</span><span>${escapeHtml(manifest.date)}</span></div>
          <div>Auxiliar: ${escapeHtml(manifest.assistant)}</div>
          <div>Bodeguero: ${escapeHtml(manifest.warehouseKeeper)}</div>
          <div>Unidad: ${escapeHtml(manifest.unit)}</div>
        </div>
      </div>
      <div class="tipo">${escapeHtml(manifest.type)}</div>
    </div>
    ${services}
    <div class="totales">${manifest.totals.map(total => `<div>${escapeHtml(total.title)}: ${total.value}</div>`).join('')}</div>
    <div class="firmas"><div>Firma: ${escapeHtml(manifest.pilot)}</div><div>Firma Encargado</div></div>
    <div class="pie-pantalla"><span>${escapeHtml(footerText(context))}</span><span>Vista en pantalla</span></div>
  </section>`;
}

/**
 * @param {{ manifests: object[] }} data  resultado de buildManifests
 * @param {{ module: string, printed: { date: string, time: string }, printBar?: boolean }} context
 */
export function manifestTemplate(data, context) {
    return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Manifiestos</title><style>${styles(context)}</style></head><body>
  ${context.printBar ? '<div class="barra"><button onclick="window.print()">Imprimir</button></div>' : ''}
  ${data.manifests.map(manifest => manifestBlock(manifest, context)).join('')}
  </body></html>`;
}
