# Information for releasing an Ally version:

To propose a canadite release, please do the following things:

* Add version number to config.json (use semantic versioning!)
* Read [CONTRIBUTING.md](./CONTRIBUTING.md).

After the release tagged commit, commit the following:

* Reset the bugTrackers array with "No-one" in people.json
* Change version in config.json to "non-production".
