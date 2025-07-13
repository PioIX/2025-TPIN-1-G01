document.addEventListener("DOMContentLoaded",async function(){
    console.log("pepe")
    const jugadores = await traerMejoresJugadores()
    const tabla_top = document.getElementById("tabla-top")
    console.log(jugadores)
    for (let i=0; i<jugadores.length;i++){
        tabla_top.innerHTML +=
        `
        <tr>
            <td>${jugadores[i].id}</td>
            <td>${jugadores[i].nombre}</td>
            <td>${jugadores[i].max_puntaje}</td>
        </tr>
        `
    }
})