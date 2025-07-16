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
    let result = await response.json()
    console.log(result)
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

async function actualizarPuntajes(datos) {
    console.log(datos)
    const response = await fetch(`http://localhost:4000/actualizarPuntajes`,{
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos)
    })
    console.log(response)
    let result = await response.json()
    console.log(result)
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

async function recuperarUltimaPregunta() {
    const response = await fetch("http://localhost:4000/traerUltimaPregunta",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    const result = await response.json()
    console.log(result)
    return result
}
async function recuperarUltimaOpcion() {
    const response = await fetch("http://localhost:4000/traerUltimaOpcion", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    const result = await response.json();
    console.log(result);
    return result;
}

async function recuperarPreguntasCategoria(id_categoria) {
    const response = await fetch(`http://localhost:4000/buscarPreguntaCategoria?id_categoria=${id_categoria}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    const result = await response.json();
    console.log(result);
    return result;
}

async function mandarPregunta(pregunta) {
    console.log(pregunta)
    const response = await fetch("http://localhost:4000/crearPregunta", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(pregunta),
    });

    const result = await response.json();
    console.log(result)
}

async function mandarOpciones(opcion) {
    const response = await fetch("http://localhost:4000/crearOpciones", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(opcion),
    });

    const result = await response.json();
    console.log(result)
}

async function RecuperarColoresCategoria() {
    const response = await fetch("http://localhost:4000/coloresCategoria",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    const result = await response.json()
    // console.log(result)
    return result
}

async function recuperarPreguntasCat(id) {
    const response = await fetch(`http://localhost:4000/traerPreguntasCategoria?id=${id}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    const result = await response.json()
    console.log(result)
    return result
}
async function recuperarOpcionesPreguntas(preguntaActual) {
    console.log(preguntaActual)
    const response = await fetch(`http://localhost:4000/traerOpciones?id_pregunta=${preguntaActual}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    const result = await response.json()
    console.log(result)
    return result
}
async function traerImg(preguntaActual) {
    console.log(preguntaActual.id)
    const response = await fetch(`http://localhost:4000/traerImg?id=${preguntaActual.id}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    const result = await response.json()
    return result[0].imagen
}
async function TraerJugadoresPuntajes() {
    const response = await fetch("http://localhost:4000/TraerJugadoresPuntajes",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    const result = await response.json()
    console.log(result)
    return result
}
/*-------------------------------------------------------------------*/
async function traerRecordPuntaje() {
     const response = await fetch("http://localhost:4000/traerRecord",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    const result = await response.json()
    console.log(result)
    return result
}

async function modificarPuntajeActual(puntaje) {
    console.log(puntaje)
    const response = await fetch("http://localhost:4000/modificarPuntajeActual", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(puntaje),
    });

    const result = await response.json();
    console.log(result)
}

async function deleteQuestion(id) {
    const response = await fetch("http://localhost:4000/borrarPregunta", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
    });
    const result = await response.json();
    console.log(result);
}

async function deletePlayer(id) {
    const response = await fetch("http://localhost:4000/eliminarJugadorXid", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
    });
    const result = await response.json();
    console.log(result);
}

async function updateHighScore(data) {
    const response = await fetch("http://localhost:4000/actualizarPuntaje", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(puntaje),
    });

    const result = await response.json();
    console.log(result)
}
async function modificarRecord(record) {
    console.log(record)
    const response = await fetch("http://localhost:4000/modificarRecord", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
    });

    const result = await response.json();
    console.log(result)
}
async function reiniciarPuntaje() {
    const response = await fetch("http://localhost:4000/reiniciarPuntaje", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const result = await response.json();
    console.log(result)
}

async function traerPregunta(id) {
    const response = await fetch(`http://localhost:4000/traerPregunta?id=${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    return result;
} 

async function traerOpcion(id_pregunta) {
    const response = await fetch(`http://localhost:4000/traerOpcion?id_pregunta=${id_pregunta}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    return result;
}

async function traerImagen(id_pregunta) {
    const response = await fetch(`http://localhost:4000/traerImg?id=${id_pregunta}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    return result;
}

async function actualizarPregunta(datos) {
    const response = await fetch("http://localhost:4000/actualizarPregunta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
    });
    const result = await response.json();
    console.log(result);
}

async function actualizarOpcion(datos) {
    const response = await fetch("http://localhost:4000/actualizarOpcion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
    });
    const result = await response.json();
    console.log(result);
}

