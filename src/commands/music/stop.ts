import { Command } from 'discord.js-commando';
import { distube } from '../../index';
import type { CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Message } from 'discord.js';

export default class StopMusic extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'stop',
      group: 'music',
      memberName: 'stopmusic',
      description: 'stop music',
    });
  }
  run(msg: CommandoMessage): Promise<Message | Message[] | null> | null {
    distube.stop(msg);
    return msg.channel.send(`Dobrze juz sie zamykam`);
  }
}
