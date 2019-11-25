// Get event emmitter.
const events = require('events'), emitter = new events.EventEmitter;
// Get ban database and date.
let database = require('./database'), date = new Date, i;

// Check for expired bans.
for (i = 0; i <= database.length(); i++) {
    if (database[i].year >= date.getFullYear()) {
        if (database[i].month >= date.getMonth()) {
            if (database[i].day >= date.getDate()) {
                if (database[i].hour >= date.getHours()) {
                    if (database[i].minute >= date.getMinutes()) {
                        emitter.emit('unban', (database[i].ban));
                    }
                }
            }
        }
    }
}

// Check for expired bans every minute.
for (;;) {
    setTimeout(() => {
        // Refresh date and database.
        date = new Date, database = require('./database.json');
        // Check for expired bans.
        for (i = 0; i <= database.length(); i++) {
            if (database[i].year >= date.getFullYear()) {
                if (database[i].month >= date.getMonth()) {
                    if (database[i].day >= date.getDate()) {
                        if (database[i].hour >= date.getHours()) {
                            if (database[i].minute >=date.getMinutes()) {
                                emitter.emit('unban', (database[i].user));
                            }
                        }
                    }
                }
            }
        }
    }, 30000);
}