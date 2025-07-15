class Ui{
    constructor(){}
    getMailLogin(){
        return document.getElementById("input-mail-login").value
    }
    getPasswordLogin(){
        return document.getElementById("input-contraseña-login").value
    }
    getMailSignIn(){
        return document.getElementById("input-mail-register").value
    }
    getPasswordSignIn(){
        return document.getElementById("input-contraseña-register").value
    }
    getNameSignIn(){
        return document.getElementById("input-nombre-register").value
    }
    showLoginModal(){
        modalLogin.showModal()
    }
    closeLoginModal(){
        modalLogin.close()
    }
    showCatModal(){
        modal.showModal()
    }
    closeCatModal(){
        modal.close()
    }
    showSignInModal(){
        modalSignIn.showModal()
    }
    closeSignInModal(){
        modalSignIn.close()
    }
    DoLogin(usuario){
        switch (usuario.es_admin) {
            case 0:
                location.href = "home.html"
                break;
            case 1:
                location.href = "adminPage.html"
                break;
            default:
                break;
        }
    }
    changeScreen(page){
        location.href = `${page}.html`;
    }
    async cerrarSesion(){
        let usuario = await usuarioLog()
        InOut(usuario)
        ui.changeScreen("index")
    }
}

const ui = new Ui();