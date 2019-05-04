// Main structure for discord.js.
const Discord = require('discord.js');
const client = new Discord.Client();
// Assign files to variables
const config = require('./config.json');

client.on('ready',()=>{
  console.log(`Logged in at ${client.readyTimestamp} to ${client.usertag}.`);
});

client.on('message', msg => {
    if (msg.content.startsWith(config.prefix)) {
        if (msg.content === '/ping');
    } else {
        return;
    }
});

client.login(config.token);