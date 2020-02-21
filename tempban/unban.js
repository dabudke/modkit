// Get event emmitter.
import 'events';
const emitter = new events.EventEmitter;

function checkBans() {
    // Refresh date and database.
    var date = new Date, database = require('./database.json');
    // Check for expired bans.
    for (i = 0; i <= database.length(); i++) {
        if (database[i].time >= date.getTime()) {
            emitter.emit('unban', (database[i].user, database[i].guild, i));
        }
    }
}

function addBan(banData) {}

function removeBan(banData) {}

// Check for expired bans every minute.
for (;;) {
    setTimeout(checkBans(), 30000);
}