import { CommandoClient } from 'discord.js-commando';
import { config } from 'dotenv';
import Distube from 'distube';
import * as path from 'path';
import { registerActivity, ActivityType } from './activity';

//Firebase stuff
import admin from 'firebase-admin';

//Loading env values
config();

//Init Commodoro client
export const client = new CommandoClient({
  commandPrefix: process.env.COMMAND_PREFIX,
});

//Registering commands
client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['utility', 'utility commands'],
    ['music', 'music commands'],
    ['activity', 'activity commands'],
  ])
  .registerCommandsIn({ filter: /^([^.].*)\.(js|ts)$/, dirname: path.join(__dirname, 'commands') });

//Distube client
export const distube = new Distube(client, {
  searchSongs: false,
  emitNewSongOnly: true,
  youtubeCookie: process.env.COOKIE,
});

//Firebase init
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE as string)),
  storageBucket: 'gs://discordbot-44c37.appspot.com',
});

const testing = async () => {
  const bucket = admin.storage().bucket();
  const filesArray = await bucket.getFiles();
  const image = (await filesArray[0][1].download())[0];

  client.on('message', (message) => {
    if (message.content === 'pog') {
      message.channel.send('Pog', { files: [image] });
    }
  });
};
testing();

distube.on('error', (message, error) => {
  message.channel.send(`Palo-bot napotkal blad: ${error}`);
  message.channel.send(`Stack trace:\n${error.stack}`);
});

client.login(process.env.CLIENT_TOKEN);

client.on('ready', () => console.log('ready'));

client.on('message', (message) => {
  if (message.author.id != client.user?.id) {
    const guildId = message.guild?.id;
    if (guildId) {
      registerActivity(ActivityType.Message, message.author.id, guildId);
    }
  }
});

//

client.on('message', (message) => {
  if (message.content === 'ping') {
    message.channel.send('pong');
  }
});
