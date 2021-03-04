import { Command } from 'discord.js-commando';
import { distube } from '../../index';
import type { CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Message } from 'discord.js';

type YoutubeArguments = {
  musicTitle: string;
};

export default class PlayMusic extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'play',
      group: 'music',
      memberName: 'playmusic',
      description: 'join channel and play music',
      args: [
        {
          key: 'musicTitle',
          prompt: 'What music would you like play?',
          type: 'string',
        },
      ],
    });
  }
  run(msg: CommandoMessage, { musicTitle }: YoutubeArguments): Promise<Message | Message[] | null> | null {
    console.log(musicTitle);
    try {
      distube.skip(msg);
    } catch (e) {}
    distube.play(msg, musicTitle);
    return msg.channel.send(`Playing ${musicTitle}`);
  }
}
