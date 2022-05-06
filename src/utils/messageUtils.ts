import { Message } from "discord.js";
import { timeout } from "../main";

export enum Result {
    SUCCESS = ":white_check_mark:",
    PERMERROR = ":no_entry_sign:",
    ERROR = ":x:",
    INTERNAL = ":warning:"
}

export function generateMessage(result: Result, message: string): string {
    return `${result} ${message}`;
}
export function success(message: string): string { return generateMessage(Result.SUCCESS,message); }
export function permissionError(): string { return generateMessage(Result.PERMERROR,"You cannot use that command."); }
export function error(message: string): string { return generateMessage(Result.ERROR,message); }
export function internalError(): string { return generateMessage(Result.INTERNAL,"An internal error has occoured, please try again later."); }

export async function waitToDelete(message: Message, delay: number = 3000) {
    await timeout(delay);
    message.fetch().then(message.delete);
}