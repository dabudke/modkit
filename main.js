const Discord = require('discord.js');
const client = new Discord.Client();
const config = require(config.json);
const token = require(token.json).token

client.on('ready',() => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message',msg => {
    if (msg.author.bot) { return; }
    if (msg.content.indexOf(config.prefix) !== 0 ) { return; }
    if (!msg.content.guild) {
        msg.channel.reply("Whaddaya doing, tryna slide me into DM's?  ***NO WAY JOSE.***")
    }
    let args = msg.content.slice(config.prefix.len).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    switch(cmd) {
      case "ping" :
        msg.channel.send("Pong.  *Whaddaya expect me to do?*");
        break;
      case "pong" :
        msg.channel.send("Ah, so you wanna turn the tables.  ***I see what you did there.***")
        break;
      case "say" :
        if (msg.guild == false) {
          msg.channel.send("Silly goose, you need to be in a server to do that!");
        } else if (msg.guild.channels.indexOf(args[1]) !== 0) {
          msg.channel.send("Oof, looks like that channel doesn't exist in this server");
          break;
        } else if (msg.channel.memberPermissions(msg.author).indexOf("SEND_MESSAGES") == -1) {
            msg.channel.send("Huh.  Guess I can't do that, cause you dont have chat permissions there.");
        } else {
            args[1].send(args[2]);
        }
    }
});

client.login(token);