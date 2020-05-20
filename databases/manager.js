const djs = require("discord.js");
const fs = require("fs");

let userDb = require("./users.json");
let serverDb = require("./servers.json");
let feedbackDb = require("./feedback.json");

setInterval( () => {
    fs.writeFile( "./users.json", userDb );
    fs.writeFile( "./servers.json", serverDb );
    fs.writeFile( "./feedback.json", feedbackDb );
}, 30000 );

// user database functions
exports.users = {}; // don't reference the database object here to keep integrity of database// default user object
exports.users.default = { points: { global: { level: 1, points: 0 } }, settings: { points: { announceGlobal: false, announceDM: true } } }
exports.users.add = ( userId, data ) => {
    let dataObj = { [userId]: exports.users.default };
    userDb[userDb.length] = dataObj;
    exports.users.modify( userId, data );
};
exports.users.modify = ( userId, data ) => {};
exports.users.delete = userId => {};

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