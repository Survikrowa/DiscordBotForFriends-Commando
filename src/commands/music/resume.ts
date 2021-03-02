import { Command } from 'discord.js-commando';
import { distube } from '../../index';
import type { CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Message } from 'discord.js';

export default class ResumeMusic extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'resume',
      group: 'music',
      memberName: 'resumemusic',
      description: 'resume music',
    });
  }
  run(msg: CommandoMessage): Promise<Message | Message[] | null> | null {
    distube.resume(msg);
    return msg.channel.send(`Wznowiono piosenke`);
  }
}
