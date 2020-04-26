export default class SearchComponent {
  constructor() {
    this.inputView = document.querySelector(".side__search form");

    this.inputModel = {
      isResponded: true,
    };

    this.elem = document.querySelector(".side__search-result"),
 
    this.bindEvents();
  }

  sendRequest(buttonView,data) {
    const url = data;

    $.ajax({
      type: "POST",
      url: data,
      success:  (result) =>{
      },
    });
  }

  createButton(href) {
    const button = document.createElement("button");
    button.setAttribute("href", `/offer-friend?user_id=${href}`);
    button.classList.add('btn');
    button.classList.add('btn_search');
    button.classList.add('ml');
    button.innerText = " добавить";

    button.addEventListener("click",  (e) =>{
      e.preventDefault();
      e.currentTarget.disabled = true;
      this.sendRequest(button,button.getAttribute("href"));
    });

    return button;
  }

  addFindedUsers(users) {
    const view = this.elem;
    this.removeAll();
    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      view.appendChild(this.createUser(user));
    }
  }
  removeAll() {
    const view = this.elem;

    view.innerHTML = "";
  }

  createUser(user) {
    const findedUser = document.createElement("div");
    findedUser.innerHTML = user.name;
    findedUser.classList.add("side__search-result-item");
    findedUser.classList.add("friend");

    const button = this.createButton(user.id);
    findedUser.appendChild(button);
    return findedUser;
  }

  bindEvents() {
    if (this.inputView) {
      this.inputView.addEventListener("input",  (e) =>{
        if (this.inputModel.isResponded) {
          this.inputModel.isResponded = false;
          this.requestUser($(e.currentTarget).serialize());
        }
      });
    }
  }

  requestUser(value) {
    console.log(value);

    $.ajax({
      data: value,
      type: "POST",
      url: "/find-users",
      success:  (data) =>{
      
     
          this.inputModel.isResponded = true;
    
         this.addFindedUsers(data.users);
        

       
      },
    });
  }
}
