const btns = document.querySelectorAll(".correct-btn");
const areaPregunta = document.getElementById("area-pregunta");
const btnCloseSession = document.getElementsByClassName("btn-cerrar");
const contenedores = document.getElementsByClassName("contenedor-pregunta");
const editar = document.getElementsByClassName("contenedor-editar");
const input = document.getElementsByClassName("imgInput");
const display = document.getElementsByClassName("cargar-display");

const selectAgregarCategoria = document.getElementById("agregar-select-categoria");
const selectModificarCategoria = document.getElementById("editar-select-categoria");
const selectModificarPregunta = document.getElementById("editar-select-pregunta");
const selectBorrarCategoria = document.getElementById("borrar-select-categoria");
const selectBorrarPregunta = document.getElementById("borrar-select-pregunta");

const selectJugadores = document.getElementById("select-jugadores");
const inputScore = document.getElementById("new-score");

const divAgregarPregunta = document.getElementById("agregar-pregunta");
const divModificarPregunta = document.getElementById("modificar-pregunta");
const divBorrarPregunta = document.getElementById("delete-pregunta");
const divAreaJugador = document.getElementById("area-usuario");

// const btnCargar = document.getElementById("btnCargar");
const imgMostrar = document.getElementById("imgMostrar");
const selectorCategoriaNuevo = document.getElementById("new-category");

let base64Imagen = null;

cargarCategorias();
modificarJugadores();

input[0].addEventListener("change", () => {
  const file = input[0].files[0];
  if (!file) {
    base64Imagen = null;
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    base64Imagen = event.target.result;
  };
  reader.readAsDataURL(file);
});


selectModificarCategoria.addEventListener("change", () => {
  const categoriaId = selectModificarCategoria.value;
  if (!categoriaId || categoriaId === "undefined") return;

  recuperarPreguntasCategoria(categoriaId).then((preguntas) => {
    selectModificarPregunta.innerHTML = '<option value="undefined" selected disabled hidden>Seleccione una pregunta</option>';
    preguntas.forEach(p => {
      selectModificarPregunta.innerHTML += `<option value="${p.id}">${p.contenido}</option>`;
    });
    display[0].innerText = "";
    selectModificarPregunta.selectedIndex = 0;
  });
});

selectBorrarCategoria.addEventListener("change", () => {
  const categoriaId = selectBorrarCategoria.value;
  if (!categoriaId || categoriaId === "undefined") return;

  recuperarPreguntasCategoria(categoriaId).then((preguntas) => {
    selectBorrarPregunta.innerHTML = '<option value="undefined" selected disabled hidden>Seleccione una pregunta</option>';
    preguntas.forEach(p => {
      selectBorrarPregunta.innerHTML += `<option value="${p.id}">${p.contenido}</option>`;
    });
    display[1].innerText = "";
    selectBorrarPregunta.selectedIndex = 0;
  });
});

selectModificarPregunta.addEventListener("change", () => {
  preguntaAEditar();
});

selectBorrarPregunta.addEventListener("change", () => {
  const opcion = selectBorrarPregunta.options[selectBorrarPregunta.selectedIndex];
  display[1].innerText = opcion && opcion.value !== "undefined" ? opcion.text : "";
});


for (let btn of btnCloseSession) {
  btn.addEventListener("click", () => {
    ui.cerrarSesion();
  });
}

btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.innerText = btn.innerText === "cruz" ? "tick" : "cruz";
  });
});


inputScore.addEventListener("keydown", (e) => {
  if (["-", "+", "e"].includes(e.key)) e.preventDefault();
});


function cargarCategorias() {
  RecuperarColoresCategoria().then((categorias) => {
    categorias.forEach(c => {
      const option = `<option value="${c.id}">${c.nombre_categoria}</option>`;
      selectAgregarCategoria.innerHTML += option;
      selectModificarCategoria.innerHTML += option;
      selectBorrarCategoria.innerHTML += option;
    });
  });
}

