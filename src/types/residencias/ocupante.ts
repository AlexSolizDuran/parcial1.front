import { Persona } from "../usuarios/usuarios";

interface OcupanteGet{
    id : string,
    persona : Persona,
    estado: boolean,
    contrato: string,
}
export type {OcupanteGet}