import type { GetCommandWithoutPrefix } from '../../../types/types';
import { distube } from '../../index';

export const winCommand: GetCommandWithoutPrefix = (message) => ({
  title: 'win',
  run: async () => {
    //Constant used to retrive user info
    const guildID = message.guild?.id;
    const userID = message.author.id;
    const client = message.author.client;

    const guild = client.guilds.cache.get(guildID as string);
    const user = guild?.members.cache.get(userID);

    if (user?.voice.channel) {
      distube.play(message, 'https://www.youtube.com/watch?v=a3npXG2hh_I');
    }
  },
});
