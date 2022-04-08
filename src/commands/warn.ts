import { ApplicationCommandData, CommandInteraction, GuildMember } from "discord.js";
import { hasPermission } from "../utils/checkPerms";
import { Action, newCase } from "../utils/caseManager";
import { displaynameAndTag } from "../utils/userToString";

export const data: ApplicationCommandData = {
    name: "warn",
    description: "Warn a user",
    options: [
        {
            name: "target",
            description: "User to warn",
            type: "USER",
            required: true
        }, {
            name: "reason",
            description: "Reason to warn the target",
            type: "STRING"
        }
    ],
    type: "CHAT_INPUT"
};

export async function handler (interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();

    const user = await interaction.user;
    const guser = await interaction.guild.members.fetch(user);
    const target = await interaction.options.getUser("target");
    const gtarget = await interaction.guild.members.fetch(target);

    if (!hasPermission(interaction.guild, user.id, Action.Warn)) {
        interaction.editReply({ content: ":no_entry_sign: You cannot use that command."});
        return;
    }

    if (user.id === target.id) {
        interaction.editReply({ content: ":x: You cannot warn yourself!"});
        return;
    }
    if (target.bot) {
        interaction.editReply({ content: ":x: You cannot warn bots!"});
        return;
    }

    if (!gtarget.moderatable) {
        interaction.editReply({ content: `:warning: I cannot moderate ${displaynameAndTag(gtarget)}, try moving my role(s) above theirs.` });
        return;
    }

    if (interaction.guild.ownerId !== user.id && guser.roles.highest.comparePositionTo(gtarget.roles.highest) <= 0) {
        interaction.editReply({ content: `:no_entry_sign: You cannot moderate ${displaynameAndTag(gtarget)}.` });
        return;
    }
    
    const reason = interaction.options.getString("reason",false);
    const caseId = newCase(interaction.guild,user,Action.Warn,reason,target);
    await interaction.editReply({ content: `${displaynameAndTag(gtarget)} has been warned${reason ? ` for '${reason}'` : ""}. (Case #${caseId})`});
}