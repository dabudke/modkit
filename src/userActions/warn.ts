import { UserApplicationCommandData, UserContextMenuInteraction } from "discord.js";
import { timeout } from "../main";
import { Action, newCase } from "../dataManagers/caseManager";
import { hasPermission } from "../utils/checkPerms";
import { displaynameAndTag } from "../utils/userToString";

export const data: UserApplicationCommandData = {
    name: "Warn",
    type: "USER"
};

export async function handler(interaction: UserContextMenuInteraction) {
    await interaction.deferReply();

    const user = await interaction.user;
    const guser = await interaction.guild.members.fetch(user);
    const target = await interaction.targetUser;
    const gtarget = await interaction.guild.members.fetch(target);

    if (!await hasPermission(interaction.guild, user.id, Action.Warn)) {
        await interaction.editReply({ content: ":no_entry_sign: You cannot use that command." });
        await timeout(2000);
        return interaction.deleteReply();
    }

    if (user.id === target.id) {
        await interaction.editReply({ content: ":x: You cannot warn yourself." });
        await timeout(2000);
        return interaction.deleteReply();
    }
    if (target.bot) {
        await interaction.editReply({ content: ":x: You cannot warn bots." });
        await timeout(2000);
        return interaction.deleteReply();
    }

    if (!gtarget.moderatable) {
        await interaction.editReply({ content: `:warning: I cannot moderate ${displaynameAndTag(gtarget)}`});
        await timeout(2000);
        return interaction.deleteReply();
    }

    if (interaction.guild.ownerId !== user.id && guser.roles.highest.comparePositionTo(gtarget.roles.highest) <= 0) {
        await interaction.editReply({ content: `:no_entry_sign: You cannot moderate ${displaynameAndTag(gtarget)}`});
        await timeout(2000);
        return interaction.deleteReply();
    }

    const caseId = await newCase(interaction.guild,user,Action.Warn,null,target);
    await interaction.editReply({ content: `${displaynameAndTag(gtarget)} has been warned.  (Case #${caseId})`});
    await timeout(2000);
    return interaction.deleteReply();
}
