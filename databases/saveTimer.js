import { EventEmitter } from 'events';
const emitter = new EventEmitter

for (;;) {
    setTimeout(() => {
        emitter.emit('save')
    }, 900000)
}