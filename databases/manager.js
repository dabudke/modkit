function writeDatabases() {
    console.log("Writing databases, please wait...");
    
    fs.writeFile( "./users.json", JSON.stringify( userDb, 2, null ) );
    fs.writeFile( "./servers.json", JSON.stringify( serverDb, 2, null ) );
    fs.writeFile( "./feedback.json", JSON.stringify( feedbackDb, 2, null ) );
    
    console.log("Writing complete.");
}

const fs = require("fs");

let userDb = require("./users.json");
let serverDb = require("./servers.json");
let feedbackDb = require("./feedback.json");

//setInterval( writeDatabases , 60000 );

//exports.writeDbs = () => { writeDatabases() };
exports.userDb = userDb;
exports.serverDb = serverDb;
exports.feedbackDb = feedbackDb;