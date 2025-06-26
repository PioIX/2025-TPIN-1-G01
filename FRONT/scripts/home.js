const btnTabla = document.getElementById("btn-table")
const btnJugar = document.getElementById("btn-jugar")
const btnCs = document.getElementById("Cls-btn")
const texto = document.getElementById("texto")
async function iniciarPagina() {
    const usuario = await usuarioLog()

    texto.innerText = usuario.nombre
    
    btnCs.addEventListener("click", () => {
        InOut(usuario)
        ui.changeScreen("index")
    })
    btnTabla.addEventListener("click", () => {
        ui.changeScreen("tabla")
    })
    btnJugar.addEventListener("click", () => {
        ui.changeScreen("ruleta")
    })
    
}

iniciarPagina()