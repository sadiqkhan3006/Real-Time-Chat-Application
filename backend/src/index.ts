import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8080 });
interface User {
    socket: WebSocket,
    room: string,
    username: string,
}
interface JoinPayload {
    roomid: string;
    username: string;
}

interface ChatPayload {
    message: string;
}
type Input = { type: "join"; payload: JoinPayload } | { type: "chat"; payload: ChatPayload };
let allSockets: User[] = [];
const allRooms = new Map<string, Set<User>>()
wss.on("connection", (socket) => {
    let currentRoom: string = "";
    let userName: string = "";
    socket.on("message", (message) => {
        let parsedMessage: Input = JSON.parse(message.toString());

        if (parsedMessage.type === "join") {

            const { roomid, username } = parsedMessage.payload;
            currentRoom = roomid;
            userName = username;
            if (!allRooms.has(roomid)) {
                allRooms.set(roomid, new Set())
            }
            allRooms.get(roomid)!.add({
                socket,
                room: roomid,
                username
            });
            // allSockets.push({
            //     socket,
            //     room: parsedMessage?.payload.roomid,
            //     username: parsedMessage.payload.username,
            // })
        }
        if (parsedMessage.type === "chat" && currentRoom.length !== 0) {
            const { message } = parsedMessage.payload;
            const users: Set<User> | undefined = allRooms.get(currentRoom);
            if (!users) return;
            users.forEach((user) => {
                if (user.socket != socket) {
                    user.socket.send(`Message from ${userName}: ${message}`);
                }
            })
            // let currentRoom = allSockets.find((user) => {
            //     return user.socket == socket
            // })?.room
            // //now sending all the user with this room//
            // let sameroomuser: User[] = allSockets.filter((user) => {
            //     return ((user.room == currentRoom) && (user.socket !== socket));
            // })
            // //now send //
            // sameroomuser.forEach((user) => {
            //     user.socket.send("message from " + parsedMessage.payload.username + "-" + parsedMessage.payload.message);
            // })
        }
    })
})

//join room //
//type:join,payload{roomid,username}
//type:chat,payload{message,username}
/*{
    "type":"join",
    "payload":{
        "username":"sadiq",
        "roomid":"123"
    }
}*/