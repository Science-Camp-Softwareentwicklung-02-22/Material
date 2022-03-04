const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const PORT = process.env.PORT || 2000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Server starten
server.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));

// statische Website bereitstellen
app.use(express.static(path.join(__dirname, 'public')));

// Liste aller Nutzer
let userList = [];

function countClients(room) {
    return io.sockets.adapter.rooms.get(room).size
}

// Client-Server-Kommunikation
io.on('connection', socket => {
    console.log('New connection...');

    socket.on('logMessage', msg => {
        console.log(msg);
    });

    // Nutzer beim Server anmelden
    socket.on('joinRoom', (userName, room) => {
        userList.push([userName, socket.id]);
        socket.join(room)

        io.to(room).emit('update', countClients(room)) 

        socket.to(room).emit('logMessage', `${userName} entered the room`)
    });

    // Nutzer verlässt den Chat
    socket.on('disconnecting', () => {
        let i = userList.findIndex(element => element[1] == socket.id);

        if (i != -1) {
            for(let r of socket.rooms) {
                io.to(r).emit('logMessage', `${userList[i][0]} left the room`);
                io.to(r).emit('update', countClients(r)-1)
            }
        }
    });
});