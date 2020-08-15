function writeDatabases() {
    if ( require('./users.json') !== exports.userDb ) {
        fs.writeFileSync( "./databases/users.json", JSON.stringify( exports.userDb, 0, 4, null) );
    }

    if ( require('./servers.json') !== exports.serverDb ) {
        fs.writeFileSync( "./databases/servers.json", JSON.stringify( exports.serverDb, 0, 4, null) );
    }

    if ( require('./feedback.json') !== exports.feedbackDb ) {
        fs.writeFileSync( "./databases/feedback.json", JSON.stringify( exports.feedbackDb, 0, 4, null) );
    }
}

const fs = require("fs");

setInterval( writeDatabases , 60000 );

exports.userDb = require("./users.json");
exports.serverDb = require("./servers.json");
exports.feedbackDb = require("./feedback.json");