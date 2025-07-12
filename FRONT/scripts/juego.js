const contenedorPregunta = document.getElementById("contenedor-preguntas");
const contenedorRespuesta = document.getElementById("contenedor-respuesta");
const imgMostrar = document.getElementById("img-mostrar");

function GetId() {
    const queryString = window.location.search;
    const param = new URLSearchParams(queryString);
    return parseInt(param.get('id'));
}

function generarNumeroAleatorio(longitud) {
    return Math.floor(Math.random() * longitud);
}

function detectarTipoMimeDesdeBase64(base64) {
    if (typeof base64 !== 'string') return null;

    const primerosCaracteres = base64.slice(0, 15);

    if (base64.startsWith("data:image/")) {
        return base64.split(";")[0].split(":")[1]; // Ej: "image/jpeg"
    }

    // Detecto que es
    if (primerosCaracteres.startsWith("/9j/")) return "image/jpeg"; // JPEG
    if (primerosCaracteres.startsWith("iVBOR")) return "image/png"; // PNG

    return null;
}

async function pregunta() {
    const preguntas = await recuperarPreguntasCat(GetId());
    const longitud = preguntas.length;
    const indice = generarNumeroAleatorio(longitud);

    const preguntaActual = preguntas[indice];
    console.log(preguntaActual)
    contenedorPregunta.firstElementChild.innerText = preguntaActual.contenido;
    const respuestas = await recuperarOpcionesPreguntas(preguntaActual.id)
    const imagen = preguntaActual.imagen;
    let imagenBase64;

    const tipoMime = detectarTipoMimeDesdeBase64(imagen);

    if (tipoMime) {
        if (imagen.startsWith("data:image/")) {
            imagenBase64 = imagen;
        } else {
            imagenBase64 = `data:${tipoMime};base64,${imagen}`;
        }

        imgMostrar.src = imagenBase64;
    } else {
        console.warn("Tipo de imagen desconocido o no válido.");
        imgMostrar.src = "";
    }
    // console.log(respuestas)
    return indice;
}

pregunta();
