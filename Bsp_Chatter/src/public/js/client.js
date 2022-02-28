const socket = io();

// logMessage für Debug-Zwecke
socket.on('logMessage', msg => {
    console.log(msg);
});

function logMessage(msg) {
    socket.emit('logMessage', msg);
}

// Nutzer beim Server anmelden
function joinRoom(userName) {
    socket.emit('joinRoom', userName);
}

socket.on('userJoined', data => {
    welcomeUser(data.name);
    updateUserList(data.nameList);
});

// Nachricht senden
function sendMessage(msg) {
    socket.emit('sendMessage', msg);
}

socket.on('sendMessage', msg => {
    addMessage(msg);
})

// Nutzer verabschieden
socket.on('userLeft', data => {
    removeUser(data.name);
    updateUserList(data.nameList);    
});