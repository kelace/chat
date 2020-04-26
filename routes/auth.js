const bcrypt = require("bcrypt");
const db = require("../db");
const passport = require("passport");

async function register(req, res) {
  const name = req.body.name;
  const password = req.body.password;

  const query = "SELECT * FROM `users` WHERE name = ? AND password = ?";

  try {
    const result = await db.query(query, [name, password]);

    if (result[0].length) {

      res.status(500).json({
  
        title: "Пользователь уже зарегистрирован",
      });
      return;
    }

    if (result[0].length === 0) {

      const query = "INSERT INTO `users` (name, password) VALUES (?, ?)";
      try {
        const result = await db.query(query, [name, password]);

        
        req.login({ user_id: result[0].insertId, user_name: name }, function (err) {
          if (err) {
            return;
          }

          res.status(200).send();
        
        });
      } catch (error) {
        res.status(500).json({
    
          title: "Не удалось зарегистировать",
        });
      }
    }
  } catch (error) {
    res.json({
      status: "error",
      title: "Не удалось зарегистировать",
    });
    return;
  }
}

async function login(req, res) {
  console.log("as");
  const name = req.body.name;
  const password = req.body.password;

  const query = "SELECT * FROM `users` WHERE name = ? AND  password = ?";

  try {
    const result = await db.query(query, [name, password]);
   

    if(result[0].length){
      req.login(
        { user_id: result[0][0].id, user_name: result[0][0].name },
        function () {
          res.status(200).json({
       
          });
        }
      );
    }else{
      res.status(500).json({
   
        message: "Пользователь не зарегистрирован",
      });
    }


  } catch (error) {
 
    res.status(500).json();
  }
}

function logout(req, res) {
  req.session.destroy(function (err) {
    res.json({
      status: "ok",
    });
  });
}

module.exports = {
  register,
  login,
  logout,
};
