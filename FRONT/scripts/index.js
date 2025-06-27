const btnLogin = document.getElementById("btn-inicio")
const modalLogin = document.getElementById("modal-login")
const btnCloseModal = document.getElementById("btn-dms-login")  
const BtnSignUp= document.getElementById("btn-crear-cuenta") 
const modalSignIn= document.getElementById("modal-register")
const btnCloseSignIn = document.getElementById("btn-dms-register")
const formLogin = document.getElementById("form-login")
const formRegister = document.getElementById("form-register")
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


formRegister.addEventListener("submit",(e)=>{
    e.preventDefault()
    modalSignIn.close()
    const u = new Usuario(ui.getNameSignIn(),ui.getPasswordSignIn(),ui.getMailSignIn())
    console.log(u.email)
    registrarUsuario(u)
    formRegister.reset()
})

function errorHandler(mensaje){
    switch (mensaje){ 
        case "El usuario ya existe":     
            alert("ya hay un mail asociado a esa cuenta")
        break
        case "correo electrónico o contraseña incorrecta":
            alert("correo electrónico o contraseña incorrecta")
        break
        default:
            alert("algo salio mal")
        break
    }
    return mensaje
}
