import { Collection, MessageEmbed } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

export default class DefaultHelp extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'help',
      group: 'utility',
      memberName: 'help',
      description: 'Help command',
    });
  }

  run(msg: CommandoMessage): Promise<CommandoMessage> {
    const groupList: Collection<string, Command> = this.client.registry.commands;

    const helpEmbed: MessageEmbed = new MessageEmbed().setColor('#ff2600').setTitle('Help');

    for (const [key, value] of groupList.entries()) {
      if (!value.hidden) {
        helpEmbed.addField(key, value.description, false);
      }
    }

    return msg.embed(helpEmbed);
  }
}
