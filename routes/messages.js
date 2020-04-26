const db = require("../db");
const connectedUsers = require("../connected-users");
const io = require("../socket");

async function getMessages(req, res) {
  const userId = req.user.user_id;
  const friendId = req.params.id;
  console.log(userId);
  console.log(friendId);

  const query =
    "SELECT sender,message FROM `messages` WHERE sender = ? AND receiver = ? OR sender = ? AND receiver = ?";

  const result = await db.query(query, [userId, friendId, friendId, userId]);

  const messages = sortMessages(result[0], userId);

  res.status(200).json(messages);
}

async function sendMessage(req, res) {
  const userId = req.user.user_id;
  const friendId = req.params.id;
  const socketId = connectedUsers[friendId];

  const query =
    "INSERT INTO `messages` (sender, receiver, message) VALUES (?, ?, ?)";

  const result = await db.query(query, [userId, friendId, req.body.text]);

  if(connectedUsers[friendId]){

   io.to(socketId).emit('messageReceive',{

     sender_id:req.user.user_id,
     text:req.body.text

   });
   
 }

  res.status(200).json({
    textMessage: req.body.text,
  });
}

function sortMessages(messages, userId) {
  const sortedMessages = messages.map((element) => {
    if (element.sender === userId) {
      return { whos: "your", message: element.message };
    } else {
      return { whos: "friend", message: element.message };
    }
  });

  return sortedMessages;
}



module.exports = {
  getMessages,
  sendMessage,
};
