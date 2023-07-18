const express = require("express");
const app = express();
const WSServer = require("express-ws")(app);
const aWss = WSServer.getWss();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const fs = require("fs");
const base64Img = require('node-base64-img');
const path = require("path");
const db = require('mongoose');
const authRouter = require("./comps/authRouter");
const friendsRouter = require("./comps/friendsRouter");
const fileRouter = require("./comps/fileRouter");
const jwt = require("jsonwebtoken");
const {secret} = require("./config");
const User = require("./models/User");
const Message = require("./models/Message");
const wsutils = require("./utils/wsutils");
const authMiddleware = require("./middleware/authMiddleware");
const fileUpload = require("express-fileupload");

app.use(cors());
app.use(fileUpload({}))
app.use(express.json());
app.use('/auth', authRouter);
app.use('/friends', friendsRouter);
app.use('/file', fileRouter);
app.use('/images', express.static('images'));


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
      case "delete":
        msg.userId = wsAuthMiddleware(msg)
        deleteHandler(ws, msg);
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

  if(msg.type == "img"){
    let name = Date.now().toString()
    try{const response = await base64Img(msg.body, path.join(__dirname, "images"), name, {type: 'png'})}
    catch(e){
      return;
      ;}
    const message = new Message({
      from: senderId,
      to: receiverId,
      body: JSON.stringify("http://localhost:5000/" + "images/" + `${name}.png`),
      type: "img"
    })
    let savedMsg = await message.save();
    msg._id = savedMsg._id.toString();
    msg.time = savedMsg.time;
    msg.body = savedMsg.body;
    sendMsg(msg)
  } else{
    const message = new Message({
      from: senderId,
      to: receiverId,
      body: msg.body,
      type: "text"
    })
    let savedMsg = await message.save();
    msg._id = savedMsg._id.toString();
    msg.time = savedMsg.time;
    sendMsg(msg)
  }

  async function sendMsg(msg){
    sendToUser(ws, msg, senderId);
    sendToUser(ws, msg, receiverId);
  } 
}

async function deleteHandler(ws, msg){
  const from = ((await User.findOne({username:msg.from}))._id).toString();
  const to = ((await User.findOne({username:msg.to}))._id).toString();
  // msg._id = ((await Message.findOneAndDelete({from: from, to: to, time: msg.time}))._id).toString()
  await Message.deleteOne({_id: msg._id})
  sendToUser(ws, msg, from);
  sendToUser(ws, msg, to);
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

