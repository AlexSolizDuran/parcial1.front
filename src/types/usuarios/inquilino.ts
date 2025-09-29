import { Usuario } from "./usuarios";

interface Inquilino {
    id? : number,
    usuario_detail? : Usuario,   
    usuario? : Usuario
}
export type {Inquilino}