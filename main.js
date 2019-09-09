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
            if (args[1] === "misc") {
                msg.channel.send(new Discord.RichEmbed()
                    .setTitle('Miscelaneous Commands')
                    .setURL(config.website +'/commands/miscelaneous')
                )
            } else {
                msg.channel.send(new Discord.RichEmbed()
                    .setTitle("Command Directory")
                    .setURL(config.website +'/commands')
                )
            }
        } else {
            msg.channel.send(new Discord.RichEmbed()
                .setTitle('About Ally')
                .setURL(config.website)
                .setDescription('Ally is a kind and humble Discord bot, written in Discord.js.')
                .addField('Commands', 'Run `a?help commands`')
            )
        }
    } else if (cmd === 'ping') {
        msg.channel.send('Pong.')
    } else if (cmd === 'pong') {
        msg.channel.send('Ping?')
    } else {
        msg.channel.send(`It appears that I do not have that command.  For a complete list of commands, run \`${config.prefix}help\``)
    }
});

client.login(token);