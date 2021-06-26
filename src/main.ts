// get libraries and modules
import { Client } from "discord.js";
import { getLocalGuild, createLocalGuild } from "./databases/manager";
import { handle as handleCommand } from "./commands/handler";
import { readFile } from "fs";
import { prefix } from "./meta/config";

// declare client
const bot = new Client();

bot.once("ready", () => {
    console.log(`Logged in and connected to Discord (Username: ${bot.user.tag})`);
    bot.user.setPresence( { status: "online", activity: { name: "out for ^help", type: "WATCHING" } } );

    bot.guilds.cache.forEach(guild => {
        if (!getLocalGuild(guild.id)) {
            createLocalGuild(guild.id);
        }

        /* TODO: initial guild join mock event */
    });
});

bot.on("message", msg => {
    // filters
    if (msg.author.bot) return;
    if (!msg.guild) { msg.reply("I do not accept DM commands as of right now, sorry."); return; /* TODO: DM commands */ }

    // points

    if (!msg.content.startsWith(prefix)) return;

    handleCommand(msg);
});

bot.on("error", error => {
    console.warn("An error occoured while communicating with Discord, here's what we got:\n\n", error);
});

readFile("./token.txt", "utf-8", ( err, token ) => {
    if (err) console.error("It appears that there is not a token.txt in the bot's root directory.  Please create the file, and paste your bot token into it.")
    else bot.login(token).catch( err => console.error("There was a problem logging into Discord, most likely a bad token or no network connection.\n\nHere's what was recieved from Discord:\n", err));
});
