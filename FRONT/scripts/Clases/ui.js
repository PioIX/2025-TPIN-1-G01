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
    
}

const ui = new Ui();