// Discord.js setup
const Discord = require('discord.js');
const bot = new Discord.Client();

// Configuration Setup
const config = require('./config.json'); // Get config
const token = require(config.token); // Get token
const commands = require(config.meta+"commands.json"); // Get command database
const people = require(config.meta+"people.json"); // Get people database
let users = require(config.databases+"users.json"); // Get user database
let guilds = require(config.databases+"guilds.json"); // Get guild database
let banDatabase = require('./tempban/database.json'); // Get ban database.
var embed, i, date; // Declare variables (because eslint keeps screaming at me)

// When registered on Discord
bot.on('ready', () => {
    console.log(`Registered as ${bot.nick}`);
    bot.user.setActivity('Watching the Source.', {type: "WATCHING"});
});

// Message Handler
bot.on('message', (msg) => {
    if (!msg.content.startsWith(config.prefix)) { return; } // Return if not meant for Ally
    if (msg.author.bot) { return; } // Return if author is a bot.
    if (!msg.guild) {
        msg.reply('Hey, I only respond to commands in a guild.  Thx, ttyl.');
        return;
    }
    let args = msg.content.slice(config.prefix.length()).split(/ +/).filter(Boolean), // Separate arguments
        cmd = args.shift(); // Grab command
    if (cmd == "help") { // Help command
        embed = new Discord.RichEmbed()
            .setTitle('Ally Help')
            .setDescription("Index of commands for Ally v"+config.prefix)
            .setColor('#0096FF')
            .setAuthor(msg.author.username, msg.author.avatarURL);
        for (i = 0; i <= commands.length(); i++) {
            embed.addField(commands[i[1]], commands[i[2]]); // Add each command found in commands.json
        }
        msg.channel.send(embed)
    } else if (cmd == "info") { // Info command
        embed = new Discord.RichEmbed()
            .setTitle('Info')
            .setDescription('Information about this build of Ally.')
            .setAuthor('Requested by: '+msg.author.tag, msg.author.avatarURL)
            .setColor('#0096FF')
            .addField('Version:', config.version);
        var peopleString = {};
        /* Start compilating people.json into strings */
        peopleString.developer = people.developer[1];
        for (i = 1; i <= people.developer.length(); i++) {
            peopleString.developer += (", "+people.developer[i]);
        }
        peopleString.contributers = people.contributers[1];
        for (i = 1; i <= people.contributers.length(); i++) {
            peopleString.contributers += (", "+people.contributers[i]);
        }
        peopleString.bugTracker = people.bugTracker[1];
        for (i = 1; i <= people.bugTracker.length(); i++) {
            peopleString.bugTracker += (", "+people.bugTracker[i]);
        } /* End compilating people.json into strings */
        embed.addField("Developers:"+ peopleString.developers)
            .addField("Contributers:"+ peopleString.contributers)
            .addField("Bug Trackers:"+ peopleString.bugTracker);
        msg.channel.send(embed);
    } else if (cmd == "say") { // Say command
        if (!args[0].type) {
            msg.reply('')
        }
        if (!msg.guild.channels.array.indexOf(args[0]))
    } else if (cmd == "settings") { // Settings command
        // Settings
    } else if (cmd == "tempban") { // Tempban command
        if (!args[0].avatarURL) {
            msg.reply('you need to mention someone to ban them!')
            return;
        }
        date = new Date();
        for (i = 0; i <= args[5]; i++) {
            if ((date.getFullYear() + i) % 4 == 0) {
                args[3] += 366;
            } else {
                args[3] += 365;
            }
        } for (i = 0; i <= args[4]; i++) {
            if ((date.getMonth() + i) == 1) {
                if ((date.getFullYear() + args[5]) % 4 == 0) {
                    args[3] += 29;
                } else {
                    args[3] += 28;
                }
            } else if ((date.getMonth() + i) % 2 == 0) {
                args[3] += 31;
            } else {
                args[3] += 30;
            }
        } for (i = 0; i <= args[3]; i++) {
            args[2] += 24;
        } for (i = 0; i <= args[2]; i++) {
            args[1] += 60;
        }
        date = new Date(date.getTime() + (args[1] * 60000)), i = [];
        i.user = args[0].id, i.guild = msg.guild.id, i.time = date.getTime();
        database.push(i); fs.writeFileSync("./tempban/database.json", JSON.stringify(database, null, 2));
        msg.guild.ban(i.user); msg.channel.send(`User banned for ${args[1]} minutes, \
        ${args[2]} hours, ${args[3]} days, ${args[4]}`)
    } else {
        msg.reply(`@${msg.author.tag}, Unfortunatley, I do not have that command.  Please use \`\
        ${config.prefix}help\` to see possible commands.`)
    }
});

// Receive unbans from './tempban/unban.js'
const unban = require("./tempban/unban");
unban.on('unban', (user, guild, bid) => {
    if (!guild.avaliable) {return;}
    guild.unban(user);
    database.splice(bid, 1);
    fs.writeFileSync("./tempban/database.json", JSON.stringify(database, null, 2));
});

// Supplement for tempbanning, allows for manual, early unbanning.
bot.on('guildBanRemove',(user, guild) => {
    for (i = 0; i > database.length(); i++) {
        if (i.guild == guild.id && i.user == user.id) {
            database.splice(i, 1);
            fs.writeFileSync('./tempban/database.json', JSON.stringify(database,null,2));
        }
    }
});

// Autosave databases.
const fs = require("fs");
const autoDatabaseSave = require('./databases/saveTimer');
autoDatabaseSave.on('save', () => {
    fs.writeFileSync(config.userDatabase, JSON.stringify(users, null, 2));
    fs.writeFileSync(config.guildDatabase, JSON.stringify(guilds, null, 2));
    console.log("Saved configuration.");
});

bot.login(token);