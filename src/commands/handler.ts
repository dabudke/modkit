import { Message } from "discord.js";
import { prefix } from "../meta/about";
import * as pingCmd from "./ping";
import * as settingsCmd from "./settings";
import * as helpCmd from "./help";
// import * as warnCmd from "./warn";
// import * as aboutCmd from "./about";

export function handle (msg: Message) {
    const args = msg.content.slice(prefix.length).split(/[ \n]+/g);
    const cmd = args.shift().toLowerCase();
    
    switch (cmd) {
        case "ping":
            pingCmd.execute(msg);
            break;

        case "help":
        case "?":
            helpCmd.handle(msg, args);
            break;

        case "about":
            msg.reply("that command has not been implemented yet.");
            break;

        case "settings":
        case "setting":
        case "sets":
        case "set":
            msg.reply("that command has not been implemented yet.");
            break;

        case "warn":
        case "!":
            msg.reply("that command has not been implemented yet.");
            break;

        case "feedback":
        case "fb":
            msg.reply("head over to our GitHub page to give feedback, please!\nhttps://github.com/allydiscord/ally/issues/");
            break;

        case "bugreport":
        case "reportbug":
        case "bug":
            msg.reply("please go to our GitHub page to report bugs and submit feedback.  https://github.com/allydiscord/ally/issues");
            break;

        case "usersettings":
        case "usersetting":
        case "usersets":
        case "userset":
            msg.reply("that command has not been implemented yet.");
            break;

        case "modhistory":
        case "history":
            msg.reply("that command has not been implemented yet.");
            break;
        
        case "clearmodhistory":
        case "clearhistory":
            msg.reply("that command has not been implemented yet.");
            break;
        
        case "level":
        case "lvl":
            msg.reply("that command has not been implemented yet.");
            break;

        case "globallevel":
        case "globallvl":
        case "glevel":
        case "glvl":
            msg.reply("that command has not been implemented yet.");
            break;

        case "permissions":
        case "permission":
        case "perms":
        case "perm":
            msg.reply("that command has not been implemented yet.");
            break;

        default:
            msg.reply(`I couldn't understand that command.  Try typing it again, or using \`${prefix}help\` for other commands to try.`);
            break;
    }
}
