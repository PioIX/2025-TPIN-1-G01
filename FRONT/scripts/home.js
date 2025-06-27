const btnTabla = document.getElementById("btn-table")
const btnJugar = document.getElementById("btn-jugar")
const texto = document.getElementById("texto")
async function iniciarPagina() {
    let usuario = await usuarioLog()
    texto.innerText = usuario.nombre
    btnTabla.addEventListener("click", () => {
        ui.changeScreen("tabla")
    })
    btnJugar.addEventListener("click", () => {
        ui.changeScreen("ruleta")
    })
}
async function cerrarSesion(){
    let usuario = await usuarioLog()
    InOut(usuario)
    ui.changeScreen("index")
}
iniciarPagina()
