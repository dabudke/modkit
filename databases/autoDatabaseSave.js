const ms = require('./timeout.json')[1];
const events = require('events');
const emitter = new events.EventEmitter();

for (;;) {
    setTimeout(function() {
        emitter.emit('save')
    }, ms)
}