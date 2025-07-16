class Usuario{
    constructor(nombre,contraseña,correo_electronico){
        this.nombre = nombre 
        this.contraseña = contraseña 
        this.correo_electronico = correo_electronico
        this.es_admin = 0 
        this.esta_logeado = false
        this.puntaje = 0
        this.max_puntaje = 0
    }
}