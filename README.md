# 2025-TPIN-1-G01

Proyecto interdisciplinario
Primer cuatrimestre
Título de la propuesta: Preguntados                                                Grupo: 1 División: A

Integrantes:
Facundo Montivero
Tomas Nisenbom
Bautista Cogorno
Ivan Nieloud
Tomas Clur




Descripción de la propuesta

Armaremos un juego de conocimiento basado en el preguntados donde los jugadores competiran entre si respondiendo preguntas de distintas categorias. buscando demostrar quien es el que lleva mas conocimiento














Bocetos de la interfaz de la aplicación
Link al Canva: https://www.canva.com/design/DAGpYkAq3zw/GzH7kDfapcscrmC_woXlTQ/edit?utm_content=DAGpYkAq3zw&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
Alcance
crear propuesta divertida de jugar
diseño responsivo a distintas computadoras
Múltiples categorías de preguntas
manejo de usuarios con cuentas propias
Preguntas y respuestas, jugadores y sus puntajes en base de datos
Ranking de jugadores
Agregado y modificación de preguntas desde la app

Tareas
Investigación y redacción de preguntas y sus respuestas
Diseño de imagen y de la UI, y UX
Diseño de la base de datos 
creación de funciones de manejo de usuarios en bases de datos
funciones que permiten editar preguntas y respuestas fácilmente
comparación de puntajes a nivel global
Front-end del juego (HTML, CSS, JS)
Responsabilidades
Cogorno, Nieloud, Clur
Montivero, cogorno
Nieloud, Nisenbom
Nieloud, Nisenbom, Clur
Nieloud, nisenbom
nieloud
nisenbom, nieloud, montivero, clur

Diagrama Gantt
<img width="1213" height="612" alt="image" src="https://github.com/user-attachments/assets/8768bd3b-7cd8-4054-9124-a8bd83c67938" />



Diseño del juego
(los testeos no se limitan a las actividades propuestas, en caso de fallar un testeo se corrige el codigo y pasa a testeo de vuelta.)

Pensar login y registro. se deberá pensar cómo se implementará el inicio de sesión de los usuarios. Tanto las funciones de las operaciones como las etiquetas HTML y funciones del DOM para interactuar con dichas etiquetas
Armar login. Implementar las respectivas funciones del DOM y etiquetas HTML, pedidos del back y el front para armar el Login. 
Testear Login: 
iniciando sesión, cerrándola, e iniciando sesión con usuarios inexistentes.
chequear que se guarde bien en en array
insertar datos inválidos
borrar un usuario e intentar loguearse con su cuenta
probar iniciar sesión con una cuenta borrada
Armar Registro. Implementar las respectivas funciones del DOM y etiquetas HTML, pedidos del back y el front para armar para armar el registro, el botón de cerrar sesión y borrar la cuenta propia
Testear Registro 
intentar registrarte con una cuenta existente e intentando registrarte normalmente
borrar una cuenta e intentar iniciar sesion con ella
crear algún usuario luego de haber borrado otro
intentar entrar con los datos de un usuario borrado
cerrar sesion e iniciar sesión con otro usuario, repetir
Funciones de los Admins Establecer ciertos usuarios (nosotros) como administradores los cuales van a tener acceso a la base de datos de categorías, preguntas y respuestas, y van a poder editarlas acordemente.
Testear Admins
Iniciar sesión con un usuario existente que NO sea un administrador y ver si tiene derechos de admin. 
Iniciar sesión con un usuario existente que sea un administrador y chequear que tengo sus derechos respectivos.
Intentar crear una categoría, pregunta, o respuesta que ya exista
Intentar borrar una categoría, pregunta, o respuesta que NO exista
borrar un usuario e intentar ingresar con el
borrar una pregunta y verificar que a sido borrada
crear una pregunta y verificar que a sido borrada
borrar una pregunta 2 veces
crear una pregunta 2 veces
Pensar Interfaz del Juego Se deberá pensar cómo se implementará las funciones de las operaciones como las etiquetas HTML y funciones del DOM a la interfaz del juego, el cual es un sistema de una pregunta y cuatro respuestas junto con la ruleta de distintas categorías y la corona, la cual permitiría elegir cualquier categoría deseada.
Preguntas y puntajes. El sistema de puntos funciona en base a qué tan rápido se responde la pregunta (limite de tiempo de 30 segundos) y si está en racha, es decir, cuantas preguntas correctas seguidas tiene. Comienza con un número de puntos fijos pero va aumentando o disminuyendo conforme avanza el juego (si se mantiene la racha o dependiendo de qué tan rápido responde)
Testeo de preguntas y puntajes
Chequear que cuando se seleccione una pregunta errónea no sume puntos 
Revisar que la fórmula de tiempo y de racha estén bien implementadas y que sumen ambas de manera acorde.
 Tabla de Puntaje Maximo Hacer una tabla de puntajes más altos de cada jugador
Diseño de Preguntas

Pensar las categorías que van a tener el juego y crear preguntas y respuestas de ejemplo.
Hacer el resto de las preguntas y respuestas del juego (150 preguntas y 600 respuestas total de ser posible)

Diseño visual de la app

Diseñar la página de preguntas y respuestas basándonos en los bocetos del canva y linekarlos con las etiquetas HTML y funciones del DOM de la interfaz del juego, junto con sus respectivos pedidos del front y back.
Diseñar la página la ruleta basándonos en los bocetos del canva y linekarlos con las etiquetas HTML y funciones del DOM de la interfaz del juego, junto con sus respectivos pedidos del front y back.
Implementar los diseños del boceto de la página de inicio con las etiquetas adecuadas del HTML y linkearlo adecuadamente con los pedidos del back y el front. Testear que los botones y eventos de la página se ejecuten adecuadamente





Primer entregable 
En este proyecto en particular, los entregables están definidos pero pueden aprovechar para poner como lo van a hacer en su proyecto en particular
Segundo entregable
Entrega final 
