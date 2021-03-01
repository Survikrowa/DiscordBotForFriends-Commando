import { CommandoClient, Command } from 'discord.js-commando';
import { config } from 'dotenv';
import * as path from 'path';

config();

const client = new CommandoClient({
  commandPrefix: process.env.COMMAND_PREFIX,
});

client.registry
  .registerDefaultTypes()
  .registerGroups([['first', 'testing group']])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn({ filter: /^.*\.(js|ts)$/, dirname: path.join(__dirname, 'commands') });

console.log(path.join(__dirname, 'commands'));
client.on('ready', () => console.log('ready'));

client.login(process.env.CLIENT_TOKEN);

client.on('message', (message) => {
  if (message.content === 'ping') {
    message.channel.send('pong');
  }
});
