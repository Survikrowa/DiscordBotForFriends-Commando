import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

export default class MeowCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'meow',
      aliases: ['kitty-cat'],
      group: 'first',
      memberName: 'meow',
      description: 'Replies with a meow, kitty cat.',
    });
  }

  async run(message: CommandoMessage) {
    return message.say('Meow!');
  }
}
