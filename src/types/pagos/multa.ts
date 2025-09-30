import { Usuario } from "../usuarios/usuarios";

interface MultaGet {
    id: string,
    descripcion: string,
    estado : boolean,
    monto: string,
    tipo_detail: TipoMultaGet,
    usuario_detail:Usuario,
}   

interface MultaSet{
    descripcion : string,
    estado :string,
    monto:string,
    usuario : string,
    tipo : string,
}

interface TipoMultaGet{
    id : string,
    nombre: string,
    descripcion : string
}

interface TipoMultaSet{
    nombre : string,
    descripcion : string
}

export type{MultaGet,MultaSet,TipoMultaGet,TipoMultaSet}