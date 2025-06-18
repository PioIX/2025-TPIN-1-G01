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
    formLogin.style.display = "flex"

})


btnCloseModal.addEventListener("click",()=>{
    ui.closeLoginModal()
})

BtnSignUp.addEventListener("click",()=>{
    ui.showSignInModal()
    formRegister.style.display = "flex"
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
    const usuario = {
        correo_electronico: ui.getMailSignIn(),
        contraseña: ui.getPasswordSignIn(),
        nombre: ui.getNameSignIn(),
        es_admin: 0
    }
    console.log(usuario.email)
    registrarUsuario(usuario)
    formRegister.reset()
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

async function registrarUsuario(usuario) {
  const response = await fetch("http://localhost:4000/registrarUsuario", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  });

  console.log(response);
  let result = await response.json();
  console.log(result)
  if (result.mensaje == "ok") {
      ui.DoLogin(usuario); 
    
  } else {
   alert("Algo salio mal") 
  }
}