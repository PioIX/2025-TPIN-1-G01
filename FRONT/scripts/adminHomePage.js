const btns = document.querySelectorAll(".correct-btn")
const areaPregunta = document.getElementById("area-pregunta")
const btnCloseSession = document.getElementsByClassName("btn-cerrar")
const selector = document.getElementsByClassName("select-categoria")
// const selector = document.getElementById("select-categoria")
// const selectEditarCategoria = document.getElementById("editar-select-categoria")
// const selectPregunta = document.getElementById("editar-select-pregunta")
const contenedores = document.getElementsByClassName("contenedor-pregunta")
const input = document.getElementById('imgInput');
const selectorPreguntas = document.getElementsByClassName("select-pregunta")
const selectPregunta = document.getElementById("select-preguntas")
const display = document.getElementsByClassName("cargar-display")
const selectJugadores = document.getElementById("select-jugadores")
const inputScore = document.getElementById("new-score")
const divAgregarPregunta = document.getElementById("agregar-pregunta") 
const divModificarPregunta = document.getElementById("modificar-pregunta") 
const divBorrarPregunta= document.getElementById("delete-pregunta") 
const divAreaJugador= document.getElementById("area-usuario") 
let base64Imagen = null;
llenarSelectCat()
modificarJugadores()
input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) {
        base64Imagen = null; 
        return;
    }
    const reader = new FileReader();
    reader.onload = function(event) {
        base64Imagen = event.target.result; 
    };
    reader.readAsDataURL(file);
});

selector[1].addEventListener("change",()=>{
    llenarSelectPreguntas(0)
})
selector[2].addEventListener("change",()=>{
    llenarSelectPreguntas(1)
})
async function llenarSelectCat() {
    let categorias = await traerCategorias()
    console.log(categorias[0])
    for(let i = 0;i<categorias.length;i++){
        selector[0].innerHTML += `<option value=${categorias[i].id}>${categorias[i].nombre_categoria}</option>`
        selector[1].innerHTML += `<option value=${categorias[i].id}>${categorias[i].nombre_categoria}</option>`
        selector[2].innerHTML += `<option value=${categorias[i].id}>${categorias[i].nombre_categoria}</option>`
    }
}

async function llenarSelectPreguntas(indice) {
    console.log("pepe")
    let preguntas = await recuperarPreguntasCategoria(selector[indice+1].value)
    selectorPreguntas[indice].innerHTML = null
    selectorPreguntas[indice].innerHTML = `<option value="undefined" selected disabled hidden>seleccione una pregunta</option>`
    selectorPreguntas[indice].options[0].selected=1
    for(let i = 0;i<preguntas.length;i++){
        selectorPreguntas[indice].innerHTML += `<option value=${preguntas[i].id}>${preguntas[i].contenido}</option>`
    }
}

selectorPreguntas[0].addEventListener("change",()=>{
   mostrarTexto(0)
})

selectorPreguntas[1].addEventListener("change",()=>{
   mostrarTexto(1)
})

function mostrarTexto(y){
    for(let x=0;x<selectorPreguntas[y].options.length;x++){
        if(selectorPreguntas[y].options[x].value===selectorPreguntas[y].value){
            if(selectorPreguntas[y].options[x].value!=="undefined"){
                display[y].innerText = selectorPreguntas[y].options[x].innerText
            } else {
                display[y].innerText = null
            }
        }
    }
}

btns.forEach(btn => {
    btn.addEventListener("click",()=>{
        (btn.innerText === "cruz") ? btn.innerText="tick" : btn.innerText="cruz"
    })
});

