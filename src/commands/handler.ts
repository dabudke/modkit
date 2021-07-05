import { Message } from "discord.js";
import { prefix } from "../meta/config";
import { handle as ping } from "./ping";
import { handle as settings } from "./settings";
import { handle as help } from "./help";
import { handle as warn } from "./warn";
import { handle as about } from "./about";

export function handle (msg: Message): void {
    const args = msg.content.slice(prefix.length).split(/[ \n]+/g);
    const cmd = args.shift().toLowerCase();
    
    switch (cmd) {
        case "ping":
            ping(msg);
            break;

        case "help":
        case "?":
            help(msg, args);
            break;

        case "about":
            about(msg);
            break;

        case "settings":
        case "setting":
        case "sets":
        case "set":
            settings(msg, args);
            break;

        case "warn":
        case "!":
            warn(args, msg);
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

        default:
            msg.reply(`I couldn't understand that command.  Try typing it again, or using \`${prefix}help\` for other commands to try.`);
            break;
    }
}
