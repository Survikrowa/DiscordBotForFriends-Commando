import { CommandoClient } from 'discord.js-commando';
import { config } from 'dotenv';

config();

const client = new CommandoClient({
  commandPrefix: process.env.COMMAND_PREFIX,
});

client.on('ready', () => console.log('hi'));

client.login('NzU1ODM3MjIzNDA3OTc2NTgx.X2JGRA.z1S3abpK0sxBTLy3fqUpDuOtQbk');
