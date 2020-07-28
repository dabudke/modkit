# Ally - The Friendly Discord Bot

Ally is an open-source, totally free, Discord bot.  She is currently under
active development, and updates will come every so often (check the projects
page [here](https://github.com/orgs/allydiscord/projects/)).

![Website](https://img.shields.io/badge/website-allydiscord.github.io-informational?link=https://github.com/allydiscord/ally)
![Discord](https://img.shields.io/discord/457326122066116609?color=7289da&label=discord%20server&logo=discord)
![GitHub](https://img.shields.io/badge/source-github.com%2Fallydiscord%2Fally-lightgrey?logo=github)
![GitHub contributors](https://img.shields.io/github/contributors/allydiscord/ally?color=informational&logo=github)
![Latest release](https://img.shields.io/github/v/release/allydiscord/ally?label=latest%20release&logo=github)

- [About Ally](#about-ally)
- [Information about Self-Hosting](#information-about-self-hosting)

## About Ally

Ally is a Discord bot that is programed in JavaScript.  She uses the library
Discord.js to communicate with the Discord API, and has lots of fun and
useful functions and commands.  She is fully customizable, and can even set
settings for a single user!  Her uses are flexible, and more useful commands
are being added all the time!

Invite Ally to your server by clicking [this link](todo) or running the
command `^invite`.

Ally is licenced under the [`AGPL-3.0-only`](./LICENSE.txt) license.  
Check the [changelog](./CHANGELOG.md) for changes to Ally, the license
and the [security policy](./SECURITY.md).

## Information about Self-Hosting

To self-host Ally, you don't need a very good computer.  Any Raspberry Pi
will do.

To begin self-hosting, follow these steps:

1. Go to the [Discord Developer Portal](https://discordapp.com/developers)
 and log in with your account.
2. Create a new application, such as `My Awesome Bot`.
3. Go to the bot tab, and create a bot user.'
4. Go to the releases tab of the Ally GitHub repository (found [here](https://github.com/allydiscord/ally/releases)).
5. Download the latest release archive and extract the `.zip` file.
6. Navigate to the `Ally-vX.X.X` (with the `X`es signifying a number) and edit
 these files:
   - `meta/about.json`
      - `name`
      - `author`
      - `team`
         - `projectLeads`
         - `developers`
         - `supportTeam`
         - `bugTrackers`
      - `prefix` (optional)
   - `meta/token.json`
      - `token`
      - `testToken` (optional)
7. Run the command `npm install` from the `Ally_vX.X.X` folder to install all
 dependencies.
8. Run `npm test` to test the bot and make sure it works.
9. Run `npm start` to start the bot.

*Non-release Codebase.*
