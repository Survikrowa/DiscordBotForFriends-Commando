import { CommandoClient } from 'discord.js-commando';
import { config } from 'dotenv';
import Distube from 'distube';
import * as path from 'path';

config();

const client = new CommandoClient({
  commandPrefix: process.env.COMMAND_PREFIX,
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['utility', 'utility commands'],
    ['music', 'music commands'],
  ])
  .registerCommandsIn({ filter: /^([^.].*)\.(js|ts)$/, dirname: path.join(__dirname, 'commands') });

export const distube = new Distube(client, {
  searchSongs: false,
  emitNewSongOnly: true,
  youtubeCookie: process.env.COOKIE,
});

distube.on('error', (message, error) => {
  message.channel.send(`Palo-bot napotkal blad: ${error}`);
  message.channel.send(`Stack trace:\n${error.stack}`);
});

client.on('ready', () => console.log('ready'));

client.login(process.env.CLIENT_TOKEN);

client.on('message', (message) => {
  if (message.content === 'ping') {
    message.channel.send('pong');
  }
});
