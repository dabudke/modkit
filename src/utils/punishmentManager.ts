import { EmbedFieldData, Guild, Message, MessageEmbed, User } from "discord.js";
import { getLocalGuild, getLocalUser, updateLocalGuild, updateLocalUser } from "../databases/manager";

type UserId = string;
export enum Punishments {
    Warning,
    Mute,
    Kick,
    Ban
}
export type PunishmentId = number;
export interface Punishment {
    type: Punishments,
    user: User,
    date: Date,
    punisher: User,
    reason?: string,
    endDate?: Date,
};

export function addPunishment (msg: Message, punishedUser: User, punishmentType: Punishments, execute: boolean, reason?: string, endDate?: Date) {
    var punishment: Punishment = {
        type: punishmentType,
        user: punishedUser,
        date: new Date(),
        punisher: msg.author,
        reason: reason,
        endDate: endDate
    };

    var lguild = getLocalGuild(msg.guild.id);
    var lpunishedUser = getLocalUser(punishedUser.id);

    switch (punishmentType) {
        case Punishments.Warning:
            var punishmentIndex = lguild.modHistory.push(punishment);
            if (!lguild.userModHistory.has(punishedUser.id)) {
                lguild.userModHistory.set(punishedUser.id, []);
            }
            var lguildUser = lguild.userModHistory.get(punishedUser.id);
            lguildUser.push(punishmentIndex);
            lguild.userModHistory.set(punishedUser.id, lguildUser);
            updateLocalGuild(msg.guild.id, lguild);
            lpunishedUser.modHistory.warnings += 1;
            updateLocalUser(punishedUser.id, lpunishedUser);
            if (reason) msg.reply(`${punishedUser.username} has been warned for ${reason}`)
            else msg.reply(`${punishedUser.username} has been warned.`)
            logPunishment(punishment, msg.guild);
            break;
    }
};

export function logPunishment (punishment: Punishment, guild: Guild) {
    var GuildSettings = getLocalGuild(guild.id).settings;
    if (!GuildSettings.modLogChannel.value) return;
    var LogChannel = guild.channels.resolve(GuildSettings.modLogChannel.value);
    if (!LogChannel) return;
    if (!LogChannel.isText()) return;

    var embed: MessageEmbed;
    var extraFields: EmbedFieldData[];

    switch (punishment.type) { // punishment-specific fields set in here
        case Punishments.Warning:
            if (!GuildSettings.logUserWarns.value) return;
            embed = new MessageEmbed();
            embed.setColor(0xFFFF00);
            embed.setAuthor("User Warned", punishment.user.avatarURL());
    }

    embed.setTimestamp(new Date());
    embed.addFields([
        {
            name: "Punished User",
            value: `${punishment.user.username}#${punishment.user.discriminator} (${punishment.user.id})`
        },
        {
            name: "Reason",
            value: punishment.reason ? punishment.reason : "None given",
            inline: true
        },
        {
            name: "Punishing User",
            value: `${punishment.punisher.username}#${punishment.punisher.discriminator} (${punishment.punisher.id})`,
            inline: true
        }
    ]);
    if (extraFields) embed.addFields(extraFields);

    LogChannel.send({ embed: embed });
}