async function CrearPregunta() {
    let id_pregunta;
    let algunaSeleccionada = false
    let img = (base64Imagen === null) ? null : base64Imagen;
    if (areaPregunta.value === "") {
        console.log("te falta la pregunta crack");
        return;
    }
    for (let x = 0; x < contenedores.length; x++) {
        if (contenedores[x].firstElementChild.value == "") {
            console.log("te falta completar una opción");
            return;
        }
        if (contenedores[x].lastElementChild.checked) {
            algunaSeleccionada = true
        }
    }
    if(!algunaSeleccionada) {
        console.log("te falta una respuesta correcta");
        return;
    };
    console.log("creando pregunta")

    const id_categoria = selector[0].value;
    const contenido = areaPregunta.value;
    const Question = new Pregunta(id_pregunta, id_categoria, contenido, img);
    console.log("Llamando mandarPregunta");
    await mandarPregunta(Question);

    const ultimaPregunta = await recuperarUltimaPregunta();
    if (!ultimaPregunta || ultimaPregunta.id === undefined) {
        id_pregunta = 1;
    } else {
        id_pregunta = ultimaPregunta.id
    }
    const Options = [
        new Opcion(contenedores[0].firstElementChild.value, id_pregunta, contenedores[0].lastElementChild.checked),
        new Opcion(contenedores[1].firstElementChild.value, id_pregunta, contenedores[1].lastElementChild.checked),
        new Opcion(contenedores[2].firstElementChild.value, id_pregunta, contenedores[2].lastElementChild.checked),
        new Opcion(contenedores[3].firstElementChild.value, id_pregunta, contenedores[3].lastElementChild.checked),
    ];

    for(let x of Options){
        await mandarOpciones(x)
    }
}

function borrarPregunta(){
    const datos = {
        id: selectorPreguntas[1].value
    }
    if(datos.id!=="undefined"){
        deleteQuestion(datos)
    }
}

async function modificarJugadores() {
    const jugadores = await traerJugadores()
    selectJugadores.innerHTML = ""
    selectJugadores.innerHTML +=  `<option value="placeholder" selected disabled hidden>seleccione un jugador</option>
`
    for(let x=0;x<jugadores.length;x++){
        selectJugadores.innerHTML += `<option value=${jugadores[x].id}>${jugadores[x].nombre} - puntaje maximo: ${jugadores[x].max_puntaje}</option>`
    }
    console.log("fin ejecucion")
}

function eliminarJugador(){
    data = {
        id:selectJugadores.value
    }
    if(data.id!="undefined"){
        deletePlayer(data).then(()=>modificarJugadores())
    } else {
        console.log("seleccionar jugador")
    }
    
}
inputScore.addEventListener("keydown", (e) => {
    if (e.key === "-" || e.key === "e" || e.key === "+") {
        e.preventDefault();
    }
});

function modificarPuntaje(act){
    let indice = selectJugadores.options.selectedIndex
    data = {
        action: act,
        id: parseInt(selectJugadores.options[indice].value),
        new_highScore: parseInt(inputScore.value)
    }
    console.log(data)
    updateHigScore(data).then(()=>{
        modificarJugadores()
        inputScore.value = ""
    })
}

function mostrarDiv(seccion){
    switch (seccion) {
        case 1:
            divAgregarPregunta.style.display = "block"
            divModificarPregunta.style.display = "none"
            divBorrarPregunta.style.display = "none"
            divAreaJugador.style.display = "none"
            break;
        case 2:
            divAgregarPregunta.style.display = "none"
            divModificarPregunta.style.display = "block"
            divBorrarPregunta.style.display = "none"
            divAreaJugador.style.display = "none"
            break;
        case 3:
            divAgregarPregunta.style.display = "none"
            divModificarPregunta.style.display = "none"
            divBorrarPregunta.style.display = "block"
            divAreaJugador.style.display = "none"
            break;
        case 4:
            divAgregarPregunta.style.display = "none"
            divModificarPregunta.style.display = "none"
            divBorrarPregunta.style.display = "none"
            divAreaJugador.style.display = "block"
            break;
        default:
            break;
    }
}
// divAgregarPregunta
// divModificarPregunta
// divBorrarPregunta
// divAreaJugador

//editar pregunta
selectorPreguntas[0].addEventListener("change", () => {
    PreguntaAEditar()
})


async function PreguntaAEditar() {
    const id_pregunta = selectorPreguntas[0].value
    const pregunta = await traerPregunta(id_pregunta)
    display.innerText = pregunta.contenido
    let i=0;
    let opcion = await traerOpcion(pregunta.id)
    while(i < contenedores.length){
        contenedores[x].firstElementChild.value = opcion[i]
        if(opcion[i].isRta){
            contenedores[i].lastElementChild.checked = true
        }
    }

}