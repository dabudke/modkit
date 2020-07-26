const fs = require("fs");

let userDb = require("./users.json");
let serverDb = require("./servers.json");
let feedbackDb = require("./feedback.json");

setInterval( () => {
    fs.writeFile( "./users.json", JSON.stringify( userDb, 2, null ) );
    fs.writeFile( "./servers.json", JSON.stringify( serverDb, 2, null ) );
    fs.writeFile( "./feedback.json", feedbackDb );
}, 30000 );