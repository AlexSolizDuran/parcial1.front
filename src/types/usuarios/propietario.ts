import { Usuario } from "./usuarios"
interface Propietario {
    id?: number,
    usuario?: Usuario,
    usuario_detail?: Usuario,
    estado?: boolean,
    fecha_compra: string,
    Qrpago?: string,
}

export type { Propietario }