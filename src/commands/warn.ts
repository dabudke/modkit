import { ApplicationCommandData, CommandInteraction, GuildMember } from "discord.js";
import { Actions, hasPermission } from "../utils/checkPerms";
import { addPunishment, PunishmentType } from "../utils/punishmentManager";
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

    const user = await interaction.member as GuildMember;
    const target = await interaction.options.getMember("target") as GuildMember;

    if (!hasPermission(user.permissions, Actions.WarnUser)) {
        interaction.editReply({ content: ":no_entry_sign: You cannot use that command."});
        return;
    }

    if (user === target) {
        interaction.editReply({ content: ":exclamation: You cannot warn yourself!"});
        return;
    }

    if (target.user.bot) {
        interaction.editReply({ content: ":exclamation: You cannot warn bots!"});
    }

    if (!target.moderatable) {
        interaction.editReply({ content: `:warning: I cannot moderate ${displaynameAndTag(target)}, try moving my role(s) above theirs.` });
        return;
    }
    if (user.roles.highest.comparePositionTo(target.roles.highest) <= 0) {
        interaction.editReply({ content: `:no_entry_sign: You cannot moderate ${displaynameAndTag(target)}.` });
        return;
    }
    
    const reason = interaction.options.getString("reason",false);
    const caseId = addPunishment(interaction.guild,user.user,target.user,PunishmentType.Warning,reason);
    await interaction.editReply({ content: `${displaynameAndTag(target)} has been warned${reason ? ` for '${reason}'` : ""}. (Case #${caseId})`});
}