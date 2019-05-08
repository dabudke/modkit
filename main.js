const Discord = require('discord.js');
const client = new Discord.Client();
const config = require(config.json);
const token = require(token.json).token;
const global = null

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.author.bot || msg.content.indexOf(config.prefix) !== 0) { return; }
    if (!msg.content.guild) {
        msg.channel.reply("Whaddaya doing, tryna slide me into DM's?  ***NO WAY JOSE.***");
        return;
    }
    const args = msg.content.slice(config.prefix.len).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd = "help") {
        if (args[0] === "cmds" || args[0] === "commands") {
            msg.channel.send(new Discord.RichEmbed()
                .setTitle("Command Categories")
            )
        }
    } else if (cmd === "say") {
        if (!msg.guild) {
            msg.channel.send("Silly goose, you need to be in a server to do that!");
        } else if (msg.guild.channels.indexOf(args[0]) === -1) {
            msg.channel.send("Oof, looks like that channel doesn't exist in this server");
        } else if (args[0].memberPermissions(msg.author).indexOf("SEND_MESSAGES") === -1) {
            msg.channel.send("POLICE!  SOMEONE TRYNA CHAT WHERE THEY CAN'T");
        } else {
            if (args[2] === undefined || args[2] === false) {
                const sayEmbed = new Discord.RichEmbed
                    .setTitle(msg.author.username)
                    .setDescription(args[1])
                    .setAuthor(msg.author.tag, msg.author.avatarURL);
            } else if (args[2] === true) {
                args[0].send(args[1]);
            } else {
                msg.reply("On the last argument, use either 'true' or 'false'.")
            }
            msg.channel.send(`Sent ${args[1].toString} to channel ${args[0]}.`);
        }
    } else {
        msg.channel.send("Well, can't help you there.  Don't have that command. Use `"+ config.prefix +"help commands` for a list of commands.")
    }
});

client.login(token);