function writeDatabases() {
    console.log("Writing databases, please wait...");

    fs.writeFileSync( "./databases/users.json", JSON.stringify( exports.userDb, 0, 4, null) );
    fs.writeFileSync( "./databases/servers.json", JSON.stringify( exports.serverDb, 0, 4, null) );
    fs.writeFileSync( "./databases/feedback.json", JSON.stringify( exports.feedbackDb, 0, 4, null) );
    
    console.log("Writing complete.");
}

const fs = require("fs");

setInterval( writeDatabases , 60000 );

exports.userDb = require("./users.json");
exports.serverDb = require("./servers.json");
exports.feedbackDb = require("./feedback.json");