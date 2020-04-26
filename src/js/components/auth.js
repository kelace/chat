import { EventEmitter } from "../utils/events";

export default class AuthComponent extends EventEmitter {
  constructor() {
    super();
    this.authBlock = document.querySelector(".auth-block");
    this.tabButtons = document.querySelector(".tabs");
    this.currentTab = document.querySelector(".tabs__button.active");
    this.currentForm = document.querySelector(".form_auth.active");
    this.registerError = document.querySelector(".register-js .errors-line");
    this.loginError = document.querySelector(".login-js .errors-line");
    this.logOutView = document.querySelector(".logout-js");

    this.init();
  }

  tabsHandler() {
    if (this.tabButtons) {
      this.tabButtons.addEventListener("click", (e) => {
        e.preventDefault();
        if (
          !e.target.classList.contains("tabs__button") &&
          e.target.classList.contains("active")
        ) {
          return;
        }

        this.currentTab.classList.remove("active");
        this.currentTab = e.target;
        this.currentTab.classList.add("active");

        this.currentForm.classList.remove("active");
        this.currentForm = document.querySelector(
          this.currentTab.getAttribute("href")
        );
        this.currentForm.classList.add("active");

        this.resetErrors();
      });
    }
  }

  submitHandler() {
    const registerForm = document.querySelector(".register-js");

    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        const inputs = e.currentTarget.elements;

        e.preventDefault();

        if (
          e.currentTarget.elements.confirm.value !==
          e.currentTarget.elements.password.value
        ) {
          this.registerError.innerText = "Пароли не совпадают";
          this.registerError.classList.remove("error_hidden");
          return;
        }

        for (let i = 0; i < inputs.length; i++) {
          if (!inputs[i].value.length) {
            this.registerError.innerText = "Пустые поля";
            this.registerError.classList.remove("error_hidden");
            return;
          }
        }

        if (!e.currentTarget.elements.name.value.length) {
          this.registerError.innerText = "Пустые поля";
          this.registerError.classList.remove("error_hidden");
          return;
        }

        $.ajax({
          data: $(e.currentTarget).serialize(),
          type: "POST",
          url: "/register",
          success: (data) => {
 
              window.location.href = "/";
            
        
            
          },
          error:(err) => {
            console.log(err)
            this.registerError.innerText = err.responseJSON.title;
            this.registerError.classList.remove("error_hidden");
          }
        });
      });
    }
  }

  loginSubmit() {
    const loginrForm = document.querySelector(".login-js");
    if (loginrForm) {
      loginrForm.addEventListener("submit", (e) => {
        const inputs = e.currentTarget.elements;
        e.preventDefault();

        if (!e.currentTarget.elements.name.value.length) {
          this.loginError.innerText = "Пустые поля";
          this.loginError.classList.remove("error_hidden");
          return;
        }

        for (let i = 0; i < inputs.length; i++) {
          if (!inputs[i].value.length) {
            this.loginError.innerText = "Пустые поля";
            this.loginError.classList.remove("error_hidden");
            return;
          }
        }

        $.ajax({
          data: $(e.currentTarget).serialize(),
          type: "POST",
          url: "/login",
          success: (data) => {
 
              window.location.href = "/";
          
          },
          error: (error) =>{
            this.loginError.innerText = error.responseJSON.message;
            this.loginError.classList.remove("error_hidden");
          }
        });
      });
    }
  }

  clickLogout() {
    if (this.logOutView) {
      this.logOutView.addEventListener("click", function (e) {
        e.preventDefault();
        $.ajax({
          type: "POST",
          url: "/logout",
          success: function (data) {
            window.location.href = "/";
          },
        });
      });
    }
  }

  resetErrors() {
    this.registerError.classList.add("error_hidden");
    this.loginError.classList.add("error_hidden");
  }

  inputsFocus() {
    if (this.authBlock) {
      this.authBlock.addEventListener("click", (e) => {
        if (e.target.classList.contains("input")) {
          this.resetErrors();
        }
      });
    }
  }

  init() {
    this.loginSubmit();
    this.tabsHandler();
    this.submitHandler();
    this.clickLogout();
    this.inputsFocus();
  }
}
