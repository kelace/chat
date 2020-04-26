const bcrypt = require("bcrypt");
const db = require("../db");

function getUsers(params) {}

async function initial(req, res) {
  if (req.isAuthenticated()) {
    const user_id = req.user.user_id;

    const query_offers =
      "SELECT sender,sender_name FROM `offers` WHERE receiver = ?";
    const query_friends =
      "SELECT DISTINCT  U.name, U.id  FROM `friends`, `users` U WHERE CASE WHEN userID1 = ? THEN U.id = userID2  WHEN userID2 = ? THEN U.id  = userID1 END";



    const result = await db.query(query_offers, user_id);
    const result_friends = await db.query(query_friends, [user_id, user_id]);
    const friends = result_friends[0];
    const offers = result[0];

    console.log(result_friends[0]);

    res.render("index", {
      sender: offers,
      friends: friends,
    });

    return;
  }

  res.render("auth");
}

module.exports = {
  initial,
};
