const modal = document.getElementById("modal-increible")
let selected;
// Trae los colores en formato {r, g, b}
async function traerColores() {
    const c = await traerCategorias();
    const colores = [];
    for (let x = 0; x < c.length; x++) {
        const partes = c[x].color.trim().split(",");
        colores.push({
            r: parseInt(partes[0]),
            g: parseInt(partes[1]),
            b: parseInt(partes[2])
        });
    }
    return colores;
}

async function generarCategorias(){
    const c = await traerCategorias();
    const categorias = []
    for(let x=0;x<c.length;x++){
        categorias.push(new Categoria(c[x].id,c[x].nombre_categoria))
    }
    return categorias
}

// Convierte grados a radianes
function toRad(deg) {
    return deg * (Math.PI / 180.0);
}

// Entero aleatorio entre min y max
function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función easing para frenar el giro
function easeOutSine(x) {
    return Math.sin((x * Math.PI) / 2);
}

// Porcentaje entre min y max
function getPercent(input, min, max) {
    return (((input - min) * 100) / (max - min)) / 100;
}

// Variables canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const centerX = width / 2;
const centerY = height / 2;
const radius = width / 2;

// Categorías de la ruleta
let categorias;
let step;

// Colores cargados dinámicamente
let colors = [];
let itemDegs = {};
let currentDeg = 0;
let speed = 0;
let maxRotation = randomRange(360 * 3, 360 * 6);
let pause = false;

// Dibuja la ruleta
async function draw() {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, toRad(0), toRad(360));
    ctx.fillStyle = `rgb(33,33,33)`;
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    let startDeg = currentDeg;
    itemDegs = {};

    for (let i = 0; i < categorias.length; i++, startDeg += step) {
        if (!colors[i]) continue;

        const endDeg = startDeg + step;
        const color = colors[i];
        const colorStyle = `rgb(${color.r},${color.g},${color.b})`;
        const colorStyle2 = `rgb(${color.r - 30},${color.g - 30},${color.b - 30})`;

        // Parte exterior más oscura
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg));
        ctx.fillStyle = colorStyle2;
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        // Parte interior base
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 30, toRad(startDeg), toRad(endDeg));
        ctx.fillStyle = colorStyle;
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        // Texto rotado
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(toRad((startDeg + endDeg) / 2));
        ctx.textAlign = "center";
        ctx.fillStyle = (color.r > 150 || color.g > 150 || color.b > 150) ? "#000" : "#fff";
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(categorias[i].nombre, 130, 10);
        ctx.restore();

        itemDegs[categorias[i].nombre] = {
            startDeg: startDeg,
            endDeg: endDeg
        };

        // Muestra el ganador si está en la parte superior
        if (startDeg % 360 < 360 && startDeg % 360 > 270 && endDeg % 360 > 0 && endDeg % 360 < 90) {
            // document.getElementById("winner").innerText = categorias[i]; 
            modal.firstElementChild.innerText = categorias[i].nombre
        }
    }
}

// Crea la ruleta y carga colores
// async function createWheel() {
//     categorias = await generarCategorias()
//     step = 360 / categorias.length;
//     console.log(1)
//     traerColores().then(data => {
//         colors = data;
//         draw();
//     });
// }

// Anima el giro
async function animate() {
    if (pause) return;

    speed = easeOutSine(getPercent(currentDeg, maxRotation, 0)) * 20;
    if (speed < 0.01) {
        speed = 0;
        pause = true;
        // alert(document.getElementById("winner").innerText);
        ui.showCatModal()
        return;
    }

    currentDeg += speed;
    draw();
    window.requestAnimationFrame(animate);
}

// Inicia el giro
async function spin() {
    if (speed !== 0) return;

    maxRotation = 0;
    currentDeg = 0;

    traerColores().then(data => {
        colors = data;
        draw();

        // Selecciona aleatoriamente una categoría
        let randomIndex = Math.floor(Math.random() * categorias.length);
        selected = categorias[randomIndex];
        console.log(`Selected ${selected.id}`)
        
        // Asegura que itemDegs esté bien cargado
        const degs = itemDegs[selected.nombre];
        if (!degs) {
            console.warn("Categoría no encontrada:", selected);
            return;
        }
        
        maxRotation = (360 * 6) - degs.endDeg + 10;
        // document.getElementById("winner").innerText = "Girando...";
        pause = false;
        window.requestAnimationFrame(animate);
    });
}

// Al iniciar: carga colores y dibuja
generarCategorias().then(nombres=>{
    categorias = nombres
    step = 360 / categorias.length;
    traerColores().then(colores => {
        colors = colores;
        draw();
    });
})


modal.lastElementChild.addEventListener("click",()=>{
    location.href = `juego.html?id=${selected.id}`;
})