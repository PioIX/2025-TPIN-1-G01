const btns = document.querySelectorAll(".correct-btn")
const areaPregunta = document.getElementById("area-pregunta")
const selector = document.getElementById("select-categoria")
const contenedores = document.querySelectorAll(".contedor-pregunta")
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
    const puntajes = [100, 200, 300, 400, 500];
    const numeroAleatorio = opciones[Math.floor(Math.random() * opciones.length)];
    if(areaPregunta.value === "" ){
        console.log("te falta la pregunta crack")
    }
    else{
        for(let x = 0; x<contenedores.length;x++){
            if(contenedores[x].firstElementChild.value == "" || contenedores[x].lastElementChild.innerText == "")
            console.log("te falta completar una opcion")
        }
    }
    const id_categoria = selector.value
    const contenido = areaPregunta.value
    const puntaje = numeroAleatorio
    const respuesta = null
    const Question = new Pregunta(id_categoria,puntaje,contenido,respuesta,img)
    mandarPregunta(Question)
}

