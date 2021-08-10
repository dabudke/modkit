import { Message } from "discord.js";
import { getLocalGuild, updateLocalGuild } from "../databases/manager";

const BaseUpThreshhold = 100; // Base levelup threshhold
const UpMultiplier = 0.5; // Levelup threshhold multiplier per level
const Cooldown = 60000; // Cooldown in milliseconds until next possible point increase
const PointFalloff = 1; // Points subtracted from maximum possible per minute since cooldown expiry

function calculateGain ( timeElapsed: number ) {
    const minutes = Math.floor((timeElapsed / 1000) / 60)
    console.log(minutes);
    console.log(20 - minutes * PointFalloff);
    return 20 - minutes * PointFalloff;
}

export function updatePoints (msg: Message): void {
    const LGuild = getLocalGuild(msg.guild.id);

    if (!LGuild.points.has(msg.author.id)) {
        LGuild.points.set(msg.author.id, { level: 1, points: 0, lastUpdated: 0 });
    }
    const GuildPoints = LGuild.points.get(msg.author.id);
    const TimeElapsed = Date.now() - GuildPoints.lastUpdated
    if (TimeElapsed > Cooldown) {
        const Calculated = calculateGain(TimeElapsed);
        GuildPoints.points += Calculated > 5 ? Calculated : 5;
        GuildPoints.lastUpdated = Date.now();
        const Threshhold = BaseUpThreshhold * (GuildPoints.level * UpMultiplier)
        if (GuildPoints.points >= Threshhold) {
            GuildPoints.points -= Threshhold;
            GuildPoints.level += 1;
            // start levelup message
            const MessageSettings = LGuild.settings.pointNotificationChannel;
            if ( MessageSettings.value == "same" ) {
                msg.channel.send(`Good job, <@${msg.member.nickname ? "!" : ""}${msg.author.id}>!  You've reached level ${GuildPoints.level}`);
            }
        }
        LGuild.points.set(msg.author.id, GuildPoints);
    }
    LGuild.points.set(msg.author.id, GuildPoints);

    updateLocalGuild(msg.guild.id, LGuild);
}

export function updateLevel (guild: string, user: string, msg?: Message): void {
    const LGuild = getLocalGuild(msg.guild.id);
    if (!LGuild.points.has(msg.author.id)) {
        LGuild.points.set(msg.author.id, {level:1, points:1, lastUpdated:0});
    }
    const Points = LGuild.points.get(msg.author.id);

    let Threshhold = BaseUpThreshhold * (Points.level * UpMultiplier);
    while (Points.points >= Threshhold) {
        Points.points -= Threshhold;
        Points.level += 1;
        // start levelup message
        const MessageSettings = LGuild.settings.pointNotificationChannel;
        switch ( MessageSettings.value ) {
            case "same":
                if (msg) msg.channel.send(`Good job, <@${msg.member.nickname ? "!" : ""}${msg.author.id}>!  You've reached level ${Points.level}!`);
        }
        Threshhold = BaseUpThreshhold * (Points.level * UpMultiplier);
    }
}
