// get libraries and modules
const Discord = require("discord.js");
const db = require("./utils/databaseManager");
const cmdHandler = require("./commandHandler");

// get meta files
const token = require(require.main.filename).token;
const about = require("./meta/about.json");
const embeds = require("./meta/embeds");

// declare client
const bot = new Discord.Client();

// declare variables

bot.once("ready", () => {
    console.log(`Logged in and connected to Discord (Username: ${bot.user.tag})`);
    bot.user.setPresence( require(require.main.filename).presence );

    for ( var i in bot.guilds.cache.array() ) {
        if ( !db.serverDb[bot.guilds.cache.array()[i].id] ) {
            db.serverDb[bot.guilds.cache.array()[i].id] = JSON.parse( JSON.stringify( db.serverDb.default, 0, 4, null ) )
            console.log(`Adding new server ${bot.guilds.cache.array()[i].name} to server database.`)
        }
    }
})

bot.on("message", (msg) => {
    // exclusions
    if (msg.author.bot) { return; }
    if (!msg.content.startsWith(about.prefix)) { return; }

    // message splitter
    const args = msg.content.split(/ +/gm);
    const cmd = args.shift().slice(about.prefix.length).toLowerCase();

    // message handler
    cmdHandler.handle(cmd, args, bot, msg, db, embeds);
});

bot.on( "error", error => {
    console.error(`An error occoured, here's what happened:\n\n${error}`);
});

bot.login(token).catch( error => {
    console.error("There was a problem logging into Discord, most likely a bad token or network connection.\
\nThis is what we got from Discord.JS:\n\n\"".concat(error).concat("\""));
});