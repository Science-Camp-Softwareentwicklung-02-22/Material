const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Server starten
server.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));

// statische Website bereitstellen
app.use(express.static(path.join(__dirname, 'public')));

// Liste aller Nutzer
let userList = [];
let socketList = [];

// Client-Server-Kommunikation
io.on('connection', socket => {
    console.log('New connection...');

    // logMessage für Debug-Zwecke
    socket.emit('logMessage', "Hallo Client!");

    socket.on('logMessage', msg => {
        console.log(msg);
    });

    // Spieler beim Server anmelden
    socket.on('joinRoom', userName => {
        userList.push(userName);
        socketList.push([userName, socket.id]);

        io.emit('userJoined', { name: userName, nameList: userList });
    });

    // Nachricht an alle anderen Nutzer weiterleiten
    socket.on('sendMessage', data => {
        socket.broadcast.emit('sendMessage', data);
    });

    // Nutzer verlässt den Chat
    socket.on('disconnect', () => {
        let i = socketList.findIndex(element => element[1] == socket.id);

        if (i != -1) {
            let userName = userList[i];

            userList.splice(i, 1);
            socketList.splice(i, 1);

            io.emit('userLeft', { name: userName, nameList: userList });
        }
    });
});