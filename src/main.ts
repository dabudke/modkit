// get libraries and modules
import { Client, Intents } from "discord.js";
import { readFile } from "fs";
import { CommandData } from "./commands/loader";

// declare client
const bot = new Client({ intents: [ Intents.FLAGS.GUILDS ] });

bot.once("ready", async () => {
    console.log(`Connected to Discord (${bot.user.tag})`);
    bot.user.setPresence({ status: "idle", activities: [{ name: "Starting up, please wait.", type: "PLAYING" }] });

    // check registered commands
    const registered = [];
    await bot.application.commands.fetch();
    bot.application.commands.cache.forEach( async command => {
        var i = CommandData.findIndex(data => {
            if (command.name == data.name) return true;
        });
        if (i == -1) {
            await bot.application.commands.delete(command);
        } else {
            CommandData[i].id = command.id;
            registered.push(command.name);
        }
    });
    CommandData.filter( data => registered.includes(data.name) ).forEach( async data => {
        const command = await bot.application.commands.create(data);
        CommandData[CommandData.indexOf(data)].id = command.id;
    } );
    console.log("Commands Registered");

    // TODO: user actions

    // TODO: message actions

    console.log("All actions registered.");
    bot.user.setPresence({ status: "online", activities: [{ name: "all the servers", type: "WATCHING" }] });
    console.log("Ready!");
});


bot.on("interactionCreate", async interaction => {
    if (interaction.isCommand()) {
        const cmd = CommandData.find( data => data.id == interaction.commandId );
        if (cmd) cmd.handler(interaction);
        else interaction.reply({ content: "An internal error occoured, try again later.", ephemeral: true });
    }
});

bot.on("error", async error => {
    console.warn("An error occoured while communicating with Discord, here's what we got:\n\n", error);
});

// TODO: legacy code
readFile("./token.txt", "utf-8", ( err, token ) => {
    if (err) console.error("It appears that there is not a token.txt in the bot's root directory.  Please create the file, and paste your bot token into it.");
    else bot.login(token).catch( err => console.error("There was a problem logging into Discord, most likely a bad token or no network connection.\n\nHere's what was recieved from Discord:\n", err));
});
