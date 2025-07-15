const modal = document.getElementById("modal-increible");
const img = modal.children[1];
let selected;
let puntaje; 
function recuperarPuntaje(){
    const queryString = window.location.search;
    const param = new URLSearchParams(queryString);
    puntaje = param.get('puntaje')
    if(puntaje==="undefined"){
        puntaje = 0 
        return puntaje
    } 
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

let categorias = [];
let step;
let itemDegs = {};
let currentDeg = 0;
let speed = 0;
let maxRotation = randomRange(360 * 3, 360 * 6);
let pause = false;

async function traerCategoriasConColores() {
    const c = await traerCategorias();
    const categorias = [];

    for (let x = 0; x < c.length; x++) {
        const partes = c[x].color.trim().split(",");
        const color = {
            r: parseInt(partes[0]),
            g: parseInt(partes[1]),
            b: parseInt(partes[2])
        };

        const imagenBase64 = `data:image/png;base64,${c[x].img_categoria}`;

        categorias.push(new Categoria(
            c[x].id,
            c[x].nombre_categoria,
            imagenBase64,
            color
        ));
    }

    return categorias;
}

function draw() {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, toRad(0), toRad(360));
    ctx.fillStyle = `rgb(33,33,33)`;
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    let startDeg = currentDeg;
    itemDegs = {};

    for (let i = 0; i < categorias.length; i++, startDeg += step) {
        const endDeg = startDeg + step;
        const color = categorias[i].color;
        if (!color) continue;

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

        // Texto
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

        if (startDeg % 360 < 360 && startDeg % 360 > 270 && endDeg % 360 > 0 && endDeg % 360 < 90) {
            modal.firstElementChild.innerText = categorias[i].nombre;
            img.src = categorias[i].imagen;
        }
    }
}

function animate() {
    if (pause) return;

    speed = easeOutSine(getPercent(currentDeg, maxRotation, 0)) * 20;
    if (speed < 0.01) {
        speed = 0;
        pause = true;
        ui.showCatModal();
        return;
    }

    currentDeg += speed;
    draw();
    window.requestAnimationFrame(animate);
}

function spin() {
    if (speed !== 0) return;

    maxRotation = 0;
    currentDeg = 0;
    draw();

    const randomIndex = Math.floor(Math.random() * categorias.length);
    selected = categorias[randomIndex];
    console.log(`Selected ${selected.id}`);

    const degs = itemDegs[selected.nombre];
    if (!degs) {
        console.warn("Categoría no encontrada:", selected);
        return;
    }

    maxRotation = (360 * 6) - degs.endDeg + 10;
    pause = false;
    window.requestAnimationFrame(animate);
}

traerCategoriasConColores().then(data => {
    recuperarPuntaje()
    categorias = data;
    step = 360 / categorias.length;
    draw();
});

modal.lastElementChild.addEventListener("click", () => {
    if(puntaje ===null) {
        puntaje = 0
    }
    location.href = `juego.html?id=${selected.id}&puntaje=${puntaje}`;
});