function CrearPregunta() {
  if (areaPregunta.value.trim() === "") {
    alert("Debe ingresar una pregunta");
    return;
  }

  let algunaSeleccionada = false;
  for (let x = 0; x < contenedores.length; x++) {
    if (contenedores[x].firstElementChild.value.trim() === "") {
      alert("Debe completar todas las opciones");
      return;
    }
    if (contenedores[x].lastElementChild.checked) {
      algunaSeleccionada = true;
    }
  }

  if (!algunaSeleccionada) {
    alert("Debe seleccionar la respuesta correcta");
    return;
  }

  const id_categoria = selectAgregarCategoria.value;
  const contenido = areaPregunta.value.trim();
  const img = base64Imagen || null;

  recuperarUltimaPregunta().then((ultimaPregunta) => {
    const id_pregunta = (ultimaPregunta && ultimaPregunta.id) ? ultimaPregunta.id + 1 : 1;
    const question = new Pregunta(id_pregunta, id_categoria, contenido, img);

    mandarPregunta(question).then(() => {
      recuperarUltimaOpcion().then((ultimaOpcion) => {
        const idOpcionInicial = (ultimaOpcion && ultimaOpcion.id) ? ultimaOpcion.id + 1 : 1;
        const options = [];
        console.log(id_pregunta)
        for (let i = 0; i < 4; i++) {
          const texto = contenedores[i].firstElementChild.value.trim();
          const esCorrecta = contenedores[i].lastElementChild.checked;
          options.push(new Opcion(idOpcionInicial + i, texto, id_pregunta, esCorrecta));
        }

        mandarOpcionesSecuencial(options, 0, () => {
          areaPregunta.value = "";
          for (let j = 0; j < 4; j++) {
            contenedores[j].firstElementChild.value = "";
            contenedores[j].lastElementChild.checked = false;
          }
          base64Imagen = null;
          alert("Pregunta creada correctamente");
        });
      });
    });
  });
}

function mandarOpcionesSecuencial(options, index, callback) {
  if (index >= options.length) {
    callback();
    return;
  }
  mandarOpciones(options[index]).then(() => {
    mandarOpcionesSecuencial(options, index + 1, callback);
  });
}

function borrarPregunta() {
  const id = selectBorrarPregunta.value;
  if (id && id !== "undefined") {
    deleteQuestion({ id }).then(() => {
      alert("Pregunta eliminada");
      selectBorrarPregunta.innerHTML = '<option value="undefined" selected disabled hidden>Seleccione una pregunta</option>';
      display[1].innerText = "";
      selectBorrarCategoria.selectedIndex = 0;
    });
  } else {
    alert("Seleccione una pregunta para borrar");
  }
}

function modificarJugadores() {
  traerJugadores().then((jugadores) => {
    selectJugadores.innerHTML = '<option value="undefined" selected disabled hidden>Seleccione un jugador</option>';
    jugadores.forEach(j => {
      selectJugadores.innerHTML += `<option value="${j.id}">${j.nombre} - puntaje máximo: ${j.max_puntaje}</option>`;
    });
  });
}

function eliminarJugador() {
  const id = selectJugadores.value;
  if (id && id !== "undefined") {
    deletePlayer({ id }).then(() => modificarJugadores());
  } else {
    alert("Seleccione un jugador");
  }
}

function modificarPuntaje(act) {
  const indice = selectJugadores.selectedIndex;
  if (indice < 0 || selectJugadores.options[indice].value === "undefined") {
    alert("Seleccione un jugador");
    return;
  }

  const idJugador = parseInt(selectJugadores.options[indice].value);

  if (act === "eliminar") {
    updateHighScore({ action: act, id: idJugador }).then(() => {
      modificarJugadores();
      inputScore.value = "";
      alert("Puntaje eliminado correctamente");
    }).catch(() => alert("Error al eliminar el puntaje"));
    return;
  }

  if( act === "actualizar"){
    const newScore = parseInt(inputScore.value);
    if (isNaN(newScore) || newScore <= 0) {
      alert("Ingrese un puntaje válido");
      return;
    }
    updateHighScore({ action: act, id: idJugador, new_highScore: newScore }).then(() => {
      modificarJugadores();
      inputScore.value = "";
      alert("Puntaje actualizado correctamente");
    }).catch(() => alert("Error al actualizar el puntaje"));
  }

}

