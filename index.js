const tmi = require('tmi.js');
require('dotenv').config({path: '../.env'});

const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

const commands = {
    website: {
        response: 'shellyshellplaysgames.nft'
    },
    upvote: {
        response: (argument) => `Successfully upvoted ${argument}`
    }
}

const client = new tmi.Client({
    identity: {username: process.env.TWITCH_BOT_USERNAME, password: process.env.TWITCH_OAUTH_TOKEN},
    connection: {reconnect: true},
    channels: ['shellyshellplaysgames']
});

client.connect().then(console.log);

client.on('message', async (channel, context, message) => {
    const isNotBot = context.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME.toLowerCase();

    if ( !isNotBot ) {
        return;
    }

    const [raw, command, argument] = message.match(regexpCommand);

    const { response } = commands[command] || {};

    if ( typeof response === 'function' ) {
        client.say(channel, response(argument));
    } else if ( typeof response === 'string' ) {
        client.say(channel, response);
    }
});