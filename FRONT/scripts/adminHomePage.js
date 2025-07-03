const btns = document.querySelectorAll(".correct-btn")
const areaPregunta = document.getElementById("area-pregunta")
const btnCloseSession = document.getElementsByClassName("btn-cerrar")
const selector = document.getElementsByClassName("select-categoria")
const contenedores = document.getElementsByClassName("contenedor-pregunta")
const input = document.getElementById('imgInput');
const selectPreguntas = document.getElementById("select-preguntas")
const display = document.getElementById("display-pregunta")
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
    llenarSelectPreguntas()
})
async function llenarSelectCat() {
    let categorias = await traerCategorias()
    console.log(categorias[0])
    for(let i = 0;i<categorias.length;i++){
        selector[0].innerHTML += `<option value=${categorias[i].id}>${categorias[i].nombre_categoria}</option>`
        selector[1].innerHTML += `<option value=${categorias[i].id}>${categorias[i].nombre_categoria}</option>`
    }

}
async function llenarSelectPreguntas() {
    let preguntas = await recuperarPreguntasCategoria(selector[1].value)
    selectPreguntas.innerHTML = null
    selectPreguntas.innerHTML = `<option value="undefined">seleccionar una</option>`
    for(let i = 0;i<preguntas.length;i++){
        selectPreguntas.innerHTML += `<option value=${preguntas[i].id}>${preguntas[i].contenido}</option>`
    }
}

selectPreguntas.addEventListener("change",()=>{
    for(let x=0;x<selectPreguntas.options.length;x++){
        console.log(selectPreguntas.options[x])
        console.log(selectPreguntas.value)
        if(selectPreguntas.options[x].value===selectPreguntas.value){
            if(selectPreguntas.options[x].value!=="undefined"){
                display.innerText = selectPreguntas.options[x].innerText
            } else {
                display.innerText = null
            }
        }
    }
})

btns.forEach(btn => {
    btn.addEventListener("click",()=>{
        (btn.innerText === "cruz") ? btn.innerText="tick" : btn.innerText="cruz"
    })
});

async function CrearPregunta() {
    let id_pregunta;
    let algunaSeleccionada = false
    const ultimaPregunta = await recuperarUltimaPregunta();
    if (!ultimaPregunta || ultimaPregunta.id === undefined) {
        id_pregunta = 1;
    } else {
        id_pregunta = ultimaPregunta.id + 1;
    }

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
        return;};

    const Options = [
        new Opcion(contenedores[0].firstElementChild.value, id_pregunta, contenedores[0].lastElementChild.checked),
        new Opcion(contenedores[1].firstElementChild.value, id_pregunta, contenedores[1].lastElementChild.checked),
        new Opcion(contenedores[2].firstElementChild.value, id_pregunta, contenedores[2].lastElementChild.checked),
        new Opcion(contenedores[3].firstElementChild.value, id_pregunta, contenedores[3].lastElementChild.checked),
    ];

    const id_categoria = selector[0].value;
    const contenido = areaPregunta.value;

    const Question = new Pregunta(id_pregunta, id_categoria, contenido, img);

    console.log("Llamando mandarPregunta");
    await mandarPregunta(Question);
    for(let x of Options){
        await mandarOpciones(x)
    }
}

function borrarPregunta(){
    const datos = {
        id: selectPreguntas.value
    }
    if(datos.id!=="undefined"){
        deleteQuestion(datos)
    }
}

async function modificarJugadores() {
    const jugadores = await traerJugadores()
    selectJugadores.innerHTML = ""
    selectJugadores.innerHTML +=  `<option value="undefined">selecciona un jugador</option>`
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
        inputScore.value = ""})
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