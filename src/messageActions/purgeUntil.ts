import { MessageApplicationCommandData, MessageContextMenuInteraction, TextChannel } from "discord.js";
import { timeout } from "../main";
import { MessageActionType, addCase } from "../dataManagers/caseManager";
import { hasPermission } from "../utils/checkPerms";
import { handle } from "../dataManagers/errorManager";
import { errorMessage, waitToDeleteInteraction } from "../utils/messageUtils";

export const data: MessageApplicationCommandData = {
    name: "Purge Until Here",
    type: "MESSAGE"
};

export async function handler(interaction: MessageContextMenuInteraction): Promise<void> {
    await interaction.deferReply();
    const reply = await interaction.fetchReply();
    if (!await hasPermission(interaction.guild, interaction.user.id, MessageActionType.Purge)) {
        await interaction.editReply({ content: ":no_entry_sign: You cannot use that command."});
        await timeout(2000);
        interaction.deleteReply().catch(handle("purgeUntilMessage_replyDeleted"));
        return;
    }
    if (interaction.channel instanceof TextChannel) {
        await interaction.channel.messages.fetch();
        const message = await interaction.channel.messages.fetch(interaction.targetId),
        toDelete = await interaction.channel.messages.cache.clone().filter( gotMsg => {
            return gotMsg.createdTimestamp > message.createdTimestamp && gotMsg.id !== reply.id;
        }),
        filtered = toDelete.filter((msg) => (Date.now() - msg.createdTimestamp) < 1209600000),
        deleted = await interaction.channel.bulkDelete(filtered);
        if (deleted.size === 0) {
            await interaction.editReply({ content: errorMessage("No messages could be deleted.")});
        } else {
            const caseId = await addCase(interaction.guild,interaction.user,MessageActionType.Purge,new Date(),deleted.size);
            await interaction.editReply({ content: `:white_check_mark: Purged **${deleted.size}** messages. (Case #${caseId})`});
        }
        waitToDeleteInteraction(interaction);
    } else await interaction.editReply({content: ":no_entry_sign: You cannot do that here."});
}
