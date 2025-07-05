class Opcion{
    /**
     * 
     * @param {string} opcion 
     * @param {number} id_pregunta 
     * @param {boolean} isRta 
     */
    constructor(opcion,id_pregunta,isRta){
        this.opcion = opcion;
        this.isRta = isRta;
        this.id_pregunta = id_pregunta;
    }
}