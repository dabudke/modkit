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
        case "set":{
            // check permissions
            var perms = db.serverDb.default.settings.moderation.permissions;
            if ( !msg.guild.members.cache.get(msg.author.id).roles.cache.get( perms.modRoles[perms.viewSettings] ) ) {
                if ( !msg.guild.members.cache.get(msg.author.id).hasPermission("MANAGE_GUILD") ) {
                    msg.reply("you do not have permission to use that command.");
                    break;
                }
            }

            // parse setting
            let setting = args[0] ? args[0].split(/\./g) : [];
            let dbObj = db.serverDb[msg.guild.id].settings;
            for ( var i in setting ) {
                if ( !dbObj[setting[i]] ) {
                    msg.reply("that setting does not exist.");
                    return;
                } else {
                    dbObj = dbObj[setting[i]];
                }
            }

            break;
        }
        
        case "warn":
        case "!": {
            /* commented out because role permissions aren't configurable yet. */
            // i'll do my best to explain
            // if guild member...                           does not have role permitted to use...                                                                         warn command, then
            //if ( !msg.guild.members.cache.get(msg.author.id).roles.cache.get( db.serverDb[msg.guild.id].settings.moderation.permissions.modRoles[db.serverDb[msg.guild.id].settings.moderation.permissions.warn] ) ) {
            // if guild member...                           doesn't have administrator permission, then
            if ( !msg.guild.members.cache.get(msg.author.id).hasPermission("ADMINISTRATOR") ) {
                // let user know that they don't have permission to use the command
                msg.reply("you do not have permission to use this command!");
                // exit
                break;
            }
            //}
            
            // check if first argument is anything
            if ( !args[0] ) { msg.reply("please mention a user!"); break; }
            // check if argument 0 is a valid mention
            if ( !args[0].startsWith('<@') && !args[0].endsWith('>') ) { msg.reply("please mention a user!"); break; }

            // get user GUILD id from mention
            const fullUserId = args[0].slice(2, -1);
            // get user id from guild id
            const userId = fullUserId.startsWith('!') ? fullUserId.slice(1) : fullUserId;
            // get user cache (unused for now)
            //const userCache = bot.users.cache;

            // prevent the user from warning themself
            if ( userId === msg.author.id ) {
                msg.reply("you can't warn yourself!")
                break;
            }
            // make sure user is in server
            if ( !bot.guilds.cache.get(msg.guild.id).members.cache.get(userId) ) {
                msg.reply("that person is not in this server!")
                break;
            }

            /* warn user */
            // if user doesn't have a moderation history
            if ( !db.serverDb[msg.guild.id].modHistory[userId] ) {
                // add one
                db.serverDb[msg.guild.id].modHistory[userId] = {};
                // go ahead and add a warning history as well
                db.serverDb[msg.guild.id].modHistory[userId].warnings = [];
            // if the user just doesn't have a warning history
            } else if ( !db.serverDb[msg.guild.id].modHistory[userId].warnings ) {
                // add a warning history
                db.serverDb[msg.guild.id].modHistory[userId].warnings = [];
            }

            let reason;
            if (args[1]) {
                // concatenate reason
                for ( var arg in args ) {
                    if ( !arg == 0 ) {
                        if ( arg == 1 ) { reason = args[arg] } else {
                            reason += " ".concat(args[arg]);
                        }
                    }
    
                }
            }

            // add a warning
            db.serverDb[msg.guild.id].modHistory[userId].warnings.push({
                reason: reason,
                user: {
                    name: msg.author.username,
                    avatar: msg.author.avatarURL()
                }
            });

            // send response to user
            if (reason) {
                msg.channel.send(`User <@${userId}> has been warned for ${reason} by ${msg.author.username}.`);
            } else {
                msg.channel.send(`User <@${fullUserId}> has been warned by ${msg.author.username}`);
            }

            /* log channels aren't configurable, on hold until settings command is completed
            // send warning log to log channel
            msg.channel.send(new Discord.MessageEmbed()
                .setAuthor(
                    userCache.get(userId).username.concat('#').concat(bot.users.cache.get(userId).discriminator).concat(" has been warned."),
                    bot.users.cache.get(userId).avatarURL()
                )
                .setTitle("User has been warned.")
                .setDescription("warning reason")
                .setColor("#ff9900")
                .setFooter(
                    `Warned by ${msg.author.username} | User has ${db.serverDb[msg.guild.id].modHistory[userId].warnings} warnings.`,
                    msg.author.avatarURL()
                )
                .setTimestamp(new Date())
            ); */

            break;
        }

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