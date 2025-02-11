import {WebSocket, WebSocketServer } from "ws"
import  jwt, { JwtPayload }  from "jsonwebtoken";
import { JWT_SECERT } from "@repo/backend-common/config";



const wss = new WebSocketServer({ port: 8081 });

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}

const users :User[]=[];

const checkUser = (token:string):string | null =>{
  try{
    const decoded=jwt.verify(token, JWT_SECERT);
    if(typeof decoded=="string"|| !decoded.userId) return null;
    return decoded.userId; 
  }catch(e){
    return null;
  }
}


wss.on('connection', function connection(ws,request) {
  console.log("New WebSocket connection established.");

  const url = request.url;
  if(!url){
    return;
  }

  const queryParams = new URLSearchParams(url.split('?')[1]);

  const token = queryParams.get('token') || "";

  const userId = checkUser(token)
 

  if(!userId){
    ws.close();
    return
  }

  if(userId==null) return null;

  users.push({
    userId,
    rooms:[],
    ws
  })
  console.log("User added:", users);



  ws.on('message',function message(data){
    console.log(data)
          const parsedData = JSON.parse(data as unknown as string);
          console.log(parsedData)
           if(parsedData.type === "join_room"){
            const user = users.find(x=>x.ws===ws);
            if (user) {
              user.rooms.push(parsedData.roomId);
              console.log(`User ${user.userId} joined room ${parsedData.roomId}`);
            } else {
              console.error("User not found while joining room");
            }
            user?.rooms.push(parsedData.roomId);
           }

           if(parsedData.type === "leave_room"){
            const user = users.find(x=>x.ws===ws);
            if(!user) return ;
            user.rooms=user.rooms.filter(room=>room!==parsedData.roomId)
           }

           if (parsedData.type === "chat") {
            const roomId = parsedData.roomId;
            const message = parsedData.message;
        
            users.forEach(user => {
                if (user.rooms.includes(roomId)) {
                    try {
                        user.ws.send(JSON.stringify({
                            type: "chat",
                            message: message,
                            roomId
                        }));
                    } catch (error) {
                        console.error("Error sending message:", error);
                    }
                }
            });
        }


  }); 
});