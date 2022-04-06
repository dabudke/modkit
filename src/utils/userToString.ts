import { GuildMember, User } from "discord.js";

export function username(user: User): string {
    return `**${user.username}**`;
}

export function usernameAndTag(user: User): string {
    return `**${user.tag}**`;
}

export function displayName(user: GuildMember) {
    return `**${user.displayName}`;
}

export function displaynameAndTag(user: GuildMember) {
    return user.nickname ? `**${user.nickname}** (${user.user.tag})` : `**${user.user.tag}**`;
}
