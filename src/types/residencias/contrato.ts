import { Inquilino } from "../usuarios/inquilino";
import { ViviendaGet } from "./vivienda";

interface ContratoGet{
    id:string,
    descripcion:string,
    fecha_ingreso:string,
    fecha_salida:string,
    porcentaje_expensa:string,
    tipo_renta: string,
    vivienda_detail : ViviendaGet,
    inquilino_detail : Inquilino
}
interface ContratoSet{
    descripcion:string,
    inquilino:string,
    fecha_ingreso : string,
    fecha_salida:string,
    porcentaje_expensa:string,
    tipo_renta:string,
    vivienda:string,
}

export type {ContratoGet,ContratoSet}