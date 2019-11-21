const fs = require('fs');
const events = require('events');
const emitter = new events.EventEmitter;
let database = require("./database.json");
const date = new Date;
let i, user;

exports.addBan = function(userID,year,month,day,hour) {
    user.id = userID;
    user.year = year;
    user.month = month;
    user.day = day;
    user.hour = hour;
    database.push(user)
    user = [];
    fs.writeFileSync("./database.json", JSON.stringify(database, null, 2));
};

for (;;) {
    setTimeout(() => {
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