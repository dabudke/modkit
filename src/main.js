// get libraries and modules
const Discord = require("discord.js");

// get meta files
const token = require(require.main.filename).token;
const about = require("../meta/about.json")

// declare clients
const bot = new Discord.Client();

// declare variables

bot.on("ready", () => {
    console.log(`Logged in and connected to Discord (Username: ${bot.user.tag})`)
})

bot.on("message", (msg) => {
    // exclusions
    if (msg.author.bot) { return; }
    if (!msg.content.startsWith(about.prefix)) { return; }

    // message splitter
    const args = msg.content.split(/ +/gm);
    const cmd = args.shift().slice(about.prefix.length).toLowerCase();

    if (cmd === "ping") {
        msg.reply("Pong!");
    }/* else if ( cmd === "help" || cmd === "?") {
        // help command
    } else if ( cmd === "settings" || cmd === "set" ) {
        // settings command
    } else if ( cmd === "warn" ) {
        // warn command
    } else if ( cmd === "permissions" || cmd === "perms" ) {
        // permissions command
    } else if ( cmd === "feedback" || cmd === "fb") {
        // feedback command
    }*/ else {
        msg.reply("I didn't understand that command.  Please use `^help` to see all avaliable commands.");
    }
});

bot.login(token).catch( error => {
    console.log("There was a problem logging into Discord, most likley a bad token or network connection.\
\nThis is what we got from Discord.JS:\n\n\"".concat(error).concat("\""));
    process.exit(-1);
});