function writeDatabases(include) {
    console.log("Writing databases, please wait...");
    if ( include === null ) {
        include = [ "users", "servers", "feedback" ];
    }
    for (i in include) {
        switch(i) {
            case "users":
                fs.writeFile( "./users.json", JSON.stringify( userDb, 2, null ) );
    
            case "servers":
                fs.writeFile( "./servers.json", JSON.stringify( serverDb, 2, null ) );
    
            case "feedback":
                fs.writeFile( "./feedback.json", JSON.stringify( feedbackDb, 2, null ) );
        }
    }
    console.log("Writing complete.");
}

const fs = require("fs");

let userDb = require("./users.json");
let serverDb = require("./servers.json");
let feedbackDb = require("./feedback.json");

setInterval( writeDatabases() , 30000 );

exports.writeDbs() = writeDatabases();
exports.userDb = userDb;
exports.serverDb = serverDb;
exports.feedbackDb = feedbackDb;