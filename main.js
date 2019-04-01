const Discord = require('discord.js');
const client = new Discord.Client();
const config = require(config.json)

client.on('ready',() => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message',msg => {
  if(msg.author != self) {
    if(msg.content.startsWith(config.prefix)) {
      let args = message.content.slice(prefix.length).trim().split(/ +/g);
      let command = args.shift().toLowerCase();
      if (command = help) {
        msg.channel.send(`Get ${msg.user.tag} some help!`)
      } else {
        msg.reply("Whoops, it looks like Ally doesn't have that command.  Use `a!help` for commands.")
      }
    }
  }
});

client.login(config.token);