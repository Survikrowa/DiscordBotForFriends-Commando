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

  async run(msg: CommandoMessage, args: string) {
    const groupList: Collection<string, Command> = this.client.registry.commands;

    const help_embed: MessageEmbed = new MessageEmbed().setColor('#ff2600').setTitle('Help');

    for (let [key, value] of groupList.entries()) {
      //console.log(`key: ${key}, value: ${value}`);

      if (!value.hidden) {
        help_embed.addField(key, value.description, false);
      }
    }

    return await msg.embed(help_embed);
  }
}
