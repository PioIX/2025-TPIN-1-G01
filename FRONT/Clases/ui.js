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
}

const ui = new Ui();