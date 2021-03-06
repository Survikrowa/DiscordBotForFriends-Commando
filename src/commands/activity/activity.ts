import { MessageEmbed } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { activityFlashcard } from '../../activity';

export default class DefaultHelp extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'activity',
      group: 'activity',
      memberName: 'activity',
      description: 'Shows user activity',
      guildOnly: true,
    });
  }

  async run(msg: CommandoMessage): Promise<CommandoMessage> {
    const ActivityEmbed: MessageEmbed = new MessageEmbed()
      .setColor('#ff2600')
      .setTitle('Activity Overview')
      .setThumbnail(msg.author.avatarURL() || 'https://discord.com/assets/6debd47ed13483642cf09e832ed0bc1b.png');

    const activityOverview = await activityFlashcard(msg.author.id, msg.guild.id);

    ActivityEmbed.addField('User', activityOverview.userName, false);
    ActivityEmbed.addField('Messages send', activityOverview.sendMessages, true);
    ActivityEmbed.addField('Current level:', activityOverview.currLevel, true);

    return msg.embed(ActivityEmbed);
  }
}
