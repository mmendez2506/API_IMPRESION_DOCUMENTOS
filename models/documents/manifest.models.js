// Fila que devuelve QA_sp_ImpresionManifiesto (opciones 1 y 2): una por pieza.
export class ManifestRowModel {
    constructor(row = {}) {
        // Detalle de la pieza
        this.numdig = row.numdig ?? '';             // servicio (SE si la guía empieza con 110)
        this.des_numdig = row.des_numdig ?? '';     // descripción del servicio (ERROR si numdig = ER)
        this.numgui = row.numgui ?? '';             // guía
        this.codigo = row.codigo ?? '';             // código de cobro
        this.remitente = row.remitente ?? '';
        this.destinatario = row.destinatario ?? '';
        this.codest = row.codest ?? '';
        this.des_tipmov = row.des_tipmov ?? '';     // status

        // Encabezado del manifiesto (se repite en cada fila)
        this.numman = row.numman ?? '';
        this.codrut = row.codrut ?? '';
        this.nomrut = row.nomrut ?? '';
        this.tipman = row.tipman ?? '';
        this.fechamanifiesto = row.fechamanifiesto ?? '';
        this.codcam = row.codcam ?? '';
        this.IDRUTAASIGNACION = row.IDRUTAASIGNACION ?? null;
        this.bodeguero = row.bodeguero ?? '';
        this.codbod = row.codbod ?? '';
        this.desbod = row.desbod ?? '';
        this.piloto = row.piloto ?? '';
        this.auxiliar = row.auxiliar ?? '';
        this.direccion = row.direccion ?? '';
    }
}
