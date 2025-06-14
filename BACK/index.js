var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');
const { message } = require('statuses');

var app = express(); //Inicializo express
var port = process.env.PORT || 4000; //Ejecuto el servidor en el puerto 3000

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

//Pongo el servidor a escuchar
app.listen(port, function(){
    console.log(`Server running in http://localhost:${port}`);
});

app.get('/', function(req, res){
    res.status(200).send({
        message: 'GET Home route working fine!'
    });
});

app.get('/traerUsuarios',async function (req,res) {
    let respuesta;
    respuesta = await realizarQuery("SELECT * FROM Usuarios")
    console.log(respuesta)
    res.send(respuesta)
})
//funcion prueba

app.get('/verificarUsuario',async function(req,res) {
    try {
        let respuesta;
        respuesta = await realizarQuery(`SELECT * FROM Usuarios WHERE correo_electronico='${req.query.correo_electronico}' AND contraseña='${req.query.contraseña}'`)
        console.log(respuesta)
        if(respuesta.length!=0){
            console.log(respuesta)
            res.json(respuesta[0])
        } else{
            console.log(respuesta)
            res.send({ mensaje: "correo electrónico o contraseña incorrecta" });
        }
    } catch (error) {
        res.send(error)
    }
})