const Discord = require('discord.js');
const client = new Discord.Client();
const config = require(config.json);
const token = require(token.json).token;

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
                .setURL(config.website)
                .setDescription('To see all commands in a category, use `$help cmds [category]`')
                .addField('Utility',"$ping | $pong")
                .addField('Fun',"$say")
                .setAuthor(msg.author.tag, msg.author.tag)
            )
        } else {
            msg.reply('');
        }
    } else if (cmd === "say") {
        if (!msg.guild.avalable) {
            msg.channel.send("Oops, you need to be in a server for that!");
        } else if (msg.guild.channels.indexOf(args[0]) === -1) {
            msg.channel.send("Oops, that channel doesn't appear to exist.");
        } else if (args[0].memberPermissions(msg.author).indexOf("SEND_MESSAGES") === -1) {
            msg.channel.send("Oops, It looks like you can't talk there, so I can't on your behalf either.");
        } else {
           args[0].send(new Discord.RichEmbed()
            .setTitle(args[1])
            .setDescription(`Sent by ${msg.author} in ${msg.channel}`)
            .setImage
        );
        msg.channel.send(`Sent ${args[1].toString} to channel ${args[0]}.`);
        }
    } else {
        msg.channel.send(`It appears that I do not have that command.  For a complete list of commands, run \`${config.prefix}help\``)
    }
});

client.login(token);