//TODO: nodemon y crear scripts
const http = require('http');
const express = require('express');
const cors = require('cors');


//config .env
require('dotenv').config();

//Creación de la app de express
const app = express();
app.use(cors());

//Creamos el servidor
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT);

server.on('listening', () => {
    console.log(`Servidor escuchando en puerto ${PORT}`)
});

//Config socket.io
const io = require('socket.io')(server, {
    cors: {
        origin: '*'//desde donde pueden acceder * es todos los sitios
    }
});

io.on('connection', (socket) => {
    console.log('se ha conectado un nuevo cliente');
    //cada socket tiene un id asi puedo saber quien se ha conectado y gestionar el usario que se conecta
    // ejer: mando un mensaje a todos los clientes menos al que se conecta par ello .broadcast
    socket.broadcast.emit('mensaje_chat', {
        username: 'INFO',
        message: 'Se ha conectado un nuevo usuario'
    });

    //actualizar el numero de clientes conectados
    io.emit('clientes_conectados', io.engine.clientsCount);

    socket.on('mensaje_chat', (data) => {
        //voy a emitir el mensaje a todos los clientes conectados
        io.emit('mensaje_chat', data);
    });

    //saber cuando el socket se desconecta, el usuario que se ha desconectado
    socket.on('disconnect', () => {
        io.emit('mensaje_chat', {
            username: 'INFO',
            message: 'Se ha desconectado un usuario 👋🏻'
        });
        io.emit('clientes_conectados', io.engine.clientsCount);
    });
});
