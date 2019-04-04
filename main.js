const Discord = require('discord.js');
const client = new Discord.Client();
const config = require(config.json);

client.on('ready',() => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message',msg => {
    if (msg.author.bot) { return; }
    if (config.prefix !== msg.content.slice(0, config.prefix.len - 1)) { return; }

});

client.login(config.token);