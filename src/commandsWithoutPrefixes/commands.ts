import type { CommandsWithoutPrefixes } from '../../types/types';
import { boopCommand } from './commands/boop';
import { animeCommand } from './commands/anime';
import { gTwoCommand } from './commands/g2';
import { lolCommand } from './commands/lol';
import { pogCommand } from './commands/pog';

export const commandsWithoutPrefixes: CommandsWithoutPrefixes = (message) => [
  boopCommand(message),
  animeCommand(message),
  gTwoCommand(message),
  lolCommand(message),
  pogCommand(message),
];
