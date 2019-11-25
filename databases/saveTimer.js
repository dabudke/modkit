const ms = require('./timeout.json')[1];
const events = require('events');

for (;;) {
    setTimeout(() => {
        emitter.emit('save')
    }, 900000)
}