import { MessageApplicationCommandData, MessageContextMenuInteraction, TextChannel } from "discord.js";
import { timeout } from "../main";
import { Actions, hasPermission } from "../utils/checkPerms";

export const data: MessageApplicationCommandData = {
    name: "Purge Until Here",
    type: "MESSAGE"
};

export async function handler(interaction: MessageContextMenuInteraction): Promise<void> {
    await interaction.deferReply();
    const reply = await interaction.fetchReply();
    if (!hasPermission(interaction.memberPermissions, Actions.Purge)) {await interaction.editReply({ content: ":no_entry_sign: You cannot use that command."}); return;}
    if (interaction.channel instanceof TextChannel) {
        await interaction.channel.messages.fetch();
        const message = await interaction.channel.messages.fetch(interaction.targetId);
        const toDelete = await interaction.channel.messages.cache.clone().filter( gotMsg => {
            return gotMsg.createdTimestamp > message.createdTimestamp && gotMsg.id !== reply.id;
        });
        await interaction.channel.bulkDelete(toDelete);
        await interaction.editReply({ content: `:white_check_mark: Purged **${toDelete.size}** messages.`});
        await timeout(4000);
        await interaction.deleteReply();
    } else await interaction.editReply({content: ":no_entry_sign: You cannot do that here."});
}