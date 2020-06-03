const djs = require("discord.js");
const fs = require("fs");

let userDb = require("./users.json");
let serverDb = require("./servers.json");
let feedbackDb = require("./feedback.json");

setInterval( () => {
    fs.writeFile( "./users.json", JSON.stringify( userDb, 2, null ) );
    fs.writeFile( "./servers.json", JSON.stringify( serverDb, 2, null ) );
    fs.writeFile( "./feedback.json", feedbackDb );
}, 30000 );

// user database functions
exports.users = {}; // don't reference the database object here to keep integrity of database
exports.users.add = userId => {
    userDb[String(userId)] = userDb.default;
};
exports.users.modify = ( userId, data ) => {
    Object.assign( userDb[String(userId)], data );
};
exports.users.delete = userId => {
    userDb[String(userId)] = {};
};

// server database functions
exports.servers = {}; // don't reference the database object here to keep integrity of database
exports.servers.add = ( guildId, data ) => {};
exports.servers.mod = ( guildId, data ) => {};
exports.servers.del = guildId => {};

// feedback database function
exports.feedback = {}; // don't reference the database object here to keep integrity of database
exports.feedback.add = ( user, guild, data ) => {
    if (!user === djs.User) { return; };
    if (!guild === djs.Guild) { return; };

    const dataObj = {data: data};

    dataObj.user.id = user.id;
    dataObj.user.tag = user.tag;
    
    dataObj.guild.id = guild.id;
    dataObj.guild.name = guild.id;

    feedbackDb[feedbackDb.length] = dataObj;
};