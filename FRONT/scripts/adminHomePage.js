const btns = document.querySelectorAll(".correct-btn")
const pregunta = document.getElementById("area-pregunta")
const selector = document.getElementById("select-categoria")
const contenedores = document.querySelectorAll(".contedor-pregunta")
llenarSelect()
console.log(contenedores[0].firstElementChild)


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
    if(pregunta.value === "" ){
        console.log("te falta la pregunta crack")
    }
    else{
        for(let x = 0; x<contenedores.length;x++){
            if(contenedores[x].firstElementChild.value == "" || contenedores[x].lastElementChild.innerText == "")
            console.log("te falta completar una opcion")
        }
    }       
}

