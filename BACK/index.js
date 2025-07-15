var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');
const { message } = require('statuses');

var app = express(); //Inicializo express
var port = process.env.PORT || 4000; //Ejecuto el servidor en el puerto 3000

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Pongo el servidor a escuchar
app.listen(port, function () {
    console.log(`Server running in http://localhost:${port}`);
});

app.get('/', function (req, res) {
    res.status(200).send({
        message: 'GET Home route working fine!'
    });
});


app.get('/traerUsuarios',async function (req,res) {
    try {
        let respuesta;
        respuesta = await realizarQuery("SELECT * FROM Usuarios")
        console.log(respuesta)
        res.send(respuesta)
    } catch (error) {
        res.send(error)
    }
})

app.get('/traerCategorias',async function(req,res){
    try {
        let respuesta;
        respuesta = await realizarQuery("SELECT * FROM Categorias")
        console.log(respuesta)
        res.send(respuesta)
    } catch (error) {
        res.send(error)
    }
})

app.get('/traerPreguntas',async function (req,res){
    try {
        const respuesta = await realizarQuery(`SELECT * FROM Preguntas`)
        console.log(respuesta)
        res.send(respuesta)
    } catch (error) {
        res.send(error)
    }
}) 

app.get('/verificarUsuario', async function (req, res) {
    try {
        let respuesta;
        respuesta = await realizarQuery(`SELECT * FROM Usuarios WHERE correo_electronico='${req.query.correo_electronico}' AND contraseña='${req.query.contraseña}'`)
        console.log(respuesta)
        if (respuesta.length != 0) {
            console.log(respuesta)
            res.json(respuesta[0])
        } else {
            console.log(respuesta)
            res.send({ mensaje: "correo electrónico o contraseña incorrecta" });
        }
    } catch (error) {
        res.send({message: error})
    }
})

app.get('/buscarUsuarioXNombre',async function (req,res) {
    try {
        let respuesta;
        respuesta = await realizarQuery (`SELECT * FROM Usuarios WHERE nombre ="${req.query.nombre}"`)
        res.json(respuesta[0])
    } catch (error) {
        res.send(error)
    }
})

app.post('/registrarUsuario', async function (req, res) {
    try {
        const usuarioExiste = await realizarQuery(`SELECT * FROM Usuarios WHERE correo_electronico='${req.body.correo_electronico}'`)
        if (usuarioExiste.length > 0) {
            res.send({ mensaje: "El usuario ya existe" });
        } else {
            let respuesta;
            respuesta = await realizarQuery(`INSERT INTO Usuarios(correo_electronico,contraseña,nombre,es_admin,esta_logeado) VALUES ('${req.body.correo_electronico}','${req.body.contraseña}','${req.body.nombre}',${req.body.es_admin},${req.body.esta_logeado})`)
            res.send({mensaje : "ok"})
        }
    } catch (error) {
        res.send(error)
        console.log(error)
    }
})

app.get('/usuarioLogeado',async function(req,res){
    try {
        let respuesta;
        respuesta = await realizarQuery(`SELECT * FROM Usuarios WHERE esta_logeado=true`)
        console.log(respuesta)
        res.json(respuesta[0])
    } catch (error) {
        res.send(error)
    }
})

app.put('/InOut',async function(req,res){
    console.log(req.body)
    if(req.body.esta_logeado == true){
        respuesta = await realizarQuery(`UPDATE Usuarios SET esta_logeado=false WHERE id=${req.body.id}`)
        console.log("me deslogueo")
    } else {
        respuesta = await realizarQuery(`UPDATE Usuarios SET esta_logeado=true WHERE id=${req.body.id}`)
        console.log("me logeo")
        }
    res.send({respuesta:"me ejecuto"})
})

app.get('/traerUltimaPregunta',async function (req,res) {
    try {
        let respuesta;
        respuesta = await realizarQuery (`SELECT * FROM Preguntas ORDER BY  id desc limit 1`)
        res.json(respuesta[0]||null)
    } catch (error) {
        res.send(error)
    }
})
app.get('/traerUltimaOpcion', async function (req, res) {
    try {
        const respuesta = await realizarQuery(`SELECT * FROM Opciones ORDER BY id DESC LIMIT 1`);
        res.json(respuesta[0] || null);
    } catch (error) {
        res.status(500).send(error.message || error);
    }
});

