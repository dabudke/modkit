//#region Help Embeds
export type HelpEmbeds = {
    title: string,
    description: string,
    url: string,
    fields?: Array<{
        name: string,
        value: string,
        inline?: boolean
    }>
}[];

export const helpDefault: HelpEmbeds = [
    {
        title: `Help`,
        description: `Use \`@phelp\` and include a category or command (listed below) to see all commands in that category, or how to use that command.`,
        url: "/docs/commands/",
        fields: [
            {
                name: "Moderation Commands",
                value: `@pwarn (@p!) - Warn a user.\n@pban (@ptempban) - Ban a user.\n@pmute (@ptempmute) - Mute a user, preventing them from speaking in text channels.\n**+4 more**`
            }, {
                name: "Utility Commands",
                value: `@phelp (@p?) - Show an index of commands, and how to use them.\n@psettings (@psetting, @psets, @pset) - Change and view settings for the current server.\n@pusersettings (@pusersetting, @pusersets, @puserset) - Change and view your personal settings.\n**+1 more**`
            }, {
                name: "Leveling Commands",
                value: `@plevel (@plvl) - Check the server level of a user.\n@psetlevel (@psetlvl) - Set the server level of a user.\n@pgloballevel (@pgloballvl, @pglevel, @pglvl) - Check your global @n level.`
            }, {
                name: "Other Commands",
                value: `@pabout - Get information about @n\n@pfeedback (@pfb) - Provide feedback for the developers of @n\n@pbugreport (@preportbug, @pbug) - Report a bug to the developers of @n\n**+1 more**`
            }
        ]
    }
];

export const helpModeration: HelpEmbeds = [
    {
        title: `Moderation Commands | Help`,
        description: "Commands to help you moderate your server.",
        url: "/docs/commands/moderation",
        fields: [
            {
                name: "@pwarn (@p!)",
                value: "Warn a user."
            },
            {
                name: "@pban (@ptempban)",
                value: "Ban a user."
            },
            {
                name: "@pmute (@ptempmute)",
                value: "Mute a user, preventing them from talking in text channels."
            },
            {
                name: "@punban (@premoveban, @puban)",
                value: "Unban a user, regardless of the time left on their ban."
            },
            {
                name: "@pkick",
                value: "Kick a user from the server."
            },
            {
                name: "@punmute (@premovemute, @pumute)",
                value: "Unmute a user, regardless of the time left on their mute."
            },
            {
                name: "@pmodhistory (@phistory)",
                value: "See or clear the moderation history of a user."
            }
        ]
    }
];

export const helpUtility: HelpEmbeds = [
    {
        title: "Utility Commands | Help",
        description: `Commands to configure @n and this server to your liking.`,
        url: "/docs/commands/utility/",
        fields: [
            {
                name: `@phelp (@p?)`,
                value: "Show an index of commands, and how to use them."
            },
            {
                name: `@psettings (@psetting, @psets, @pset)`,
                value: "Change and view settings for the current server."
            },
            {
                name: `@pusersettings (@pusersetting, @pusersets, @puserset)`,
                value: "Change and view your personal settings."
            },
            {
                name: `@pdelete (@ppurge, @pmassdelete)`,
                value: "Mass delete messages from the current channel."
            },
            {
                name: `@pannounce`,
                value: "Send announcements to a dedicated channel."
            }
        ]
    }
];

export const helpLeveling: HelpEmbeds = [
    {
        title: "Leveling Commands | Help",
        description: "Commands for managing your per-server levels and global level.",
        url: "/docs/commands/leveling/",
        fields: [
            {
                name: `@plevel (@plvl)`,
                value: "Check the server level of a user."
            },
            {
                name: `@psetlevel (@psetlvl)`,
                value: "Set the server level of a user."
            },
            {
                name: `@pgloballevel (@pgloballvl, @pglevel, @pglvl)`,
                value: `Check your global @n level.`
            }
        ]
    }
];

export const helpOther: HelpEmbeds = [
    {
        title: "Other Commands | Help",
        description: "Commands that only exist for one niche purpose",
        url: "/docs/commands/other/",
        fields: [
            {
                name: `@pabout`,
                value: `Displays information about @n`
            },
            {
                name: `@pfeedback (@pfb)`,
                value: `Provide feedback to the developers of @n`
            },
            {
                name: `@pbugreport (@preportbug, @pbug)`,
                value: `Report a bug to the developers of @n`
            },
            {
                name: `@pping`,
                value: `Ping @n`
            }
        ]
    }
];
//#endregion Help Embeds
