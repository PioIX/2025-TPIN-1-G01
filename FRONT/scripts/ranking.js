const btnOut = document.getElementById("btn-cerrarSesion")
const table = document.getElementsByTagName("table")[0]

btnOut.addEventListener("click",()=>{
    console.log("hola")
    ui.changeScreen("home")})

async function llenarTabla(){
    const jugadores = await TraerJugadoresPuntajes()
    table.innerHTML += 
    `<tr>
        <th>id</th>
        <th>nombre</th>
        <th>record</th>
    </tr>`
    for(let x=0;x<jugadores.length;x++){
        table.innerHTML += 
    `<tr>
        <td>${jugadores[x].id}</td>
        <td>${jugadores[x].nombre}</td>
        <td>${jugadores[x].max_puntaje}</td>
    </tr>`
    }
}

llenarTabla()