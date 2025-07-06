const btns = document.querySelectorAll(".correct-btn")
const areaPregunta = document.getElementById("area-pregunta")
const btnCloseSession = document.getElementById("cerrar")
const selector = document.getElementById("select-categoria")
const contenedores = document.getElementsByClassName("contenedor-pregunta")
const input = document.getElementById('imgInput');
let base64Imagen = null;
llenarSelect()

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

btnCloseSession.addEventListener("click",()=>{
    ui.cerrarSesion()
})
async function llenarSelect() {
    let categorias = await traerCategorias()
    console.log(categorias[0])
    for(let i = 0;i<categorias.length;i++){
        selector.innerHTML += `<option value=${categorias[i].id}>${categorias[i].nombre_categoria}</option>`
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

    const id_categoria = selector.value;
    const contenido = areaPregunta.value;

    const Question = new Pregunta(id_pregunta, id_categoria, contenido, img);

    console.log("Llamando mandarPregunta");
    await mandarPregunta(Question);
    for(let x of Options){
        await mandarOpciones(x)
    }
}


