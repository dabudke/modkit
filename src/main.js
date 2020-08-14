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

bot.once("ready", () => {
    console.log(`Logged in and connected to Discord (Username: ${bot.user.tag})`);
    bot.user.setPresence( require(require.main.filename).presence );

    console.log("Adding new servers to database.")
    for ( var i in bot.guilds.cache.array() ) {
        if ( !db.serverDb[bot.guilds.cache.array()[i].id] ) {
            db.serverDb[bot.guilds.cache.array()[i].id] = db.serverDb.default;
            console.log(`Adding new server ${bot.guilds.cache.array()[i].name} to server database.`)
        }
    }
    console.log("New servers added.");
})

bot.on("message", (msg) => {
    // exclusions
    if (msg.author.bot) { return; }
    if (!msg.content.startsWith(about.prefix)) { return; }

    // message splitter
    const args = msg.content.split(/ +/gm);
    const cmd = args.shift().slice(about.prefix.length).toLowerCase();

    // message handler
    switch (cmd) {
        case "ping":
            msg.reply("pong!");
            break;

        case "help":
        case "?":
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
                
                case "about":
                    msg.channel.send({ embed: embeds.command.about(msg) });
                    break;
                
                case "settings":
                case "setting":
                case "sets":
                case "set":
                    msg.channel.send({ embed: embeds.command.settings(msg) });
                    break;

                case "feedback":
                case "fb":
                    msg.channel.send({ embed: embeds.command.feedback(msg) });
                    break;

                case "ping":
                    msg.channel.send({ embed: embeds.command.ping(msg) });
                    break;
                
                default:
                    msg.channel.send({ embed: embeds.help(msg) });
            }
            break;

        case "about":
            //about command
            break;
        
        case "settings":
        case "setting":
        case "sets":
        case "set":
            // settings command
            break;
        
        case "warn":
        case "!":
            // warn command
            break;

        case "permissions":
        case "perms":
        case "perm":
            // permission command
            break;

        case "feedback":
        case "fb":
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
            break;

        default:
            msg.reply(`I didn't understand that command.  Please use \`${about.prefix}help\` to see all avaliable commands.`);
            break;
    }
});

bot.on( "error", error => {
    console.error(`An error occoured, here's what happened:\n\n${error}`);
});

bot.login(token).catch( error => {
    console.error("There was a problem logging into Discord, most likley a bad token or network connection.\
\nThis is what we got from Discord.JS:\n\n\"".concat(error).concat("\""));
});