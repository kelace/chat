const db = require("../db");
const io = require("../socket");
const connectedUsers = require("../connected-users");

async function getUsersData(req, res) {
  const id = req.user.user_id;
  const query =
    "SELECT DISTINCT users.name,users.id FROM `users` WHERE users.id IN (SELECT userID1 from `friends` WHERE userID1 != ? UNION SELECT userID2 FROM `friends` WHERE userID2 != ?)";

  ("SELECT  DISTINCT COUNT(messages.view), usersdata.id , usersdata.name FROM `messages` INNER JOIN (SELECT DISTINCT users.name,users.id FROM `users` WHERE users.id IN (SELECT userID1 as friend from `friends` WHERE userID1 != 10 UNION SELECT userID2 FROM `friends` WHERE userID2 != 10)) AS usersdata ON messages.view = 0 ");

  const result = await db.query(query, [id, id]);
  const sortedUsers = sortUsers(result[0]);

  res.status(200).json({
    users: sortedUsers,
  });
}

function sortUsers(array) {
  const users = {};

  array.forEach((element) => {
    if (users[element.sender]) {
      return;
    }

    users[element.sender] = {};

    users[element.sender].name = element.name;
    users[element.sender].viewes = element.views;
  });

  return users;
}

async function findUser(req, res) {
  const userName = req.body.username;
  const id = req.user.user_id;

  if (userName === "") {
    res.status(200).json({
      users: [],
    });
    return;
  }

  const query =
    "SELECT name, id FROM `users` WHERE id NOT IN  ((SELECT userID1 FROM `friends` WHERE friends.userID2 = ? UNION SELECT userID2 FROM `friends` WHERE friends.userID1 = ? )) AND NOT id IN(SELECT sender FROM `offers` WHERE offers.receiver = ? UNION SELECT receiver FROM `offers` WHERE offers.sender = ? ) AND id != ? AND name LIKE ?";
  let result = await db.query(query, [id, id, id, id, id, userName + "%"]);
  console.log(result[0]);
  if (result) {
    res.status(200).json({
      users: result[0],
    });
  }
}

async function offer(req, res) {
  const sender = req.user.user_id;
  const sender_name = req.user.user_name;
  const reciver = req.query.user_id;
  const socketId = connectedUsers[reciver];


  const query =
    "INSERT INTO `offers` (sender,sender_name,receiver)  VALUES (?,?,?) ";

  const result = await db.query(query, [sender, sender_name, reciver]);

  if (connectedUsers[reciver]) {
    io.to(socketId).emit("offer", {
      sender_name: req.user.user_name,
      sender_id: req.user.user_id,
    });
  }

  if (result) {
    res.status(200).json({
    });
  }
}

async function accept(req, res) {
  const receiver = req.user.user_id;
  const sender = req.params.id;
  const socketId = connectedUsers[sender];

  const query = "INSERT  INTO `friends` (userID1,userID2) VALUES(?,?)";
  const query_delete = "DELETE FROM `offers` WHERE sender = ? AND receiver = ?";

  const result = await db.query(query, [receiver, sender]);
  const result_delte = await db.query(query_delete, [sender, receiver]);

  if (connectedUsers[sender]) {
    io.to(socketId).emit("offerAccept", {
      name: req.user.user_name,
      id: req.user.user_id,
    });
  }

  res.status(200).json({
    choice: "accepted"
  });
}

async function decline(req, res) {
  const query = "DELETE FROM `offers`WHERE sender = ? AND receiver = ?";
  const senderId = req.params.id;
  const receiver = req.user.user_id;
  const result = await db.query(query, [senderId, receiver]);

  res.status(200).json({
    choice: "declined",
  });
}

module.exports = {
  findUser,
  offer,
  accept,
  decline,
  getUsersData,
};
