import { MessageApplicationCommandData, MessageContextMenuInteraction, TextChannel } from "discord.js";
import { timeout } from "../main";
import { Action, newCase } from "../utils/caseManager";
import { hasPermission } from "../utils/checkPerms";

export const data: MessageApplicationCommandData = {
    name: "Purge Until Here",
    type: "MESSAGE"
};

export async function handler(interaction: MessageContextMenuInteraction): Promise<void> {
    await interaction.deferReply();
    const reply = await interaction.fetchReply();
    if (!await hasPermission(interaction.guild, interaction.user.id, Action.Purge)) {
        await interaction.editReply({ content: ":no_entry_sign: You cannot use that command."});
        await timeout(2000);
        interaction.deleteReply();
        return;
    }
    if (interaction.channel instanceof TextChannel) {
        await interaction.channel.messages.fetch();
        const message = await interaction.channel.messages.fetch(interaction.targetId);
        const toDelete = await interaction.channel.messages.cache.clone().filter( gotMsg => {
            return gotMsg.createdTimestamp > message.createdTimestamp && gotMsg.id !== reply.id;
        });
        const deleted = await interaction.channel.bulkDelete(toDelete);
        const caseId = await newCase(interaction.guild,interaction.user,Action.Purge);
        await interaction.editReply({ content: `:white_check_mark: Purged **${deleted.size}** messages. (Case #${caseId})`});
        await timeout(3000);
        await interaction.deleteReply();
    } else await interaction.editReply({content: ":no_entry_sign: You cannot do that here."});
}
