const btns = document.querySelectorAll(".correct-btn")
const areaPregunta = document.getElementById("area-pregunta")
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

function CrearPregunta(){
    let img = (base64Imagen === null) ? null : base64Imagen;
    // const puntajes = [100, 200, 300, 400, 500];
    // const numeroAleatorio = opciones[Math.floor(Math.random() * opciones.length)];
    if(areaPregunta.value === "" ){
        console.log("te falta la pregunta crack")
    }
    else{
        for(let x = 0; x<contenedores.length;x++){
            if(contenedores[x].firstElementChild.value == "")
            console.log("te falta completar una opcion")
        }
    }
    const id_categoria = selector.value
    const contenido = areaPregunta.value
    const puntaje = 100
    const respuesta = null
    const Question = new Pregunta(id_categoria,puntaje,contenido,img)
    const Options = [
        new Opcion(contenedores[0].firstElementChild.value,contenedores[0].lastElementChild.checked),
        new Opcion(contenedores[1].firstElementChild.value,contenedores[1].lastElementChild.checked),
        new Opcion(contenedores[2].firstElementChild.value,contenedores[2].lastElementChild.checked),
        new Opcion(contenedores[3].firstElementChild.value,contenedores[3].lastElementChild.checked),
    ]
    mandarPregunta(Question,Options)
}

