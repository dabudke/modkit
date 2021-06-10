// get libraries and modules
import { Client } from "discord.js";
import { getLocalGuild, createLocalGuild } from "./databases/manager";
import { handle as handleCommand } from "./commands/handler";
import { readFileSync } from "fs";
import { prefix } from "./meta/about";

// get meta files
const token = readFileSync("./token.txt", { encoding: "utf-8" });

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
})

bot.login(token).catch( error => {
    console.error("There was a problem logging into Discord, most likely a bad token or no network connection.\nThis is what we got from Discord:\n\n", error);
});
