const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./db.js");
const path = require("path");
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const auth = require("./routes/auth");
const main = require("./routes/index");
const users = require("./routes/user");
const io = require("./socket");
const passportSocketIo = require("passport.socketio");
const MySQLStore = require("express-mysql-session")(session);
const messages = require("./routes/messages");


const connectedUsers = require("./connected-users");


const sessionStore = new MySQLStore({} /* session store options */, db);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "assets")));
app.use(flash());
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: false,
    store: sessionStore,
  })
);

io.use(
  passportSocketIo.authorize({
    key: "connect.sid",
    secret: "keyboard cat",
    store: sessionStore,
    passport: passport,
  })
);

io.use((socket, next) => {
  next();
});

io.on("connection", function (socket) {
  connectedUsers[socket.request.user.user_id] = socket.id;

  socket.on("disconnect", function (reason) {
    delete connectedUsers[socket.request.user.user_id];
  });
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

app.get("/", main.initial);

app.get("/get-users-data", users.getUsersData);
app.post("/register", auth.register);
app.post("/login", auth.login);
app.post("/logout", auth.logout);
app.post("/find-users", users.findUser);
app.post("/offer-friend", users.offer);
app.post("/offer-accepted/:id", users.accept);
app.post("/offer-declined/:id", users.decline);
app.get("/get-messages/:id", messages.getMessages);
app.post("/send-message/:id", messages.sendMessage);

app.listen(3000, function () {
  console.log("server running");
});
