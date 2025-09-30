interface ExpensaSet{
    estado : string,
    fecha_vencimiento : string,
    monto : string,
    tipo_expensa : string,
}

interface ExpensaGet{
    id : string,
    estado : boolean,
    fecha_vencimiento : string,
    monto : string,
    tipo_expensa_detail : TipoExpensaGet,
    
}
interface TipoExpensaGet{
    id : string,
    nombre : string,
    descripcion : string,
}
interface TipoExpensaSet{
    nombre : string,
    descripcion : string,
}

export type {ExpensaGet,ExpensaSet,TipoExpensaGet,TipoExpensaSet}