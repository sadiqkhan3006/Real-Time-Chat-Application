import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });
let userCount = 0;
let allSockets = [];
wss.on("connection", (socket) => {
    allSockets.push(socket);
    //console.log(socket);
    userCount = userCount + 1;
    socket.send("connected!!");
    socket.on("message", (message) => {
        console.log("message recieved " + message.toString())
        for (let i = 0; i < allSockets.length; i++) {
            allSockets[i]?.send("from server: " + message.toString());
        }

    })
    //console.log(userCount);
})