// Discord.js setup
const Discord = require('discord.js');
const bot = new Discord.Client();

// Configuration Setup
const config = require('./config.json');
const token = require(config.token);
const commands = require(config.meta+"commands.json");
const people = require(config.meta+"people.json");
let users = require(config.databases+"users.json");
let guilds = require(config.databases+"guilds.json");
var embed, i;

// When registerd on Discord
bot.on('ready', () => {
    console.log(`Registered as ${bot.nick}`)
});

// Message Handler
bot.on('message', (msg) => {
    if (!msg.content.startsWith(config.prefix)) { return; } // Return if not meant for Ally
    if (msg.author.bot) { return; } // Return if author is a bot.
    let args = msg.content.slice(config.prefix.length()).split(" ").filter(Boolean), // Separate arguments
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
        // Say command
    } else if (cmd == "settings") { // Settings command
        // Settings
    } else if (cmd == "tempban") { // Tempban command
        // Tempban command
        i = []
    } else {
        msg.reply(`@${msg.author.tag}, Unfortunatley, I do not have that command.  Please use \`\
        ${config.prefix}help\` to see possible commands.`)
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