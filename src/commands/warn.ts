import { Message } from "discord.js";
import { HelpEmbeds } from "../meta/embeds";
import { Actions, hasPermission } from "../utils/checkPerms";
import { addPunishment, Punishments } from "../utils/punishmentManager";

export function handle (args: string[], msg: Message) {
    if (!hasPermission(msg.guild, msg.member, Actions.WarnUser)) {
        msg.reply("you do not have permission to use that command.");
        return;
    }
    
    if (!args[0]) {
        msg.reply("you must mention a user.");
        return;
    }
    if (args[0].startsWith("<@")) {
        var warnedUserID: string = args[0].slice(2, -1);
        if (warnedUserID.startsWith("!")) warnedUserID = warnedUserID.slice(1);
    } else var warnedUserID: string = args[0];
    const warnedUser = msg.guild.members.resolve(warnedUserID).user;
    if (!warnedUser) {
        msg.reply("you must mention a user.");
        return;
    }
    
    args.shift();
    var reason = args.join(" ");
    addPunishment(msg, warnedUser, Punishments.Warning, true, reason);
}

export const helpEmbed: HelpEmbeds = [
    {
        title: `warn (user) [reason...]`,
        description: "Warn a user.",
        url: "/docs/commands/moderation/warn/",
        fields: [
            {
                name: "(user)",
                value: "**Required.**  User to warn."
            },
            {
                name: "[reason...]",
                value: "**Optional.  Long-form.**  Reason to warn the user."
            },
            {
                name: "Aliases",
                value: `@p!`
            }
        ]
    }
];
