class Usuario{
    constructor(nombre,contraseña,correo_electronico){
        this.nombre = nombre 
        this.contraseña = contraseña 
        this.correo_electronico = correo_electronico
        this.es_admin = 0 //1 si es admin 0 sino pero en sql y para mandarlo hay que formatearlo
    }
}