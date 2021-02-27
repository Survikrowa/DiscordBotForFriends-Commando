import { CommandoClient } from 'discord.js-commando';
import { config } from 'dotenv';

config();

const client = new CommandoClient({
  commandPrefix: process.env.COMMAND_PREFIX,
});

client.on('ready', () => console.log('hi'));

client.login(process.env.CLIENT_TOKEN);
