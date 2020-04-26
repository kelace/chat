import { EventEmitter } from "../utils/events";
import { messagesComponent } from "./messages";

export default class ChatComponent extends EventEmitter {
  constructor(users) {
    super();
    this.el = document.querySelector(".chat");
    this.messages = {};
    this.users = users;
    this.currentSpeakerId = null;
  }

  onChange(id) {
    if (this.users[id]) {
      this.render(id);
      return;
    }

    this.requestMessages(id);
    this.render(id);
  }

  requestMessages(id) {
    const idFriend = id;
    const url = "/get-messages/" + id;
    console.log(url);
    const users = this.users;
    console.log(users);
    const render = this.render.bind(this);
    $.ajax({
      url: url,
      type: "GET",
      success: function (data) {
        setTimeout(() => {

          users[idFriend] = {};
          users[idFriend].messages = data;
          render(idFriend);

        }, 500);
      },
    });
  }

  sendMessage(id, text) {
    const url = "/send-message/" + id;
    console.log(id);
    $.ajax({
      url: url,
      type: "POST",
      data: { text: text },
      success: (data) => {
      
        this.users[id].messages.push({
          whos: "your",
          message: data.textMessage,
        });
        this.render(id);
      },
    });
  }

  render(id) {
    const chatInner = document.createElement("div");
    chatInner.classList.add("chat__inner");

    let chatContent;
    if (this.users[id]) {
      chatContent = new messagesComponent(this.users[id].messages).el;
    } else {
      chatContent = document.createElement("div");
      chatContent.className = "centred_x_y full_view";
      chatContent.innerHTML = `
        <div class = "loader"></div>

      `;
    }

    const chatForm = document.createElement("div");
    chatForm.classList.add("chat_from");

    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = e.target.textform.value;
      console.log(text);

      if (/^\s+$/.test(text) || text === "") {
        return;
      }
      this.sendMessage(id, text);
    });

    chatInner.appendChild(chatContent);

    if (this.users[id]) {
      const form = document.createElement("form");
      form.classList.add("form");

      const textarea = document.createElement("textarea");
      textarea.id = "textform";
      textarea.classList.add("textarea");

      const input = document.createElement("input");
      input.type = "submit";
      input.className = "btn btn_submit";
      input.value = "";

      form.appendChild(textarea);
      form.appendChild(input);

      chatForm.appendChild(form);
      chatInner.appendChild(chatForm);
    }

    this.el.innerHTML = "";
    this.el.appendChild(chatInner);

    if(chatContent.classList.contains('messages')){
      console.log(chatContent.scrollHeight);
      chatContent.scrollTo(0, chatContent.scrollHeight)
    }
    
  }


}
