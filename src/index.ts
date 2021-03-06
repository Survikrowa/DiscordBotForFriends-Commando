import { CommandoClient } from 'discord.js-commando';
import { config } from 'dotenv';
import Distube from 'distube';
import * as path from 'path';

//Firebase stuff
import admin from 'firebase-admin';
import firebase_token from '../firebase.json';

//Loading env values
config();

//Init Commodoro client
const client = new CommandoClient({
  commandPrefix: process.env.COMMAND_PREFIX,
});

//Registering commands
client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['utility', 'utility commands'],
    ['music', 'music commands'],
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
  credential: admin.credential.cert(firebase_token as admin.ServiceAccount),
  storageBucket: 'gs://discordbot-44c37.appspot.com',
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
