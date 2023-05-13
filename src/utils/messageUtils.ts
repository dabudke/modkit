import { CommandInteraction, Message, MessageComponentInteraction, MessageContextMenuInteraction } from "discord.js";
import { timeout } from "../main";

export const successMessage = (msg: string): string => `:white_check_mark: ${msg}`;
export const errorMessage = (msg: string): string => `:x: ${msg}`;
export const permissionError = ":no_entry_sign: You cannot use that command.";
export const internalError = ":warning: An internal error has occoured, please try again later.";

export async function waitToDeleteMessage(message: Message, delay = 3000): Promise<void> {
    await timeout(delay);
    message.delete().catch(console.error);
}

export async function waitToDeleteInteraction(interaction: CommandInteraction | MessageComponentInteraction | MessageContextMenuInteraction, delay = 3000): Promise<void> {
    await timeout(delay);
    interaction.deleteReply().catch(console.error);
}
