import $ from "jquery";
import OffersComponent from "./components/offers.js";
import { UsersComponent } from "./components/user.js";
import ChatComponent from "./components/chat";
import AuthComponent from "./components/auth.js";
import SearchComponent from "./components/search";
import Side from "./components/Side";

const state = {
  users: {},
}

const authBlock = new AuthComponent();
const chat = new ChatComponent(state.users);
const userSide = new UsersComponent(state.users);
const offers = new OffersComponent();
const search = new SearchComponent();
const side = new Side();

userSide.on("changeDialog", chat.onChange.bind(chat));

userSide.on('hideSidebar', side.hide.bind(side));

const socket = io("http://localhost:4000");

offers.on('accept', userSide.createUser.bind(userSide) );

socket.on("offer", function (data) {
  
  offers.offerReceived(data)

});

socket.on('offerAccept', function (data) {

  userSide.createUser(data);
  
})

socket.on("messageReceive", function (data) {

  chat.users[data.sender_id].messages.push({
    whos: "friend",
    message: data.text,
  });
  chat.render(data.sender_id, data.text);
  
});

socket.emit("auth", "atuhted");

