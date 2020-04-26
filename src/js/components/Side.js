export default class Side {
    constructor(){

        this.el = document.querySelector('.side');

    }

    hide(){

        this.el.classList.add('side_hide');

    }

    show(){
        this.el.classList.remove('side_hide');
    }
}