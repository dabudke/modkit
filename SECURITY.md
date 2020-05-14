# Ally Security Policy

- [Supported Versions](#supported-versions)
- [Reporting a vulnerability](#reporting-a-vulnerability)
- [Vulnerable versions](#vulnerable-versions)
- [What are 'LTS' releases?](#what-are-'lts'-releases)
- [Maintaining a Version](#maintaining-a-version)

## Supported Versions

Version|Maintained?|Maintainer Contact
---|---|---
`master` branch|No|[little.kitacho@outlook.com](mailto:little.kitacho@outlook.com)

## Reporting a vulnerability

To report a vulnerability, click on the email address listed under 'Maintainer
Contact'.  Your default mail application/website should open up, with the
address already inputted.  Please mark on the subject line that you are
reporting a vulnerability in Ally's code, and attatch any resources to verify
the report.

If the version is not supported, a response is not guarenteed from the support
email.  Be warned when reporting an issue for an unsupported version.

## Vulnerable versions

If you or someone you know operates a bot running Ally's code, and they are using
an unsupported version, please contact them and tell them to update their code.
Running vulnerable code is dangerous, and can cause your server to be attacked
by malicious actors exploiting the bug/vulnerability.

## What are 'LTS' releases?

LTS stands for 'Long Term Service', and are supported for longer than a normal
release.  LTS versions are released when the Ally team feels that the code is
sturdy enough to be supported for longer.  LTS versions are supported until the
next LTS version is released, and then possibly longer, depending on how sturdy
and recent the code is.

Generally you can depend on downloading an LTS release and running the bot for a
while before having to update.

## Maintaining a Version

Maintaining a version of Ally that you or your community uses is not very hard,
just make sure you have a decent understanding of how Ally works, and create a
pull request adding the version/versions to a collumn, along with your email
address, using a format like this:

```none
newer versions
vX.X.X[ to vY.Y.Y]|Yes|[your-email@address.com](mailto:your-email@address.com)
older versions
```

Applications that do not adhere to this format or are applying for an already
supported version will be denied.
