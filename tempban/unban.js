// Get event emmitter.
const events = require('events'), emitter = new events.EventEmitter;
// Get ban database.
let database = require("./database.json"), date = new Date, i;

// Check for expired bans.
for (i = 0; i <= database.length(); i++) {
    if (database[i].year >= date.getFullYear()) {
        if (database[i].month >= date.getMonth()) {
            if (database[i].day >= date.getDate()) {
                if (database[i].hour >= date.getHours()) {
                    if (database[i].minute >=date.getMinutes()) {
                        emitter.emit('unban', (database[i].id));
                    }
                }
            }
        }
    }
}

// Check for expired bans every minute.
for (;;) {
    setTimeout(() => {
        date = new Date;
        for (i = 0; i <= database.length(); i++) {
            if (database[i].year >= date.getFullYear()) {
                if (database[i].month >= date.getMonth()) {
                    if (database[i].day >= date.getDate()) {
                        if (database[i].hour >= date.getHours()) {
                            if (database[i].minute >=date.getMinutes()) {
                                emitter.emit('unban', (database[i].id));
                            }
                        }
                    }
                }
            }
        }
    }, 60000);
}