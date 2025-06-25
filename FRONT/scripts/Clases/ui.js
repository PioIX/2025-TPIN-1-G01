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
                localStorage.setItem("usuario",JSON.stringify(usuario))
                location.href = "home.html"
                break;
            case 1:
                localStorage.setItem("usuario",JSON.stringify(usuario)) 
                location.href = "adminPage.html"
                break;
            default:
                break;
        }
    }
    changeScreen(page){
        switch (page) {
            case "tabla":
                location.href = `${page}.html`
                break;
            case "adminPage":
                location.href = `${page}.html`
                break;
            case "ruleta":
                location.href = `${page}.html`
                break;
            case "juego":
                location.href = `${page}.html`
                break;
            case "home":
                location.href = `${page}.html`
                break;
            case "index":
                location.href = `${page}.html`
                break;
            default:
                break;
        }
    }
    recuperarUsuario(){
        const usuario = JSON.parse(localStorage.getItem("usuario"))
        return usuario
    }
}

const ui = new Ui();