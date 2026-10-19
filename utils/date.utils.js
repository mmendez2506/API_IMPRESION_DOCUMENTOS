// Fecha y hora de impresión con el formato del reporte: d/M/yyyy y HH:mm:ss
export function printTimestamp(date = new Date(), timeZone = process.env.PRINT_TIMEZONE || 'America/Guatemala') {
    const parts = Object.fromEntries(
        new Intl.DateTimeFormat('es-GT', {
            timeZone,
            day: 'numeric', month: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hourCycle: 'h23'
        }).formatToParts(date).map(part => [part.type, part.value])
    );

    return {
        date: `${parts.day}/${parts.month}/${parts.year}`,
        time: `${parts.hour}:${parts.minute}:${parts.second}`
    };
}
