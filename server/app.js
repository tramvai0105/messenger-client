const express = require("express");
const app = express();
const WSServer = require("express-ws")(app);
const aWss = WSServer.getWss();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const db = require('mongoose');
const authRouter = require("./comps/authRouter");
const friendsRouter = require("./comps/friendsRouter");
const jwt = require("jsonwebtoken");
const {secret} = require("./config");
const User = require("./models/User");
const Message = require("./models/Message");
const wsutils = require("./utils/wsutils");
const authMiddleware = require("./middleware/authMiddleware");

app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);
app.use('/friends', friendsRouter);

async function mongoConnection() {
  await db.connect('mongodb://127.0.0.1:27017/soc');
}

app.post("/mess", async function(req, res){
  try{
    const {from, to, text} = req.body;
    const message = new Message({
    from, to, text
    })
    await message.save()
    return res.json({message: "Сообщение отправлено"})
  } catch(e){
    console.log(e);
  }
})

app.post("/users", async (req, res)=>{
  var users = await User.find({});

  if(!users){
    res.status(400).json({message: "Ошибка получения пользователей"})
  }
  res.json(users);
})

function wsAuthMiddleware(msg){
  const decodedData = jwt.verify(msg.token, secret);
  return decodedData.id;
}

app.ws("/", (ws, req) => {
  ws.on("message", (msg) => {
    msg = JSON.parse(msg);
    switch (msg.method) {
      case "connection":
        msg.userId = wsAuthMiddleware(msg)
        connectionHandler(ws, msg);
        break;
      case "message":
        msg.userId = wsAuthMiddleware(msg)
        messageHandler(ws, msg);
        break;
    }
  });
});

async function connectionHandler(ws, msg){
  const id = msg.userId;
  const messages_to = await Message.find({to:id});
  const messages_from = await Message.find({from:id});
  let messages = [...messages_from, ...messages_to];
  messages = await wsutils.setNamesInMsgs(messages);
  ws.id = id;
  msg.msgsData = messages;
  ws.send(JSON.stringify(msg));
};

async function messageHandler(ws, msg){
  const senderId = msg.userId;
  const receiverId = ((await User.findOne({username:msg.to}))._id).toString();
  const message = new Message({
    from: senderId,
    to: receiverId,
    text: msg.text,
  })
  msg.time = Date.now();
  sendToUser(ws, msg, senderId);
  sendToUser(ws, msg, receiverId);
  await message.save();
}

const sendToUser = (ws, msg, userId) => {
  aWss.clients.forEach((client) => {
    if (client.id === userId) {
      client.send(JSON.stringify(msg));
    }
  });
}

const broadcastConnection = (ws, msg) => {
  aWss.clients.forEach((client) => {
    if (client.id === msg.id) {
      client.send(JSON.stringify(msg));
    }
  });
};

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/", (req, res) => {});

function start(){
  try{
    mongoConnection();
    app.listen(PORT, () => console.log(`server started on PORT ${PORT}`));
  } catch(e){
    console.log(e);
  }
  
}

start();

