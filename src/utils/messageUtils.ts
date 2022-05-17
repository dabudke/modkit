import { Message } from "discord.js";
import { timeout } from "../main";

export const successMessage = (msg) => `:white_check_mark: ${msg}`;
export const errorMessage = (msg) => `:x: ${msg}`;
export const permissionError = ":no_entry_sign: You cannot use that command.";
export const internalError = ":warning: An internal error has occoured, please try again later.";

export async function waitToDelete(message: Message, delay: number = 3000) {
    await timeout(delay);
    message.fetch().then(message.delete);
}