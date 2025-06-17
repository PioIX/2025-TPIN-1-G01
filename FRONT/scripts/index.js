const btnLogin = document.getElementById("btn-inicio")
const modalLogin = document.getElementById("modal-login")
const btnCloseModal = document.getElementById("btn-dms-login")  
const BtnSignUp= document.getElementById("btn-crear-cuenta") 
const modalSignIn= document.getElementById("modal-register")
const btnCloseSignIn = document.getElementById("btn-dms-register")
const formLogin = document.getElementById("form-login")
const formRegister = document.querySelector("form-register")
const btnRanking = document.getElementById("btn-ranking")

btnLogin.addEventListener("click",()=>{
    ui.showLoginModal()
})

btnCloseModal.addEventListener("click",()=>{
    ui.closeLoginModal()
})

BtnSignUp.addEventListener("click",()=>{
    ui.showSignInModal()
}) 

btnCloseSignIn.addEventListener("click",()=>{
    ui.closeSignInModal()
})

formLogin.addEventListener("submit",(e)=>{
    e.preventDefault()
    modalLogin.close()
    const usuario = {
        email: ui.getMailLogin(),
        password: ui.getPasswordLogin()
    }
    console.log(usuario)
    verificarUsuario(usuario)
    formLogin.reset()
})

async function verificarUsuario(usuario) {
    const response = await fetch(`http://localhost:4000/verificarUsuario?correo_electronico=${usuario.email}&contraseña=${usuario.password}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    console.log(response)
    let result = await response.json()
    console.log(result)
    ui.DoLogin(result)
    return result
}
