const btnTabla = document.getElementById("btn-table")
const btnJugar = document.getElementById("btn-jugar")
const btnCerrar = document.getElementById("cerrar-sesion")
const texto = document.getElementById("texto")
iniciarPagina()
async function iniciarPagina() {
    let usuario = await usuarioLog()
    // texto.innerText = usuario.nombre
    console.log(usuario,btnCerrar)
}

btnTabla.addEventListener("click", () => {
    ui.changeScreen("tabla")
})
btnJugar.addEventListener("click", () => {
    ui.changeScreen("ruleta")
})
btnCerrar.addEventListener("click",()=>{
    ui.cerrarSesion()
})


