// Motor de PDF: Chromium sin ventana (Puppeteer) convierte el HTML de la plantilla en PDF.
import puppeteer from 'puppeteer';

const MAX_PAGES = Number(process.env.PRINT_MAX_PAGES || 4);
const PDF_TIMEOUT_MS = 30000;

let browserPromise = null;
let activePages = 0;
const queue = [];

// Se reutiliza el mismo Chromium entre peticiones (abrirlo tarda alrededor de 1 s)
async function getBrowser() {
    if (browserPromise) {
        const browser = await browserPromise;
        if (browser.connected) return browser;
    }

    browserPromise = puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: ['--no-sandbox', '--disable-dev-shm-usage']
    });

    return browserPromise;
}

// Limita cuántas páginas se generan a la vez para no saturar el servidor
async function acquire() {
    if (activePages < MAX_PAGES) {
        activePages++;
        return;
    }
    await new Promise(resolve => queue.push(resolve));
    activePages++;
}

function release() {
    activePages--;
    queue.shift()?.();
}

/* Convierte un HTML completo en PDF. Tamaño, márgenes y pie salen del @page de la plantilla. */
export async function htmlToPdf(html) {
    await acquire();
    let page;

    try {
        const browser = await getBrowser();
        page = await browser.newPage();

        // La plantilla no carga nada de internet (el logo va incrustado)
        await page.setJavaScriptEnabled(false);
        await page.setContent(html, { waitUntil: 'load', timeout: PDF_TIMEOUT_MS });

        return Buffer.from(await page.pdf({
            printBackground: true,
            preferCSSPageSize: true,
            timeout: PDF_TIMEOUT_MS
        }));
    } finally {
        await page?.close().catch(() => {});
        release();
    }
}

export async function closeBrowser() {
    if (!browserPromise) return;
    const browser = await browserPromise.catch(() => null);
    browserPromise = null;
    await browser?.close();
}
