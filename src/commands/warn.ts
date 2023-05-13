import { ApplicationCommandData, CommandInteraction } from "discord.js";
import { hasPermission } from "../utils/checkPerms";
import { UserActionType, addCase } from "../dataManagers/caseManager";
import { displaynameAndTag } from "../utils/userToString";
import { timeout } from "../main";
import { handle } from "../dataManagers/errorManager";

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

    if (!await hasPermission(interaction.guild, user.id, UserActionType.Warn)) {
        await interaction.editReply({ content: ":no_entry_sign: You cannot use that command." });
        await timeout(2000);
        return interaction.deleteReply().catch(handle("warn_replyDeleted"));
    }

    if (user.id === target.id) {
        await interaction.editReply({ content: ":x: You cannot warn yourself." });
        await timeout(2000);
        return interaction.deleteReply().catch(handle("warn_replyDeleted"));
    }
    if (target.bot) {
        await interaction.editReply({ content: ":x: You cannot warn bots." });
        await timeout(2000);
        return interaction.deleteReply().catch(handle("warn_replyDeleted"));
    }

    if (!gtarget.moderatable) {
        await interaction.editReply({ content: `:warning: I cannot moderate ${displaynameAndTag(gtarget)}`});
        await timeout(2000);
        return interaction.deleteReply().catch(handle("warn_replyDeleted"));
    }

    if (interaction.guild.ownerId !== user.id && guser.roles.highest.comparePositionTo(gtarget.roles.highest) <= 0) {
        await interaction.editReply({ content: `:no_entry_sign: You cannot moderate ${displaynameAndTag(gtarget)}`});
        await timeout(2000);
        return interaction.deleteReply().catch(handle("warn_replyDeleted"));
    }
    
    const reason = interaction.options.getString("reason",false);
    const caseId = await addCase(interaction.guild,user,UserActionType.Warn,new Date(),target,reason);
    await interaction.editReply({ content: `:white_check_mark: ${displaynameAndTag(gtarget)} has been warned${reason ? ` for '${reason}'` : ""}. (Case #${caseId})`});
    await timeout(2000);
    return interaction.deleteReply().catch(handle("warn_replyDeleted"));
}