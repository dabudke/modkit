const events = require('events');
const emitter = new events.EventEmitter;
const timeout = require('timeout.json');

for (;;) {
    setTimeout(() => {
        emitter.emit("event");
    }, timeout);
}