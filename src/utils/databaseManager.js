function writeDatabases() {
    if ( require('../databases/users.json') !== exports.userDb ) {
        fs.writeFileSync( "../databases/users.json", JSON.stringify( exports.userDb, 0, 4, null) );
    }

    if ( require('../databases/servers.json') !== exports.serverDb ) {
        fs.writeFileSync( "../databases/servers.json", JSON.stringify( exports.serverDb, 0, 4, null) );
    }

    if ( require('../databases/feedback.json') !== exports.feedbackDb ) {
        fs.writeFileSync( "../databases/feedback.json", JSON.stringify( exports.feedbackDb, 0, 4, null) );
    }
}

const fs = require("fs");

setInterval( writeDatabases , 60000 );

exports.userDb = require("../databases/users.json");
exports.serverDb = require("../databases/servers.json");
exports.feedbackDb = require("../databases/feedback.json");