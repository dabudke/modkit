// get libraries and modules
import { Client } from "discord.js";
import { handle as handleCommand } from "./commands/handler";
import { readFile } from "fs";
import { prefix } from "./meta/config";
import { createLocalGuild, getLocalGuild } from "./databases/manager";

// common types
export type GuildId = string;
export type ChannelId = string;
export type RoleId = string;
export type UserId = string;
// import { handle as handleLegacyCommand } from "./commands/handler";

// declare client
const bot = new Client();

bot.once("ready", () => {
    console.log(`Logged in and connected to Discord (Username: ${bot.user.tag})`);
    bot.user.setPresence( { status: "online", activity: { name: "out for ^help", type: "WATCHING" } } );
    bot.guilds.cache.forEach( guild => {
        if (!getLocalGuild(guild.id)) {
            // new guild!
            bot.emit("guildCreate", guild);
        }
    });
});

// TODO: legacy code
// bot.on("message", msg => {
//     if (msg.author.bot) return; // bot exclusion
//     if (!msg.guild) { msg.reply("I do not accept DM commands as of right now, sorry."); return; } // dms
//     if (!msg.content.startsWith(prefix)) levelUpdate(msg); // no prefix?  normal message.
//     // else handleLegacyCommand(msg); // with prefix?  command.
// });

bot.on("error", error => {
    console.warn("An error occoured while communicating with Discord, here's what we got:\n\n", error);
});

bot.on("guildCreate", guild => {
    // todo
    createLocalGuild(guild.id);
    console.log("New guild added!  " + guild.id)
})

readFile("./token.txt", "utf-8", ( err, token ) => {
    if (err) console.error("It appears that there is not a token.txt in the bot's root directory.  Please create the file, and paste your bot token into it.")
    else bot.login(token).catch( err => console.error("There was a problem logging into Discord, most likely a bad token or no network connection.\n\nHere's what was recieved from Discord:\n", err));
});
