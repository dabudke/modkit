# Contributing to Ally

- [Creating Issues](#creating-issues)
  - [Reporting a Bug](#reporting-a-bug)
  - [Requesting a Feature](#requesting-a-feature)
  - [Reporting a Security Vulnerability](#reporting-a-security-vulnerability)
- [Creating Pull Requests](#creating-pull-requests)
- [Stale Issues and Pull Requests](#stale-issues-and-pull-requests)
- [Maintaining an Unsupported Version](#maintaining-an-unsupported-version)

## Creating Issues

When creating issues, you should use the templates that are provided to you.
That narrows the contributions made by issues into three categories:

### Reporting a Bug

Reporting bugs is straightforward: just create a new issue, choose the bug
report template, fill out the correct information, and create the issue.

Bug reports will be reviewed by a developer, and consequently, fixed.
You will also see your name in the next release, as a 'bug reporter' in the
`^about people` embed.

IMPORTANT: If this bug could possibly pose a security risk for any Discord
Servers the bot is in, please see
[Reporting a Security Vulnerability](#reporting-a-security-vulnerability).

### Requesting a Feature

Requesting a feature is also straightforward, as you just need to create an
issue and select the feature request template.  Fill out the appropriate
details, and create the issue.  Your issue will be reviewed by a project
lead, and added to the 'in consideration' part of the next release board
if approved.  Then, if the feature is deemed part of the scope, it will be
added to the 'To Do' part of the board.

Feature requesters are also added to the `^about people` command, and
an in depth list is located under `^about people features`.

### Reporting a Security Vulnerability

If you would wish to report a security vulnerability, DO NOT CREATE AN ISSUE!
This applies to security of a Discord server, or the security of the server
that the bot runs on.  Instead, see [SECURITY.md](./security.md), check the
version that contains the vulnerability's maintainer, and emailing them
regarding the vulnerability.

Although you will not be detailed anywhere in the bot, the community will
thank you for the small service you have done for them.

## Creating Pull Requests

When making pull requests, please test your code with the `node test` command
(after running `npm i --dev` and filling out the `testToken` field in
`/meta/token.json`) and test out all commands/modules that you changed/modified
to ensure that the bot works.

IMPORTANT: Every time you commit, run `/meta/.scrub.(bat/sh)` using the correct
file your your OS (Windows uses `.bat`, Linux/MacOS uses `.sh`)

## Stale Issues and Pull Requests

Stale issues and pull requests will get an automated message, asking if they
are resolved, and if not, the message 'bumps' theconversation, so everyone
subscribed are notified of it again.  Please make sure to close any open pull
requests/issues that are resolved, to keep clutter down.

## Maintaining an Unsupported Version

Please see [SECURITY.md](./SECURITY.md) for information about maintaining a version
of Ally.
