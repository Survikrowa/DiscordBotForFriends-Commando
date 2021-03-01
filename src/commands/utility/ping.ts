import { Collection } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

export default class Ping extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'ping',
      group: 'utility',
      memberName: 'ping',
      description: 'Bot response latency',
      hidden: false,
    });
  }

  async run(msg: CommandoMessage, args: string) {
    console.log(Date.now());
    console.log(new Date(msg.createdTimestamp));
    let delta: number = Math.abs(new Date().getTime() - new Date(msg.createdTimestamp).getTime());
    return await msg.say(`Latency is: ${delta}ms, API ping is: ${Math.round(this.client.ws.ping)}ms`);
  }
}
