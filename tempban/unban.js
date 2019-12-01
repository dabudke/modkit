// Get event emmitter.
const events = require('events'), emitter = new events.EventEmitter;
// Get ban database and date.
let database = require('./database'), date = new Date, i;

// Check for expired bans.
for (i = 0; i <= database.length(); i++) {
    if (database[i].time >= date.getTime()) {
        emitter.emit('unban', (database[i].user, database[i].guild, i));
    }
}

// Check for expired bans every minute.
for (;;) {
    setTimeout(() => {
        // Refresh date and database.
        date = new Date, database = require('./database.json');
        // Check for expired bans.
        for (i = 0; i <= database.length(); i++) {
            if (database[i].time >= date.getTime()) {
                emitter.emit('unban', (database[i].user, database[i].guild, i));
            }
        }
    }, 30000);
}