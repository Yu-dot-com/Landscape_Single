// @ts-ignore'
import { setupWSConnection } from "y-websocket/bin/utils";
import { WebSocketServer } from "ws";
import type { WebSocket as WSWebSocket } from "ws";
import jwt from "jsonwebtoken";
import Redis from "ioredis";


const wss = new WebSocketServer({
  port: 1234,
});


const redisSubscriber = new Redis(
  process.env.REDIS_URL as string
);


type ConnectionInfo = {
  userId: string;
  room: string;
};


const connections = new Map<
  WSWebSocket,
  ConnectionInfo
>();



function disconnectUser(
  userId:string,
  projectId:string
){

  const room = `landscape-room-${projectId}`;


  for(const [conn,info] of connections){

    if(
      info.userId === userId &&
      info.room === room
    ){

      console.log(
        "Kicking user:",
        userId
      );

      conn.close();

      connections.delete(conn);
    }

  }

}



redisSubscriber.subscribe(
  "project-events"
);


redisSubscriber.on(
  "message",
  (channel,message)=>{


    const event = JSON.parse(message);


    if(event.type === "USER_REMOVED"){

      disconnectUser(
        event.userId,
        event.projectId
      );

    }

  }
);




wss.on(
"connection",
(conn,req)=>{


  const url = new URL(
    req.url ?? "",
    "http://localhost"
  );


  const room =
    url.pathname.replace("/","");


  const token =
    url.searchParams.get("token");



  if(!token){

    conn.close();
    return;

  }



  let user;
console.log("JWT_SECRET =", process.env.JWT_SECRET);
console.log("TOKEN =", token);

  try{

    user = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );


  }catch (error) {
  console.error(error);
  conn.close();
  return;
}


  const userId =
    (user as any).id;



  console.log(
    "CONNECTED",
    userId,
    room
  );



  connections.set(
    conn,
    {
      userId,
      room
    }
  );



  conn.on(
    "close",
    ()=>{
      connections.delete(conn);
    }
  );



  setupWSConnection(
    conn,
    req
  );


});


console.log(
 "Yjs websocket server running yuyu on port 1234"
);