import { name, prefix } from "./about";

export interface CompressedEmbed {
    title: string,
    description: string,
    url: string,
    fields: Array<{ name: string, value: string }>
};

export type HelpEmbeds = CompressedEmbed[];

export const helpDefault: HelpEmbeds = [
    {
        title: `Help`,
        description: `Use \`${prefix}help\` and include a category or command (listed below) to see all commands in that category, or how to use that command.`,
        url: "https://allydiscord.github.io/docs/commands/",
        fields: [
            {
                name: "Moderation Commands",
                value: `${prefix}warn (${prefix}!) - Warn a user.\n${prefix}ban (${prefix}tempban) - Ban a user.\n${prefix}mute (${prefix}tempmute) - Mute a user, preventing them from speaking in text channels.\n**+4 more**`
            }, {
                name: "Utility Commands",
                value: `${prefix}help (${prefix}?) - Show an index of commands, and how to use them.\n${prefix}settings (${prefix}setting, ${prefix}sets, ${prefix}set) - Change and view settings for the current server.\n${prefix}usersettings (${prefix}usersetting, ${prefix}usersets, ${prefix}userset) - Change and view your personal settings.\n**+1 more**`
            }, {
                name: "Leveling Commands",
                value: `${prefix}level (${prefix}lvl) - Check the server level of a user.\n${prefix}setlevel (${prefix}setlvl) - Set the server level of a user.\n${prefix}globallevel (${prefix}globallvl, ${prefix}glevel, ${prefix}glvl) - Check your global ${name} level.`
            }, {
                name: "Other Commands",
                value: `${prefix}about - Get information about ${name}\n${prefix}feedback (${prefix}fb) - Provide feedback for the developers of ${name}\n${prefix}bugreport (${prefix}reportbug, ${prefix}bug) - Report a bug to the developers of ${name}\n**+1 more**`
            }
        ]
    }
];

export const helpModeration: HelpEmbeds = [
    {
        title: `Moderation Commands | Help`,
        description: "Commands to help you moderate your server.",
        url: "https://allydiscord.github.io/docs/commands/moderation",
        fields: [
            {
                name: `${prefix}warn (${prefix}!)`,
                value: "Warn a user."
            },
            {
                name: `${prefix}ban (${prefix}tempban)`,
                value: "Ban a user."
            },
            {
                name: `${prefix}mute (${prefix}tempmute)`,
                value: "Mute a user, preventing them from talking in text channels."
            },
            {
                name: `${prefix}unban (${prefix}removeban, ${prefix}uban)`,
                value: "Unban a user, regardless of the time left on their ban."
            },
            {
                name: `${prefix}kick`,
                value: "Kick a user from the server."
            },
            {
                name: `${prefix}unmute (${prefix}removemute, ${prefix}umute)`,
                value: "Unmute a user, regardless of the time left on their mute."
            },
            {
                name: `${prefix}modhistory (${prefix}history)`,
                value: "See or clear the moderation history of a user."
            }
        ]
    }
];

export const helpUtility: HelpEmbeds = [
    {
        title: `Utility Commands | Help`,
        description: `Commands to configure ${name} and this server to your liking.`,
        url: "https://allydiscord.github.io/docs/commands/utility/",
        fields: [
            {
                name: `${prefix}help (${prefix}?)`,
                value: "Show an index of commands, and how to use them."
            },
            {
                name: `${prefix}settings (${prefix}setting, ${prefix}sets, ${prefix}set)`,
                value: "Change and view settings for the current server."
            },
            {
                name: `${prefix}usersettings (${prefix}usersetting, ${prefix}usersets, ${prefix}userset)`,
                value: "Change and view your personal settings."
            },
            {
                name: `${prefix}delete (${prefix}purge, ${prefix}massdelete)`,
                value: "Mass delete messages from the current channel."
            }
        ]
    }
];

export const helpLeveling: HelpEmbeds = [
    {
        title: "Leveling Commands | Help",
        description: "Commands for managing your per-server levels and global level.",
        url: "https://allydiscord.github.io/docs/commands/leveling/",
        fields: [
            {
                name: `${prefix}level (${prefix}lvl)`,
                value: "Check the server level of a user."
            },
            {
                name: `${prefix}setlevel (${prefix}setlvl)`,
                value: "Set the server level of a user."
            },
            {
                name: `${prefix}globallevel (${prefix}globallvl, ${prefix}glevel, ${prefix}glvl)`,
                value: `Check your global ${name} level.`
            }
        ]
    }
]

export const helpOther: HelpEmbeds = [
    {
        title: "Other Commands | Help",
        description: "Commands that only exist for one niche purpose",
        url: "https://allydiscord.github.io/docs/commands/other/",
        fields: [
            {
                name: `${prefix}about`,
                value: `Displays information about ${name}`
            },
            {
                name: `${prefix}feedback (${prefix}fb)`,
                value: `Provide feedback to the developers of ${name}`
            },
            {
                name: `${prefix}bugreport (${prefix}reportbug, ${prefix}bug)`,
                value: `Report a bug to the developers of ${name}`
            },
            {
                name: `${prefix}ping`,
                value: `Ping ${name}`
            }
        ]
    }
]
