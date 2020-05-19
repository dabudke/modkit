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
    } else if ( cmd === "help" || cmd === "?") {
        // help command
    } else if ( cmd === "settings" || cmd === "set" ) {
        // settings command
    } else if ( cmd === "warn" ) {
        // warn command
    } else if ( cmd === "permissions" || cmd === "perms" ) {
        // permissions command
    } else if ( cmd === "feedback" || cmd === "fb") {
        // feedback command
    } else {
        // unknown command response
    }
});

bot.login(token)