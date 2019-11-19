// Discord.js setup
const Discord = require('discord.js');
const bot = new Discord.Client();

// Configuration Setup
const fs = require("fs");
const config = require('./config.json');
const token = require(config.tokenRef);
let users = require(config.userDatabase);
let guilds = require(config.guildDatabase);
var embed;

bot.on('ready', () => {
    console.log(`Registered as ${bot.nick}`)
});

bot.on('message', (msg) => {
    if (!msg.content.startsWith(config.prefix)) { return; }
    if (msg.author.bot) { return; }
    let args = msg.content.slice(config.prefix.length()).split(" ").filter(Boolean),
        cmd = args.shift();
    if (cmd == "help") {
        var commands = require(config.commandIndex)
        embed = new Discord.RichEmbed()
            .setTitle('Ally Help')
            .setDescription("Index of commands for Ally v"+config.prefix)
            .setColor('#0096FF')
            .setAuthor(msg.author.username, msg.author.avatarURL);
        for (var i = 0; i <= commands.length(); i++) {
            embed.addField(commands[i[1]], commands[i[2]]);
        }
        msg.channel.send(embed)
    } else if (cmd == "info") {
        embed = new Discord.RichEmbed()
            .setTitle('Info')
            .setDescription('Information about this build of Ally.')
            .setAuthor('Requested by: '+msg.author.tag, msg.author.avatarURL)
            .addField('Developers',"")
            .addField('Version',config.version)
    }
});

// Autosave databases.
const autoDatabaseSave = require('./databases/autoDatabaseSave');
autoDatabaseSave.on('save', () => {
    fs.writeFileSync(config.userDatabase, JSON.stringify(users, null, 2));
    fs.writeFileSync(config.guildDatabase, JSON.stringify(guilds, null, 2));
    console.log("Saved configuration.");
});

bot.login(token);