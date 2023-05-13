import { ChatInputApplicationCommandData, CommandInteraction, TextChannel } from "discord.js";
import { addCase, MessageActionType } from "../dataManagers/caseManager";
import { hasPermission } from "../utils/checkPerms";
import { errorMessage, permissionError, successMessage, waitToDeleteInteraction, waitToDeleteMessage } from "../utils/messageUtils";
import { parsePast } from "../utils/timeParser";

export const data: ChatInputApplicationCommandData = {
    name: "purge",
    description: "Purge messages from a text chat",
    type: "CHAT_INPUT",
    options: [
        {
            name: "amount",
            description: "Purge a number of messages",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "number",
                    description: "Number of messages to purge",
                    type: "INTEGER",
                    required: true
                }, {
                    name: "reason",
                    description: "Reason to purge messages",
                    type: "STRING"
                }
            ]
        }, {
            name: "until",
            description: "Purge until a specific message",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "message",
                    description: "Message ID to purge until",
                    type: "STRING",
                    required: true,
                }, {
                    name: "reason",
                    description: "Reason to purge messages",
                    type: "STRING"
                }
            ]
        }, {
            name: "last",
            description: "Purge all messages in a certain time period",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "time",
                    description: "Period of time to purge messages in",
                    type: "STRING",
                    required: true,
                }, {
                    name: "reason",
                    description: "Reason to purge messages",
                    type: "STRING"
                }
            ]
        }, {
            name: "from",
            description: "Purge all messages between two messages",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "start",
                    description: "Message to purge from",
                    type: "STRING",
                    required: true,
                }, {
                    name: "end",
                    description: "Message to purge until",
                    type: "STRING",
                    required: true,
                }, {
                    name: "reason",
                    description: "Reason to purge messages",
                    type: "STRING"
                }
            ]
        }, {
            name: "user",
            description: "Purge all messages from a user",
            type: "SUB_COMMAND_GROUP",
            options: [
                {
                    name: "amount",
                    description: "Purge a number of messages from a user",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "user",
                            description: "User to purge messages from",
                            type: "USER",
                            required: true,
                        }, {
                            name: "number",
                            description: "Number of messages to purge",
                            type: "INTEGER",
                            required: true,
                        }, {
                            name: "reason",
                            description: "Reason to purge messages",
                            type: "STRING"
                        }
                    ]
                }, {
                    name: "last",
                    description: "Purge all messages from a user in a certain time period",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "user",
                            description: "User to purge messages from",
                            type: "USER",
                            required: true,
                        }, {
                            name: "time",
                            description: "Time period to delete messages in",
                            type: "INTEGER",
                            required: true,
                        }, {
                            name: "reason",
                            description: "Reason to purge messages",
                            type: "STRING"
                        }
                    ]
                }
            ]
        }
    ]
};

export async function handler(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();
    if (!await hasPermission(interaction.guild,interaction.user.id,MessageActionType.Purge)) {
        await interaction.editReply({ content: permissionError });
        return waitToDeleteInteraction(interaction);
    }
    if (interaction.channel instanceof TextChannel) {
        switch (interaction.options.getSubcommand()) {
            case "amount": {
                const amount = interaction.options.getInteger("number") +1, reason = interaction.options.getString("reason"), deleted = await interaction.channel.bulkDelete(amount);
                const caseId = await addCase(interaction.guild,interaction.user,MessageActionType.Purge,new Date(), deleted.size -1, reason);
                const reply = await interaction.channel.send({ content: successMessage(`Purged **${deleted.size -1}** messages${reason ? ` for '${reason}'` : ""}.  (Case #${caseId})`)});
                return waitToDeleteMessage(await interaction.channel.messages.resolve(reply));
            }
            case "until": {
                const messageId = interaction.options.getString("message"), message = await interaction.channel.messages.fetch(messageId), reply = await interaction.fetchReply(), reason = interaction.options.getString("reason");
                await interaction.channel.messages.fetch();
                const toDelete = await interaction.channel.messages.cache.clone().filter( gotMsg => {
                    return gotMsg.createdTimestamp > message.createdTimestamp && gotMsg.id !== reply.id;
                }), deleted = await interaction.channel.bulkDelete(toDelete);
                const caseId = await addCase(interaction.guild,interaction.user,MessageActionType.Purge,new Date(),deleted.size-1,reason);
                await interaction.editReply({ content: successMessage(`Purged **${deleted.size}** messages${reason ? ` for ${reason}` : ""}.  (Case #${caseId})`)});
                return waitToDeleteInteraction(interaction);
            }
            case "last": {
                await interaction.channel.messages.fetch();
                const time = parsePast(interaction.options.getString("time"),interaction.createdTimestamp),
                reason = interaction.options.getString("reason"),
                reply = await interaction.fetchReply(),
                toDelete = await interaction.channel.messages.cache.clone().filter(msg=>msg.createdTimestamp>=time.getTime()&&msg.id!==reply.id),
                deleted = await interaction.channel.bulkDelete(toDelete),
                caseId = await addCase(interaction.guild,interaction.user,MessageActionType.Purge,new Date(),deleted.size-1,reason);
                await interaction.editReply({ content: successMessage(`Purged **${deleted.size}** messages${reason ? ` for '${reason}'` : ''}  (Case #${caseId})`)});
                return waitToDeleteInteraction(interaction);
            }
        }
    } else {
        await interaction.editReply({ content: errorMessage("You cannot do that here.") });
        return waitToDeleteInteraction(interaction);
    }
}
