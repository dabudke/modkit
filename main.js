const Discord = require("discord.js");
const client = new Discord.Client

client.on(Ready);{
    console.log(`Logged in as ${client.user}`);
};
client.on(Message)