import { EventEmitter } from "../utils/events";

export class UsersComponent extends EventEmitter {
  constructor() {
    super();
    this.el = document.querySelector(".side__users");
    this.currentActive = null;
    this.bindEvents();
  }

  clickHandler(e) {
    if (!e.target.classList === "friend") {
      return;
    }

    const id = e.target.dataset.userId;

    this.emit("changeDialog", id);

    if(window.innerWidth < 576){

      this.emit("hideSidebar");

    }

    if(!this.currentActive){
      this.currentActive = e.target;
    }
    
    
    this.currentActive.classList.remove('active');
    this.currentActive = e.target;
    this.currentActive.classList.add('active');
    
  }

  createUser(data){
    console.log(data)
    const friend = document.createElement('div');
    friend.classList.add('friend');
    friend.setAttribute('data-user-id', data.id);
    friend.setAttribute('data-user-name', data.name);
    friend.innerText= data.name;

    this.el.appendChild(friend);
    

  }

  bindEvents() {
    if(this.el){
      this.el.addEventListener("click", this.clickHandler.bind(this));
    }
    
  }
}

export default inputView;
