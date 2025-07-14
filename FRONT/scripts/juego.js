const contenedorPregunta = document.getElementById("contenedor-preguntas");
const contenedorRespuesta = document.getElementById("contenedor-respuestas");
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
    const imagen = await traerImg(preguntaActual)
    console.log(imagen)
    console.log(preguntaActual)
    contenedorPregunta.firstElementChild.innerText = preguntaActual.contenido;
    const opciones = await recuperarOpcionesPreguntas(preguntaActual.id)
    let imagenBase64;

    const tipoMime = detectarTipoMimeDesdeBase64(imagen);
    console.log(tipoMime)
    if (tipoMime) {
        if (imagen.startsWith("data:image/")) {
            imagenBase64 = imagen;
        } else {
            imagenBase64 = `data:${tipoMime};base64,${imagen}`;
        }
        if(imagenBase64){ 
            imgMostrar.src = imagenBase64;
        } else {
            console.log("entro")
          
        }
    } else {
        console.warn("Tipo de imagen desconocido o no válido.");
        contenedorPregunta.removeChild(imgMostrar)
    }
    // console.log(respuestas)
    console.log(contenedorRespuesta)
    for(let x=0;x<opciones.length;x++){
        contenedorRespuesta.innerHTML += `<div es-correcta=${opciones[x].is_rta}>${opciones[x].opcion}<div>`
    }
    const respuestas = contenedorRespuesta.children
    for(let x=0;x<respuestas.length;x++){
        respuestas[x].addEventListener("click",()=>{
            if(respuestas[x].getAttribute("es-correcta")=="1")
                console.log("bien")
            else{
                console.log("mal")
            }
        })
    }
    return indice;
}

pregunta();
