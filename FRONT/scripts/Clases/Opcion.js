class Opcion{
    /**
     * 
     * @param {*} id 
     * @param {*} opcion 
     * @param {*} id_pregunta 
     * @param {*} isRta 
     */
    constructor(id,opcion,id_pregunta,isRta){
        this.id = id
        this.opcion = opcion;
        this.isRta = isRta;
        this.id_pregunta = id_pregunta;
    }
}