import { EmbedFieldData, Guild, Message, MessageEmbed, User } from "discord.js";
import { GuildDb, UserDb } from "../databases/manager";

export enum PunishmentType {
    Warning,
    Mute,
    Kick,
    Ban
}
export type PunishmentId = number;
export interface Punishment {
    type: PunishmentType,
    user: User,
    date: Date,
    punisher: User,
    reason?: string,
    endDate?: Date,
}

export function addPunishment (msg: Message, punishedUser: User, punishmentType: PunishmentType, execute: boolean, reason?: string, endDate?: Date): void {
    const Punishment: Punishment = {
        type: punishmentType,
        user: punishedUser,
        date: new Date(),
        punisher: msg.author,
        reason: reason,
        endDate: endDate
    };

    const LGuild = GuildDb.get(msg.guild.id);
    const LPunishedUser = UserDb.get(punishedUser.id);

    switch (punishmentType) {
        case PunishmentType.Warning: {
            const punishmentIndex = LGuild.modHistory.push(Punishment);
            if (!LGuild.userModHistory.has(punishedUser.id)) {
                LGuild.userModHistory.set(punishedUser.id, []);
            }
            const lguildUser = LGuild.userModHistory.get(punishedUser.id);
            lguildUser.push(punishmentIndex);
            LGuild.userModHistory.set(punishedUser.id, lguildUser);
            GuildDb.update(msg.guild.id, LGuild);
            LPunishedUser.modHistory.warnings += 1;
            UserDb.update(punishedUser.id, LPunishedUser);
            if (reason) msg.reply(`${punishedUser.username} has been warned for ${reason}`);
            else msg.reply(`${punishedUser.username} has been warned.`);
            logPunishment(Punishment, msg.guild);
            break;
        }
    }
}

export function logPunishment (punishment: Punishment, guild: Guild): void {
    const GuildSettings = GuildDb.get(guild.id).settings;
    if (!GuildSettings.modLogChannel.value) return;
    const LogChannel = guild.channels.resolve(GuildSettings.modLogChannel.value as string);
    if (!LogChannel) return;
    if (!LogChannel.isText()) return;

    let embed: MessageEmbed;
    let extraFields: EmbedFieldData[];

    switch (punishment.type) { // punishment-specific fields set in here
        case PunishmentType.Warning:
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

    // LogChannel.send({ embed: embed });
}
