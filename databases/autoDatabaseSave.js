const ms = require('./timeout.json')[1];
const Events = require('events');
const Emitter = new Events.EventEmitter();

while (true) {
    setTimeout(function() {
        Emitter.emit('save')
    }, ms)
}