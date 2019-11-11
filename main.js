const Discord = require('discord.js');
const ally = new Discord.Client();
const allySupport = new Discord.Client();
const allyToken = require('./.token.json').ally;
const allySupportToken = require('./.token.json').allySupport;

ally.on('ready', () => {
    console.log(`Registered as ${ally.nick}`)
});

ally.on('message', (message) => {
    if (message.content == "ping ally") {
        message.reply('Pong!')
    }
});

ally.login(allyToken);
allySupport.login(allySupportToken)