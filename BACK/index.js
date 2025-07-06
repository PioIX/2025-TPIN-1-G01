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
app.get('/traerJugadores',async function (req,res) {
    try {
        let respuesta;
        respuesta = await realizarQuery("SELECT * FROM Jugadores")
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
app.get('/traerUltimaOpcion',async function (req,res) {
    try {
        let respuesta;
        respuesta = await realizarQuery (`SELECT * FROM Opciones ORDER BY  id desc limit 1`)
        res.json(respuesta[0]||null)
    } catch (error) {
        res.send(error)
    }
})
app.get('/buscarPreguntaCategoria',async function (req,res) {
    try {
        let respuesta;
        respuesta = await realizarQuery (`SELECT * FROM Preguntas where id_categoria=${req.query.id_categoria}`)
        res.send(respuesta)
    } catch (error) {
        res.send(error)
    }
})
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

app.post('/crearOpciones',async function(req,res){
    try {
        await realizarQuery(`INSERT INTO Opciones(opcion,id_pregunta,is_rta) VALUES ("${req.body.opcion}", ${req.body.id_pregunta},${req.body.isRta})`)
        res.send({message:"ok"})
    } catch (error) {
        res.send(error)
    }
})
app.delete('/borrarPregunta',async function (req,res) {
    try {
        await realizarQuery(`DELETE FROM Preguntas WHERE id=${req.body.id};`)
        await realizarQuery(`DELETE FROM Opciones WHERE id_pregunta=${req.body.id};`)
        res.send({message:"eliminado con exito"})
    } catch (error) {
        res.send({"error":error})
    }
})
app.delete('/eliminarJugadorXid',async function (req,res) {
    try {
        await realizarQuery(`DELETE FROM Jugadores WHERE id=${req.body.id}`)
        res.send({message:"jugador eliminado con exito"})
    } catch (error) {
        res.send(error)
    }
})
app.put('/actualizarPuntaje',async function(req,res){
    console.log(req.body)
    try {
        if(req.body.action==="eliminar"){
            await realizarQuery(`UPDATE Jugadores SET max_puntaje=0 WHERE id=${req.body.id}`)
            res.send({message:"puntaje eliminado"})
        } else{
            await realizarQuery(`UPDATE Jugadores SET max_puntaje=${req.body.new_highScore} WHERE id=${req.body.id}`)
            res.send({message:"puntaje actualizado"})
        }
    } catch (error) {
        res.send(error)
    }
})

app.get("/traerPregunta", async function(req,res){
    try {
        const pregunta = await realizarQuery(
            `Select * from Preguntas where id= ${req.query.id}`
        )    
        res.send(pregunta[0])
    } catch (error) {
        res.send(error)
    }
})

app.get("/traerOpcion", async (req,res) => {
    try {
        const respuesta = await realizarQuery(
            `Select * from Opciones where id_pregunta = ${req.query.id_pregunta}`
        )
        console.log(respuesta)
        for(let i=0;i<respuesta[0].opcion.length;i++){
            console.log(respuesta[i].opcion[i])
        }
        res.send(respuesta)
    } catch (error) {
        res.send(error)
    }
})

app.put("/actualizarPregunta", async function(req, res) {
    console.log("actualizando pregunta");
    console.log("Imagen recibida:", req.body.imagen ? req.body.imagen.slice(0, 100) : "null");

    try {
        await realizarQuery( `
            UPDATE Preguntas
            SET id_categoria = ${req.body.id_categoria},
                contenido = "${req.body.contenido}",
                imagen = "${req.body.imagen}"
            WHERE id = ${req.body.id}
        `)
        
        res.send({ message: "pregunta actualizada" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error al actualizar la pregunta" });
    }
});


app.put("/actualizarOpcion", async function(req, res) {
    console.log(req.body)
    try {
        await realizarQuery(
            `UPDATE Opciones 
            SET opcion="${req.body.opcion}", 
                id_pregunta=${req.body.id_pregunta}, 
                is_rta=${req.body.isRta} 
            WHERE id=${req.body.id}`
        );
        res.send({ message: "opcion actualizada" });
    } catch (error) {
        res.send(error);
    }
});

app.get('/traerImg', async function (req, res) {
    try {
        const resultado = await realizarQuery(`SELECT imagen FROM Preguntas WHERE id = ${req.query.id}`);
        if (resultado.length === 0 || !resultado[0].imagen) {
            return res.json({ imagenBase64: null });
        }
        const imagen = resultado[0].imagen;
        let imagenBase64;
        if (Buffer.isBuffer(imagen)) {
            imagenBase64 = `data:image/jpeg;base64,${imagen.toString('base64')}`;
        } else if (typeof imagen === 'string' && imagen.startsWith('data:image/')) {
            imagenBase64 = imagen;
        } else {
            imagenBase64 = `data:image/jpeg;base64,${imagen}`;
        }
        console.log("Enviando imagen base64:", imagenBase64.slice(0, 100));
        res.json({ imagenBase64 });

    } catch (error) {
        console.error("Error al traer imagen:", error);
        res.status(500).json({ error: 'Error al traer la imagen' });
    }
});

