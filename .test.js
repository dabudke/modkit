console.log('You are running the test command: this will connect to the Discord API with the\
\'testToken\' key in \'token.json\' file.')

require("./src/main");

exports.token = require("./meta/token.json").testToken;