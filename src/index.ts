import { CommandoClient } from 'discord.js-commando';
import { config } from 'dotenv';
import Distube from 'distube';
import * as path from 'path';
import { registerActivity, ActivityType } from './activity';

//Firebase stuff
import admin from 'firebase-admin';
import firebase_token from '../firebase.json';

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

client.login(process.env.CLIENT_TOKEN);

//testing
// const myId = '393123191159128085';
// const myGuildId = '792497879175397456';

// registerActivity(ActivityType.Message, '1234', '321');
// const activityEvent = new UpdateActivity(myId, myGuildId);
// activityEvent.incrementMessages();
// activityEvent.incrementMessages();

// firestoreUpdate(activityEvent);

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
