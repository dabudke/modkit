const fs = require('fs');
const events = require('events');
const emitter = new events.EventEmitter;
let database = require("./database.json");
const date = new Date;
let i, user;

// Function for adding bans to the database.
exports.addBan = function(userID,length) {
    length.id = userID;
    database.push(length);
    fs.writeFileSync("./database.json", JSON.stringify(database, null, 2));
};

// Check for expired bans at start.
for (i = 0; i <= database.length(); i++) {
    if (database[i].year >= date.getFullYear()) {
        if (database[i].month >= date.getMonth()) {
            if (database[i].day >= date.getDate()) {
                if (database[i].hour >= date.getHours()) {
                    if (database[i].minute >= date.getMinutes()) {
                        emitter.emit('unban', (database[i].id));
                    }
                }
            }
        }
    }
}

// Check for unbans every minute.
for (;;) {
    setTimeout(() => {
        for (i = 0; i <= database.length(); i++) {
            if (database[i].year >= date.getFullYear()) {
                if (database[i].month >= date.getMonth()) {
                    if (database[i].day >= date.getDate()) {
                        if (database[i].hour >= date.getHours()) {
                            if (database[i].minute >= date.getMinutes()) {
                                emitter.emit('unban', (database[i].id));
                            }
                        }
                    }
                }
            }
        }
    }, 60000);
}