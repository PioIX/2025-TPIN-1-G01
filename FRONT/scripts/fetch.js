async function traerCategorias() {
    const response = await fetch(`http://localhost:4000/traerCategorias`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    console.log(response)
    let result = await response.json()
    console.log(result)
    return result
}

async function verificarUsuario(usuario) {
    const response = await fetch(`http://localhost:4000/verificarUsuario?correo_electronico=${usuario.email}&contraseña=${usuario.password}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    console.log(response)
    let result = await response.json()
    InOut(result)
    ui.DoLogin(result)
    return result
}
//preguntar porque se hacen dos request
async function usuarioLog() {
    const response = await fetch(`http://localhost:4000/usuarioLogeado`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    console.log(response)
    let result = await response.json()
    return result
}
async function buscarUsuarioXNombre(nombre) {
    const response = await fetch(`http://localhost:4000/buscarUsuarioXNombre?nombre=${nombre}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })

    const result = await response.json()
    return result
}
async function InOut(datos) {
    console.log(datos)
    const response = await fetch(`http://localhost:4000/InOut`,{
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos)
    })
    console.log(response)
    let result = await response.json()
    console.log(result)
    usuario = await usuarioLog() 

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

    const result = await response.json();
    console.log(result)

    if (result.mensaje === "ok") {
        const u = await buscarUsuarioXNombre(usuario.nombre)
        await InOut(u)
        ui.DoLogin(u)
    } else {
        errorHandler(result.mensaje)
    }
}



