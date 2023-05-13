// get libraries and modules
import { Client, Intents } from "discord.js";
import { promisify } from "util";
import { CommandData, CommandHandlers } from "./commands/loader";
import { CommandData as MessageContextData, CommandHandlers as MessageContextHandlers } from "./messageActions/loader";
import { CommandData as UserContextData, CommandHandlers as UserContextHandlers } from "./userActions/loader";
import { server } from "./meta/config";

export const timeout = promisify(setTimeout);

// declare client
const bot = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS ] });

export const isDevelopment = process.env.ENV && process.env.ENV.match(/dev(elop(ment)?)?/i);
if (isDevelopment) console.warn("Development mode active.");

bot.once("ready", async () => {
    console.log(`Connected to Discord (${bot.user.tag})`);
    bot.user.setPresence({ status: "idle", activities: [{ name: "Starting up, please wait.", type: "PLAYING" }] });

    const allCommands = [];
    allCommands.push(...Object.values(CommandData));
    allCommands.push(...Object.values(UserContextData));
    allCommands.push(...Object.values(MessageContextData));
    bot.application.commands.set(allCommands, isDevelopment ? server : null);
    bot.application.commands.set([], isDevelopment ? null : server);
    console.log("Actions registered");

    await bot.user.setPresence({ status: "online", activities: [{ name: "all the servers", type: "WATCHING" }] });
    setInterval(()=>bot.user.setPresence({status:"online",activities:[{name:"all the servers",type:"WATCHING"}]}),3600000);
    console.log("Ready!");
});

bot.on("interactionCreate", async interaction => {
    if (interaction.channel.isVoice()) return;
    if (interaction.isCommand()) {
        const handler = CommandHandlers[interaction.commandName];
        if (handler) handler(interaction);
        else interaction.reply({ content: ":warning: An internal error occoured, try again later.", ephemeral: true });
    } else if (interaction.isMessageContextMenu()) {
        const handler = MessageContextHandlers[interaction.commandName];
        if (handler) handler(interaction);
        else interaction.reply({ content: ":warning: An internal error occoured, try again later.", ephemeral: true });
    } else if (interaction.isUserContextMenu()) {
        const handler = UserContextHandlers[interaction.commandName];
        if (handler) handler(interaction);
        else interaction.reply({ content: ":warning: An internal error occoured, try again later.", ephemeral: true });
    }
});

bot.on("error", async error => {
    console.warn("An error occoured while communicating with Discord, here's what we got:\n\n", error);
});

// TODO: legacy code
bot.login(process.env.TOKEN).catch(err => console.error("There was a problem logging into Discord, most likely a bad token or no network connection.\n\nHere's what was recieved from Discord:\n", err));
