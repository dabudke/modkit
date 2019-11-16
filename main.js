// Discord.js setup
const Discord = require('discord.js');
const bot = new Discord.Client();

// Configuration Setup
const fs = require("fs");
const config = require('./config.json');
const token = require(config.tokenRef).release;
let users = require(config.userDatabase);
let guilds = require(config.guildDatabase);

bot.on('ready', () => {
    console.log(`Registered as ${bot.nick}`)
});

bot.on('message', (msg) => {
    if (!msg.content.startsWith(config.prefix)) { return; };
    if (msg.author.bot) { return; };
    let args = msg.content.slice(config.prefix.length()).split(" ").filter(Boolean),
        cmd = args.shift();
    if (cmd == "help") {
        if (args[1] == "cmds") {
            msg.channel.send(new Discord.RichEmbed()
                .setTitle('Ally Commands')
                .setDescription("Index of commands for Ally v"+config.prefix)
                .setColor('#0096FF')
                .setAuthor(msg.author.username, msg.author.avatarURL)
            )
        }
    }
});

// Autosave databases.
const autoDatabaseSave = require('./databases/autoDatabaseSave');
autoDatabaseSave.on('save', () => {
    fs.writeFileSync(config.userDatabase, JSON.stringify(users, null, 2));
    fs.writeFileSync(config.userDatabase, JSON.stringify(users, null, 2));
    console.log("Saved configuration.");
});

bot.login(token);