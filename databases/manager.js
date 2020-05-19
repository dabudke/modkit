const djs = require("discord.js");
const fs = require("fs");

const userDatabase = require("./users.json");
const serverDatabase = require("./servers.json");
const feedbackDatabase = require("./feedback.json");

setInterval( () => {
    fs.writeFile( "./users.json", userDatabase );
    fs.writeFile( "./servers.json", serverDatabase );
    fs.writeFile( "./feedback.json", feedbackDatabase );
}, 30000 );

// user database functions
exports.users = {}; // don't reference the database object here to keep integrity of database
exports.users.addUser = ( userID, data ) => {};
exports.users.modUser = ( userID, data ) => {};
exports.users.remUser = ( userID ) => {};

// server database functions
exports.servers = {}; // don't reference the database object here to keep integrity of database
exports.servers.addServer = ( guildID, data ) => {};
exports.servers.modServer = ( guildID, data ) => {};
exports.servers.remServer = ( guildID ) => {};

// feedback database function
exports.feedback = {};
exports.feedback.addFeedback = ( user, guild, data ) => {
    if (!user === djs.User) { return; };
    if (!guild === djs.Guild) { return; };

    const dataObj = {data: data};

    dataObj.user.id = user.id;
    dataObj.user.tag = user.tag;
    
    dataObj.guild.id = guild.id;
    dataObj.guild.name = guild.id;

    feedbackDatabase[feedbackDatabase.length] = dataObj;
};