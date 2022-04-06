// get libraries and modules
import { Client, Intents } from "discord.js";
import { readFile } from "fs";
import { CommandData, CommandHandlers } from "./commands/loader";
import { server } from "./meta/config";

// declare client
const bot = new Client({ intents: [ Intents.FLAGS.GUILDS ] });

export const isDevelopment = process.env.ENV.match(/dev(elop(ment)?)?/i);

bot.once("ready", async () => {
    console.log(`Connected to Discord (${bot.user.tag})`);
    bot.user.setPresence({ status: "idle", activities: [{ name: "Starting up, please wait.", type: "PLAYING" }] });

    // check registered commands
    const registered = [];
    if (isDevelopment) {
        await bot.guilds.fetch();
        const commandGuild = await bot.guilds.cache.get(server);
        await commandGuild.commands.fetch();
        commandGuild.commands.cache.forEach( async command => {
            if (!Object.keys(CommandData).includes(command.name)) await command.delete();
            else registered.push(command.name);
        });
    } else {
        await bot.application.commands.fetch();
        bot.application.commands.cache.forEach( async command => {
            if (!Object.keys(CommandData).includes(command.name)) await command.delete();
            else registered.push(command.name);
        });
    }
    for (let command in CommandData) {
        if (registered.includes(command)) continue;
        await bot.application.commands.create(CommandData[command], isDevelopment ? server : undefined).catch(() => console.warn(`Could not create command '${command}'`));
    }
    console.log("Commands Registered");

    // TODO: user actions

    // TODO: message actions

    console.log("All actions registered");
    await bot.user.setPresence({ status: "online", activities: [{ name: "all the servers", type: "WATCHING" }] });
    console.log("Ready!");
});


bot.on("interactionCreate", async interaction => {
    if (interaction.channel.isVoice()) return;
    if (interaction.isCommand()) {
        const handler = CommandHandlers[interaction.commandName];
        if (handler) handler(interaction);
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
