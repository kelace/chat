import {EventEmitter} from '../utils/events';

export class messagesComponent extends  EventEmitter{
  constructor(messages) {
    super();
    this.el = this.createElement(messages);
  }

  createElement(messages) {
    const messElement = document.createElement("div");
    const topLine = document.createElement('div');
    const hamburger = document.createElement('div');
    messElement.classList.add("messages");

    hamburger.classList.add('hamburger');
    topLine.classList.add('message_top');

    topLine.appendChild(hamburger);
    messElement.appendChild(topLine);

    hamburger.addEventListener('click', function (e) {
      
      const side = document.querySelector('.side');
      side.classList.remove('side_hide');

    })

    messages.forEach((element) => {
      const line = document.createElement("div");
      if (element.whos === "your") {
        line.className = "message_line message_own";
      } else {
        line.className = "message_line message_friend";
      }

      const message = document.createElement("div");
      message.classList.add("message");
      message.innerText = element.message;


      line.appendChild(message);
      messElement.appendChild(line);
    });
    return messElement;
  }

  render(args) {
    const element = this.el;
   
    args.forEach((element) => {
      element.appendChild(element);
    });
 
  }
}
