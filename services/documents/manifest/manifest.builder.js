// Arma los datos del manifiesto como los muestra el reporte:
//   encabezado -> grupos por servicio -> totales por tipo -> firmas

// Totales del pie, en el mismo orden del reporte. `match` decide en qué total cae cada pieza.
// PENDIENTE: confirmar con qué códigos de servicio (numdig) se calcula cada uno.
// Mientras tanto se clasifica por la descripción del servicio (des_numdig).
export const MANIFEST_TOTALS = [
    { title: 'TOTAL COLLECT', match: row => /COLLECT/i.test(row.des_numdig) },
    { title: 'TOTAL DOCUMENTOS DE RETORNO', match: row => /RETORNO/i.test(row.des_numdig) },
    { title: 'TOTAL ESTANDARD', match: row => row.numdig === 'SE' || /EST[AÁ]NDAR/i.test(row.des_numdig) },
    { title: 'TOTAL ESPECIAL', match: row => /ESPECIAL/i.test(row.des_numdig) },
    { title: 'TOTAL COD', match: row => /\bCOD\b/i.test(row.des_numdig) },
    { title: 'TOTAL GROUPEX', match: row => /GR[OU]+PEX/i.test(row.des_numdig) },
    { title: '-*TOTAL CON ERROR*- ', match: row => row.numdig === 'ER' },
    { title: 'TOTAL ORGANISMO JUDICIAL', match: row => /JUDICIAL/i.test(row.des_numdig) },
    { title: 'TOTAL RECURRENTES', match: row => /RECURRENTE/i.test(row.des_numdig) }
];

const join = (code, description) => [code, description].filter(value => value !== '' && value != null).join(' - ');

function buildManifest(rows) {
    const header = rows[0];
    const services = [];

    for (const row of rows) {
        let group = services.find(service => service.code === row.numdig);
        if (!group) services.push(group = { code: row.numdig, description: row.des_numdig, rows: [] });
        group.rows.push({
            guide: row.numgui,
            service: row.numdig,
            sender: row.remitente,
            recipient: row.destinatario,
            status: row.des_tipmov
        });
    }

    return {
        manifest: header.numman,
        type: header.tipman,
        date: header.fechamanifiesto,
        warehouse: join(header.codbod, header.desbod),
        route: join(header.codrut, header.nomrut),
        pilot: header.piloto,
        assistant: header.auxiliar,
        warehouseKeeper: header.bodeguero,
        unit: header.codcam,
        services,
        totals: [
            ...MANIFEST_TOTALS.map(total => ({ title: total.title, value: rows.filter(total.match).length })),
            { title: 'TOTAL DE PIEZAS', value: rows.length }
        ]
    };
}

/* Agrupa las filas por manifiesto respetando el orden en que se pidieron */
export function buildManifests(rows, requested) {
    const manifests = [];
    const missing = [];

    for (const code of requested) {
        const manifestRows = rows.filter(row => String(row.numman).toUpperCase() === code);
        if (manifestRows.length) manifests.push(buildManifest(manifestRows));
        else missing.push(code);
    }

    return { manifests, missing };
}
