import { ChatInputApplicationCommandData, CommandInteraction, TextChannel } from "discord.js";
import { Action, newCase } from "../dataManagers/caseManager";
import { handle } from "../dataManagers/errorManager";
import { timeout } from "../main";
import { hasPermission } from "../utils/checkPerms";
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

export async function handler(interaction: CommandInteraction) {
    await interaction.deferReply();
    if (!await hasPermission(interaction.guild,interaction.user.id,Action.Purge)) {
        await interaction.editReply({ content: ":no_entry_sign: You cannot use that command." });
        await timeout(2000);
        return interaction.deleteReply().catch(handle("purge_deletedReply"));
    }
    if (interaction.channel instanceof TextChannel) {
        switch (interaction.options.getSubcommand()) {
            case "amount": {
                const amount = interaction.options.getInteger("number") +1, reason = interaction.options.getString("reason"), deleted = await interaction.channel.bulkDelete(amount);
                const caseId = await newCase(interaction.guild,interaction.user,Action.Purge,reason);
                const reply = await interaction.channel.send({ content: `:white_check_mark: Purged **${deleted.size -1}** messages${reason ? ` for '${reason}'` : ""}.  (Case #${caseId})`});
                await timeout(3000);
                return interaction.channel.messages.delete(reply).catch(handle("purgeAmount_deletedReply"));
            }
            case "until": {
                const messageId = interaction.options.getString("message"), message = await interaction.channel.messages.fetch(messageId), reply = await interaction.fetchReply(), reason = interaction.options.getString("reason");
                await interaction.channel.messages.fetch();
                const toDelete = await interaction.channel.messages.cache.clone().filter( gotMsg => {
                    return gotMsg.createdTimestamp > message.createdTimestamp && gotMsg.id !== reply.id;
                }), deleted = await interaction.channel.bulkDelete(toDelete);
                const caseId = await newCase(interaction.guild,interaction.user,Action.Purge,reason);
                await interaction.editReply({ content: `:white_check_mark: Purged **${deleted.size}** messages${reason ? ` for ${reason}` : ""}.  (Case #${caseId})`});
                await timeout(3000);
                return interaction.deleteReply().catch(handle("purgeUntil_deletedReply"));
            }
            case "last": {
                await interaction.channel.messages.fetch();
                const time = parsePast(interaction.options.getString("time"),interaction.createdTimestamp),
                reason = interaction.options.getString("reason"),
                reply = await interaction.fetchReply(),
                toDelete = await interaction.channel.messages.cache.clone().filter(msg=>msg.createdTimestamp>=time.getTime()&&msg.id!==reply.id),
                deleted = await interaction.channel.bulkDelete(toDelete),
                caseId = await newCase(interaction.guild,interaction.user,Action.Purge,reason);
                await interaction.editReply({ content: `:white_check_mark: Purged **${deleted.size}** messages${reason ? ` for '${reason}'` : ''}  (Case #${caseId})`});
                await timeout(3000);
                return interaction.deleteReply().catch(handle("purgeLast_deletedReply"));
            }
        }
    } else {
        await interaction.editReply({ content: ":x: You cannot do that here" });
        await timeout(3000);
        interaction.deleteReply().catch(handle("purge_deletedReply"));
    }
}
