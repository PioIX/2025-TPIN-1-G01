const btnTabla = document.getElementById("btn-table")
const btnJugar = document.getElementById("btn-jugar")

btnTabla.addEventListener("click",()=>{
    ui.changeScreen("tabla")
})
btnJugar.addEventListener("click",()=>{
    ui.changeScreen("ruleta")
})
