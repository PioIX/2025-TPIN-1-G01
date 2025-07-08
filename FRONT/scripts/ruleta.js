  // Genera un color aleatorio en formato RGB
  function randomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return { r, g, b };
}
async function traerColores(){
    c = await RecuperarColoresCategoria()
    const a = []
    const colorines=[]
    let col = [];
    for(let x=0;x<c.length;x++){
        a.push(c[x].color.trim().split(","))    
    }
    for(let i=0;i<a.length;i++){
        col.push({
            r: a[i][0],
            g: a[i][1],
            b: a[i][2],

        })
        colorines.push(col[i])
    }
    return colorines
}

// Convierte grados a radianes, para uso en canvas
function toRad(deg) {
    return deg * (Math.PI / 180.0);
}

// Devuelve un entero aleatorio entre min y max (inclusive)
function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función de easing para desacelerar suavemente el giro
function easeOutSine(x) {
    return Math.sin((x * Math.PI) / 2);
}

// Calcula el porcentaje que representa "input" dentro del rango min-max
function getPercent(input, min, max) {
    return (((input - min) * 100) / (max - min)) / 100;
}

// Variables globales para el canvas y contexto
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

// Centro y radio del círculo
const centerX = width / 2;
const centerY = height / 2;
const radius = width / 2;

// Categorías que forman las secciones de la ruleta
let categorias = ["Geografía", "Ciencia", "Historia", "Arte", "Deportes", "Entretenimiento"];

// Ángulo que ocupa cada categoría (dividiendo 360° entre la cantidad de categorías)
let step = 360 / categorias.length;

// Colores aleatorios para cada sección
let colors = [];

// Guarda los grados de inicio y fin de cada sección para detectar ganador
let itemDegs = {};
// Ángulo actual de rotación de la ruleta
let currentDeg = 0;

// Velocidad actual del giro
let speed = 0;

// Cantidad total de grados que girará la ruleta (random entre 3 y 6 vueltas)
let maxRotation = randomRange(360 * 3, 360 * 6);

// Flag para pausar la animación cuando el giro termina
let pause = false;

// Inicializamos colores para cada sección al cargar la página
traerColores().then(data=>{for(let i=0;i<data.length;i++){
    console.log(data[i])
    colors.push(data[i])
}})
// for (let i = 0; i < categorias.length; i++) {
//     colors.push(randomColor());
//     console.log(colors[i])
// }

// Crea la ruleta y actualiza variables necesarias
function createWheel() {
    step = 360 / categorias.length; // recalcula el paso en caso de cambiar categorías
    colors = [];
    // for (let i = 0; i < categorias.length + 1; i++) {
    //     colors.push(randomColor());
    // }
    traerColores().then(data=>{for(let i=0;i<data.length;i++){
        console.log(data[i])
        colors.push(data[i])
    }})

    draw(); // dibuja la ruleta con los nuevos colores
}

// Dibuja la ruleta en el canvas
async function draw() {
    // Fondo oscuro de la rueda
    await traerColores()
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, toRad(0), toRad(360));
    ctx.fillStyle = `rgb(33,33,33)`;
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    // Ángulo donde empieza a dibujar cada sección
    let startDeg = currentDeg;

    // Reiniciamos posiciones de categorías
    itemDegs = {};

    // Recorremos cada categoría para dibujar su sector
    for (let i = 0; i < categorias.length; i++, startDeg += step) {
        let endDeg = startDeg + step;

        // Color para esta sección
        let color = colors[i];
        let colorStyle = `rgb(${color.r},${color.g},${color.b})`;
        let colorStyle2 = `rgb(${color.r - 30},${color.g - 30},${color.b - 30})`;

        // Parte exterior del sector (color más oscuro)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg));
        ctx.fillStyle = colorStyle2;
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        // Parte interior del sector (color base)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 30, toRad(startDeg), toRad(endDeg));
        ctx.fillStyle = colorStyle;
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        // Dibuja texto rotado en el centro de cada sector
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(toRad((startDeg + endDeg) / 2));
        ctx.textAlign = "center";

        // Color del texto: negro si el fondo es claro, blanco si es oscuro
        ctx.fillStyle = (color.r > 150 || color.g > 150 || color.b > 150) ? "#000" : "#fff";
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(categorias[i], 130, 10);
        ctx.restore();

        // Guardamos el rango de grados que ocupa esta categoría
        itemDegs[categorias[i]] = {
            startDeg: startDeg,
            endDeg: endDeg
        };

        // Actualiza el texto del ganador si la ruleta apunta arriba (entre 270° y 90°)
        if (startDeg % 360 < 360 && startDeg % 360 > 270 && endDeg % 360 > 0 && endDeg % 360 < 90) {
            document.getElementById("winner").innerText = categorias[i];
        }
        
    }
}

// Función para animar el giro de la ruleta
function animate() {
    if (pause) return; // si está pausado, no continuar

    // Calculamos la velocidad actual usando easing para desacelerar
    speed = easeOutSine(getPercent(currentDeg, maxRotation, 0)) * 20;

    // Si la velocidad es casi 0, frenamos la animación
    if (speed < 0.01) {
        speed = 0;
        pause = true;
    }

    currentDeg += speed; // incrementamos el ángulo de rotación
    if(pause){
        alert(document.getElementById("winner").innerText)
    }
    draw(); // redibujamos la ruleta en la nueva posición

    // Continuar animación con requestAnimationFrame
    window.requestAnimationFrame(animate);
}

// Función que se ejecuta al hacer clic para iniciar el giro
function spin() {
    if (speed !== 0) return; // si ya está girando, no hacer nada

    maxRotation = 0;
    currentDeg = 0;
    createWheel(); // refresca la ruleta y colores
    draw();

    // Seleccionamos aleatoriamente una categoría ganadora
    let randomIndex = Math.floor(Math.random() * categorias.length);
    let selected = categorias[randomIndex];

    // Calculamos cuántos grados debe girar para caer en la categoría seleccionada
    maxRotation = (360 * 6) - itemDegs[selected].endDeg + 10;

    // Indicamos que está girando
    document.getElementById("winner").innerText = "Girando...";
    pause = false;

    // Comenzamos la animación
    window.requestAnimationFrame(animate);
}

traerColores()
draw(); // Dibuja la ruleta inicialmente al cargar la página
