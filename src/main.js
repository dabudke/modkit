// get libraries and modules
const Discord = require("discord.js");
const db = require("../databases/manager");

// get meta files
const token = require(require.main.filename).token;
const about = require("../meta/about.json");
const embeds = require("../meta/embeds");

// declare clients
const bot = new Discord.Client();

// declare variables

bot.on("ready", () => {
    console.log(`Logged in and connected to Discord (Username: ${bot.user.tag})`);
    bot.user.setPresence( require(require.main.filename).presence );
})

bot.on("message", (msg) => {
    // exclusions
    if (msg.author.bot) { return; }
    if (!msg.content.startsWith(about.prefix)) { return; }

    // message splitter
    const args = msg.content.split(/ +/gm);
    const cmd = args.shift().slice(about.prefix.length).toLowerCase();

    if (cmd === "ping") {
        msg.reply("pong!");
    } else if ( cmd === "help" || cmd === "?") {
        switch (args[0]) {
            case "utility":
                msg.channel.send({ embed: embeds.utility(msg) });
                break;

            case "moderation":
                msg.channel.send({ embed: embeds.moderation(msg) });
                break;

            case "warn":
            case "!":
                msg.channel.send({ embed: embeds.command.warn(msg) });
                break;

            case "permissions":
            case "perms":
            case "perm":
                msg.channel.send({ embed: embeds.command.permissions(msg) });
                break;
            
            case "help":
            case "?":
                msg.channel.send({ embed: embeds.command.help(msg) });
                break;
            
            default:
                msg.channel.send({ embed: embeds.help(msg) });
        }
    }/* else if ( cmd === "about" ) {
        //about command
    }/* else if ( cmd === "settings" || cmd === "set" ) {
        // settings command
    }/* else if ( cmd === "warn" ) {
        // warn command
    }/* else if ( cmd === "permissions" || cmd === "perms" ) {
        // permissions command
    }*/ else if ( cmd === "feedback" || cmd === "fb") {
        if ( args[0] === undefined ) {
            msg.reply("you can submit feedback to the developers of Ally!  Put your feedback after `feedback` or `fb` to submit feedback.");
        } else {
            let feedback = args[0];
            let i = false;
            for (const arg in args) {
                if (!i) { i = true; } else {
                    feedback = feedback.concat(" ").concat(args[arg]);
                }
            }
            db.feedbackDb.push(feedback);
            msg.reply("thanks for submitting feedback!  Your feedback is important, so keep submitting feedback as needed!");
        }
     } else {
        msg.reply(`I didn't understand that command.  Please use \`${about.prefix}help\` to see all avaliable commands.`);
    }
});

bot.on( "error", error => {
    console.error(`An error occoured, here's what happened:\n\n${error}`);
});

bot.login(token).catch( error => {
    console.error("There was a problem logging into Discord, most likley a bad token or network connection.\
\nThis is what we got from Discord.JS:\n\n\"".concat(error).concat("\""));
});