export class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, handler) {
    const events = this.events;

    if (events[event] === undefined) {
      events[event] = [handler];
      return;
    }
    events[event].push(handler);
  }

  emit(event, arg) {
    const events = this.events;

    if (!events[event]) {
      return;
    }

    events[event].forEach(element => {
      element(arg);
    });
  }
}