function mostrarDiv(seccion) {
  divAgregarPregunta.style.display = seccion === 1 ? "block" : "none";
  divModificarPregunta.style.display = seccion === 2 ? "block" : "none";
  divBorrarPregunta.style.display = seccion === 3 ? "block" : "none";
  divAreaJugador.style.display = seccion === 4 ? "block" : "none";
}

function preguntaAEditar() {
  const id_pregunta = selectModificarPregunta.value;
  if (!id_pregunta || id_pregunta === "undefined") {
    display[0].innerText = "";
    return;
  }
  traerPregunta(id_pregunta).then((pregunta) => {
    display[0].innerText = pregunta.contenido;
    mostrarImagen(pregunta);
    traerOpcion(pregunta.id).then((opciones) => {
      for (let i = 0; i < editar.length; i++) {
        editar[i].firstElementChild.value = opciones[i] ? opciones[i].opcion : "";
        editar[i].firstElementChild.setAttribute("id", opciones[i] ? opciones[i].id : "");
        editar[i].lastElementChild.checked = opciones[i] ? opciones[i].is_rta : false;
      }
    });

    traerCategorias().then((categorias) => {
      selectorCategoriaNuevo.innerHTML = '<option value="undefined" selected disabled hidden>Seleccione una categoría</option>';
      categorias.forEach(c => {
        selectorCategoriaNuevo.innerHTML += `<option value="${c.id}">${c.nombre_categoria}</option>`;
      });
    });
  });
}

async function editarPregunta() {
  const inputFile = input[1];
  let img = base64Imagen || null;

  if(selectModificarCategoria.value=="undefined"){
    alert("Seleccione una categoría");
    return 0;
  }

  if(selectModificarPregunta.value=="undefined"){
    alert("Seleccione una pregunta");
    return 0;
  }

  if (inputFile && inputFile.files.length > 0) {
    const file = inputFile.files[0];
    img = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const datos = {
    id: selectModificarPregunta.value,
    id_categoria: selectorCategoriaNuevo.value!=="undefined"?selectorCategoriaNuevo.value:selectModificarCategoria.value,
    contenido: display[0].value,
    imagen: img
  };

  actualizarPregunta(datos).then(() => {
    actualizarOpcionesSecuencial(0);
  });

  function actualizarOpcionesSecuencial(i) {
    if (i >= editar.length) {
      alert("Pregunta y opciones actualizadas correctamente");
      return;
    }
    const id = editar[i].firstElementChild.getAttribute("id");
    const valor = editar[i].firstElementChild.value;
    const esCorrecta = editar[i].lastElementChild.checked;
    const opcion = new Opcion(id, valor, selectModificarPregunta.value, esCorrecta);

    actualizarOpcion(opcion).then(() => {
      actualizarOpcionesSecuencial(i + 1);
    });
  }
}

// function mostrarImagen(data) {
//   fetch("http://localhost:4000/traerImg?id=" + data.id)
//     .then(response => {
//       if (!response.ok) throw new Error("No se pudo cargar la imagen");
//       return response.json();
//     })
//     .then(resultado => {
//       if (resultado.imagenBase64) {
//         imgMostrar.src = resultado.imagenBase64;
//       } else {
//         alert("No se encontró imagen");
//       }
//     })
//     .catch(err => {
//       console.error(err);
//       alert("Error al cargar la imagen");
//     });
// }

// async function traerImg(preguntaActual) {
//   console.log(preguntaActual.id)
//   const response = await fetch(`http://localhost:4000/traerImg?id=${preguntaActual.id}`,{
//       method: "GET",
//       headers: {
//           "Content-Type": "application/json",
//       }
//   })
//   const result = await response.json()
//   return result[0].imagen
// }
async function mostrarImagen(data) {
  try {
    const response = await fetch(`http://localhost:4000/traerImg?id=${data.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.ok)
    const resultado = await response.json();
    console.log(resultado[0])
    if (resultado[0].imagen == null) throw new Error("No se pudo cargar la imagen");
    imgMostrar.src = resultado[0].imagen
    // if (resultado && resultado.imagenBase64) {
    //   imgMostrar.src = resultado.imagenBase64;
    // } else {
    //   alert("No se encontró imagen");
    // }
  } catch (err) {
    console.error(err);
    alert("Error al cargar la imagen");
  }
}

