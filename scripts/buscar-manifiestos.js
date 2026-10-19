// Busca manifiestos recientes en la base configurada en el .env (solo lectura).
// Uso:  node scripts/buscar-manifiestos.js [dias] [tipo]
//   dias: cuántos días hacia atrás revisar (por defecto 3)
//   tipo: I (ingreso), A (asignación), E (egreso/salida) o P (por defecto I y E)
import 'dotenv/config';
import { cusser_Pool, closePools } from '../database.js';

const SP = process.env.SP_IMPRESION_MANIFIESTO || 'QA_sp_ImpresionManifiesto';
const DIAS = Number(process.argv[2] || 3);
const TIPOS = process.argv[3] ? [process.argv[3].toUpperCase()] : ['I', 'E'];
const MAXIMO = 15;

const primerConjunto = result => (Array.isArray(result) ? result.find(set => Array.isArray(set)) : null) ?? [];
const fecha = dias => {
    const d = new Date();
    d.setDate(d.getDate() - dias);
    return d.toISOString().slice(0, 10);
};

async function main() {
    const conn = await cusser_Pool.getConnection();
    try {
        // Opción 3: catálogo de rutas
        const [rutasRes] = await conn.query(`CALL ${SP}(3, '', '', NULL, '', '')`);
        const rutas = primerConjunto(rutasRes).map(r => r.valor ?? Object.values(r)[0]).filter(Boolean);
        console.log(`Rutas en el catálogo: ${rutas.length}. Revisando ${DIAS} día(s), tipos ${TIPOS.join(', ')}...\n`);

        const encontrados = [];
        buscar:
        for (let d = 0; d < DIAS; d++) {
            for (const tipo of TIPOS) {
                for (const ruta of rutas) {
                    // Opción 4: manifiestos de una ruta por fecha y tipo
                    const [res] = await conn.query(`CALL ${SP}(4, '', ?, ?, ?, '')`, [tipo, fecha(d), ruta]);
                    for (const m of primerConjunto(res)) {
                        encontrados.push({ MANIFIESTO: m.MANIFIESTO, TIPO: m.TIPO, PIEZAS: m.PZS, FECHA: m.FECHA, RUTA: m.RUTA, PILOTO: m.PILOTO });
                        if (encontrados.length >= MAXIMO) break buscar;
                    }
                }
            }
        }

        if (!encontrados.length) {
            console.log('No se encontraron manifiestos. Prueba con más días: node scripts/buscar-manifiestos.js 10');
            return;
        }
        encontrados.sort((a, b) => Number(b.PIEZAS) - Number(a.PIEZAS));
        console.table(encontrados);
        console.log('\nUsa la columna MANIFIESTO para probar la impresión.');
    } finally {
        conn.release();
        await closePools();
    }
}

main().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
});