app.get('/buscarPreguntaCategoria', async function (req, res) {
    try {
        const idCategoria = req.query.id_categoria;
        if (!idCategoria) {
            return res.status(400).send("Falta el parámetro 'id_categoria'");
        }
        const respuesta = await realizarQuery(`SELECT * FROM Preguntas WHERE id_categoria = ${idCategoria}`);
        res.json(respuesta);
    } catch (error) {
        res.status(500).send(error.message || error);
    }
});

function normalizarTexto(texto) {
  if (typeof texto !== 'string') return '';
  return texto
    .toLowerCase()
    .normalize('NFD')                   
    .replace(/[\u0300-\u036f]/g, '')    
    .replace(/\s+/g, ' ')               
    .trim();                             
}

app.post('/crearPregunta', async function (req, res) {
  try {
    console.log("viene la imagen")
    const texto = req.body.contenido
    const textoNormalizado = normalizarTexto(texto);

    const preguntas = await realizarQuery('SELECT contenido FROM Preguntas');

    for (let i = 0; i < preguntas.length; i++) {
      const textoExistenteNormalizado = normalizarTexto(preguntas[i].contenido);
      if (textoExistenteNormalizado === textoNormalizado) {
        return res.status(409).send('Ya existe una pregunta similar');
      }
    }
    if(req.body.imagen==undefined){
        await realizarQuery(`INSERT INTO Preguntas (id_categoria,contenido,imagen) VALUES (${req.body.id_categoria},"${req.body.contenido}",NULL)`)
        res.send({message:'Pregunta creada con éxito'});
    } else {
        await realizarQuery(`INSERT INTO Preguntas (id_categoria,contenido,imagen) VALUES (${req.body.id_categoria},"${req.body.contenido}","${req.body.imagen}")`)
        res.send({message:'Pregunta creada con éxito'});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear la pregunta');
  }
});

app.post('/crearOpciones', async function(req,res){
    try {
        await realizarQuery(`INSERT INTO Opciones(opcion,id_pregunta,is_rta) VALUES ("${req.body.opcion}", ${req.body.id_pregunta},${req.body.isRta})`)
        res.send({message:"ok"})
    } catch (error) {
        res.send(error)
    }
})
app.get('/coloresCategoria',async function(req,res){
    try {
        let respuesta;
        respuesta = await realizarQuery ("select nombre_categoria,color from Categorias")
        console.log(respuesta)
        res.send(respuesta)
    } catch (error) {
        res.send(error)
    }
})
app.get('/TraerJugadoresPuntajes',async function(req,res){
    try {
        let jugadores;
        jugadores = await realizarQuery("SELECT id,nombre,max_puntaje FROM Usuarios")
        console.log(jugadores)
        res.send(jugadores)
    } catch (error) {
        res.send(jugadores)
    }
})
app.get('/traerPreguntasCategoria',async function(req,res){
    try {
        let preguntas;
        preguntas = await realizarQuery(`SELECT id,id_categoria,contenido FROM Preguntas WHERE id_categoria = ${req.query.id}`)
        console.log({"preguntas":preguntas})
        res.send(preguntas)
    } catch (error) {
        res.send(error)
    }
})
app.get('/traerOpciones',async function(req,res){
    console.log(req.query.id_pregunta)
    try {
        let opciones;
        opciones = await realizarQuery(`SELECT *  FROM Opciones WHERE id_pregunta =" ${req.query.id_pregunta}"`)
        console.log({"opciones":opciones})
            res.send(opciones)
        } catch (error) {
        res.send(error)
    }
})
app.get('/traerImg',async function(req,res){
    console.log(req.query.id)
    try {
        let img;
        img = await realizarQuery(`SELECT imagen FROM Preguntas WHERE id =" ${req.query.id}"`)
        console.log({"imagen":img}) 
        res.send(img)
    } catch (error) {
        res.send(error)
    }
})
app.get('/traerRecord',async function (req,res) {
    try {
        let record;
        record = await realizarQuery(`SELECT max_puntaje FROM Usuarios WHERE esta_logeado = TRUE;`)
        console.log({"record":record})
        res.send(record[0].max_puntaje)
    } catch (error) {
        res.send(error)
    }
})
app.put('/modificarRecord',async function (req,res) {
    try {
        await realizarQuery(`UPDATE Usuarios set max_puntaje=${req.body.max_puntaje}`)
        res.send("record actualizado con exito")
    } catch (error) {
        res.send(error)
    }
})
app.put('/modificarPuntajeActual',async function (req,res) {
    try {
        await realizarQuery(`UPDATE Usuarios set puntaje=${req.body.puntaje}`)
        res.send("se ha a guardado el puntaje con exito")
    } catch (error) {
        res.send(error)
    }
})
app.put('/reiniciarPuntaje',async function (req,res) {
    try {
        await realizarQuery(`UPDATE Usuarios set puntaje=0`)
        res.send("se ha a reiniciado el puntaje con exito")
    } catch (error) {
        res.send(error)
    }
});
app.delete('/borrarPregunta', async function (req, res) {
    try {
        await realizarQuery(`DELETE FROM Preguntas WHERE id=${req.body.id};`);
        await realizarQuery(`DELETE FROM Opciones WHERE id_pregunta=${req.body.id};`);
        res.json({ message: "eliminado con exito" });
    } catch (error) {
        res.status(500).json({ error: error.message || error });
    }
});

app.delete('/eliminarJugadorXid', async function (req, res) {
    try {
        await realizarQuery(`DELETE FROM Usuarios WHERE id=${req.body.id}`);
        res.json({ message: "jugador eliminado con exito" });
    } catch (error) {
        res.status(500).json({ error: error.message || error });
    }
});

app.put('/actualizarPuntaje', async function(req, res){
    try {
        if(req.body.action === "eliminar"){
            await realizarQuery(`UPDATE Usuarios SET max_puntaje=0 WHERE id=${req.body.id}`);
            res.json({ message: "puntaje eliminado" });
        } else {
            await realizarQuery(`UPDATE Usuarios SET max_puntaje=${req.body.new_highScore} WHERE id=${req.body.id}`);
            res.json({ message: "puntaje actualizado" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message || error });
    }
});

app.get("/traerPregunta", async function(req, res){
    try {
        const pregunta = await realizarQuery(`SELECT * FROM Preguntas WHERE id=${req.query.id}`);
        res.json(pregunta[0] || null);
    } catch (error) {
        res.status(500).json({ error: error.message || error });
    }
});

app.get("/traerOpcion", async (req, res) => {
    try {
        const respuesta = await realizarQuery(`SELECT * FROM Opciones WHERE id_pregunta=${req.query.id_pregunta}`);
        res.json(respuesta);
    } catch (error) {
        res.status(500).json({ error: error.message || error });
    }
});

app.put("/actualizarPregunta", async function(req, res) {
    try {
        await realizarQuery(`
            UPDATE Preguntas
            SET id_categoria = ${req.body.id_categoria},
                contenido = "${req.body.contenido}",
                imagen = "${req.body.imagen}"
            WHERE id = ${req.body.id}
        `);
        res.json({ message: "pregunta actualizada" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar la pregunta" });
    }
});

app.put("/actualizarOpcion", async function(req, res) {
    try {
        await realizarQuery(`
            UPDATE Opciones 
            SET opcion = "${req.body.opcion}", 
                id_pregunta = ${req.body.id_pregunta}, 
                is_rta = ${req.body.isRta} 
            WHERE id = ${req.body.id}
        `);
        res.json({ message: "opcion actualizada" });
    } catch (error) {
        res.status(500).json({ error: error.message || error });
    }
});

// app.get('/traerImg', async function (req, res) {
//     try {
//         const resultado = await realizarQuery(`SELECT imagen FROM Preguntas WHERE id = ${req.query.id}`);
//         if (!resultado.length || !resultado[0].imagen) {
//             return res.json({ imagenBase64: null });
//         }
//         const imagen = resultado[0].imagen;
//         let imagenBase64;
//         if (Buffer.isBuffer(imagen)) {
//             imagenBase64 = `data:image/jpeg;base64,${imagen.toString('base64')}`;
//         } else if (typeof imagen === 'string' && imagen.startsWith('data:image/')) {
//             imagenBase64 = imagen;
//         } else {
//             imagenBase64 = `data:image/jpeg;base64,${imagen}`;
//         }
//         res.json({ imagenBase64 });
//     } catch (error) {
//         console.error("Error al traer imagen:", error);
//         res.status(500).json({ error: 'Error al traer la imagen' });
//     }
// });

