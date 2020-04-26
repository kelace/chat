import { EventEmitter } from "../utils/events";

export default class OffersComponent extends EventEmitter{
  constructor() {
    super();
    this.offersBlock = document.querySelector(".side__offers");
    this.bindViewEvents();
  }
  addOffer(newElement) {
    this.offersBlock.appendChild(newElement);
  }

  removeOffer() {}

  createOffer(data) {
    const offer = data;
    const offerBlock = document.createElement("div");
    const name = document.createElement("div");
    const buttonAccept = document.createElement("button");
    const buttonDeclined = document.createElement("button");

    offerBlock.classList.add("side__offer");
    name.classList.add("user");
    name.setAttribute('data-user-id', data.sender_id);
    name.setAttribute('data-user-name', data.sender_name);
    name.innerText = data.sender_name;
    buttonAccept.setAttribute("href", "/offer-accepted/" + data.sender_id);
    buttonAccept.innerText = "Принять";
    buttonAccept.classList.add('accept-js');
    buttonAccept.classList.add('btn');
    buttonAccept.classList.add('btn_search');
    buttonDeclined.setAttribute("href", "/offer-declined/" + data.sender_id);
    buttonDeclined.innerText = "Отказать";
    buttonDeclined.classList.add('decline-js');
    buttonDeclined.classList.add('btn');
    buttonDeclined.classList.add('btn_search');

    name.appendChild(  buttonAccept);
    name.appendChild(buttonDeclined);

    offerBlock.appendChild(name);


    return offerBlock;
  }

  offerReceived(data) {
    const offerElement = this.createOffer(data);
    this.addOffer(offerElement);
  }
  bindViewEvents() {
    if(this.offersBlock){
      this.offersBlock.addEventListener("click", (e) => {
        e.preventDefault();
        if (e.target.tagName === "BUTTON") {
         
          const parentEl = e.target.parentElement;
          const name = parentEl.getAttribute('data-user-name');
          const id = parentEl.getAttribute('data-user-id');
          const url = e.target.getAttribute("href");
          $.ajax({
            type: "POST",
            url: url,
            success: (data) => {
              parentEl.querySelector(".accept-js").disabled = true;
              parentEl.querySelector(".decline-js").disabled = true;
              $(parentEl).fadeOut();
              if(data.choice === 'accepted'){
                this.emit('accept', {id:id, name:name});
              }
              
            },
          });
        }
      });
    }

  }
}
