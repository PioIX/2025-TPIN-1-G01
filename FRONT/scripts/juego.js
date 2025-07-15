const contenedorPregunta = document.getElementById("contenedor-preguntas");
const contenedorRespuesta = document.getElementById("contenedor-respuestas");
const imgMostrar = document.getElementById("img-mostrar");
const timer = document.getElementById("timer");
let puntaje;
function GetId() {
    const queryString = window.location.search;
    const param = new URLSearchParams(queryString);
    return parseInt(param.get('id'));
}
function getPuntaje() {
    const queryString = window.location.search;
    const param = new URLSearchParams(queryString);
    puntaje = parseInt(param.get('puntaje')) +1
    return puntaje;
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

function crearBtns(){
    contenedorRespuesta.innerHTML = 
        `<div>
            <button>Cerrar</button>
            <button>Continuar</button>
        </div>`
    const div = contenedorRespuesta.firstElementChild
    div.firstElementChild.addEventListener("click",()=>{
        ui.changeScreen("home")
    })
    div.lastElementChild.addEventListener("click",()=>{
        console.log(puntaje)
        location.href = `ruleta.html?puntaje=${puntaje}`;
    })
}
function mostrarBtns(){
    return setTimeout(crearBtns, 3000)
}
async function pregunta() {
    let maxPuntaje
    let miniTimer;
    const acierto = new Audio("Audios/unPuntito.m4a")
    const equivocado = new Audio("Audios/muyMal.m4a")
    let correctas
    let tiempo = 30
    let imagenBase64;
    let Respondio;
    let indiceRespuesta;
    maxPuntaje = await traerRecordPuntaje()
    const preguntas = await recuperarPreguntasCat(GetId());
    const longitud = preguntas.length;
    const indice = generarNumeroAleatorio(longitud);
    const preguntaActual = preguntas[indice];
    const imagen = await traerImg(preguntaActual)
    contenedorPregunta.firstElementChild.innerText = preguntaActual.contenido;
    timer.innerText = tiempo
    const opciones = await recuperarOpcionesPreguntas(preguntaActual.id)

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

    const temporizador = setInterval(() => {
        tiempo-- 
        timer.innerText = tiempo
    }, 1000);
    for(let x=0;x<opciones.length;x++){
        contenedorRespuesta.innerHTML += `<div>${opciones[x].opcion}<div>`
    }
    const respuestas = contenedorRespuesta.children
        for(let x=0;x<respuestas.length;x++){
            respuestas[x].addEventListener("click",(e)=>{
                if (Respondio) return;
                
                const anser = e.target 
                for(let i=0;i<respuestas.length;i++){
                    if(anser.innerText == respuestas[i].innerText){
                        indiceRespuesta = i
                    }
                }
                if(opciones[indiceRespuesta].is_rta==1){
                    acierto.play()
                    puntaje+=1
                    Respondio = true
                    clearInterval(temporizador)
                    clearTimeout(defaultTimer)
                    respuestas[indiceRespuesta].style.backgroundColor = "green"
                    miniTimer = mostrarBtns()
                } else {
                    equivocado.play()
                    clearInterval(temporizador)
                    clearTimeout(defaultTimer)
                    Respondio = true
                    respuestas[indiceRespuesta].style.backgroundColor = "red"
                    for(let z = 0; z<opciones.length;z++){
                        if(opciones[z].is_rta == 1){
                            respuestas[z].style.backgroundColor = "green"
                        }
                    }           
                    miniTimer = mostrarBtns()
                }
            })
        }
        clearTimeout(miniTimer)
    const defaultTimer = setTimeout(() => {
        clearInterval(temporizador)
        for(let i=0;i<opciones.length;i++){
            if(opciones[i].is_rta=1){
                indiceRespuesta = i
            } else {
                console.error("error, no hay una respuesta correcta")
            }
        }
        respuestas[indiceRespuesta].style.backgroundColor = "green"
        mostrarBtns()

    }, 30000);
}

async function sumarPuntaje() {
    
}
pregunta();
