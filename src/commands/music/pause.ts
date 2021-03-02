import { Command } from 'discord.js-commando';
import { distube } from '../../index';
import type { CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Message } from 'discord.js';

export default class PauseMusic extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'pause',
      group: 'music',
      memberName: 'pausemusic',
      description: 'pause music',
    });
  }
  run(msg: CommandoMessage): Promise<Message | Message[] | null> | null {
    distube.pause(msg);
    return msg.channel.send(`Wznow piosenke, uzywajac komendy resume`);
  }
}
