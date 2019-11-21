const events = require('events');
const emitter = new events.EventEmitter;

for (;;) {
    setTimeout(() => {
        emitter.emit("event");
    }, 3600000);
}