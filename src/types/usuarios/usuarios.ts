interface Persona {
    id?: number,
    nombre?: string,
    apellido?: string,
    ci?: string,
    telefono?: string,
    foto?: string,
    fecha_nacimiento?: string,
    genero?: string,
    direccion?: string,

}
interface Usuario {
    id?: number,
    username: string,
    password?:string,
    email: string,
    persona: Persona
}

export type { Usuario, Persona}