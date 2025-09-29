interface ViviendaGet {
    id : string,
    condominio : string,
    nro_vivienda : string,
    precio_alquiler : string,
    precio_anticretico : string,
    superficie : string,
    estado : boolean,
    foto? : string
}

interface ViviendaSet {
    nro_vivienda:string,
    precio_alquiler :string,
    precio_anticretico: string,
    superficie:string,
    
    foto? : string,
}

export type {ViviendaGet,ViviendaSet}