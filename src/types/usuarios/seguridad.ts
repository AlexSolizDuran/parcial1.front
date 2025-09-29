import { Usuario } from "./usuarios";

interface Seguridad{
    id?:number,
    turno: string,
    usuario?: Usuario,
    usuario_detail?: Usuario,
}
interface SeguridadGet{
    id : number,
    turno:string,
    usuario_detail:Usuario
}
export type {Seguridad , SeguridadGet}