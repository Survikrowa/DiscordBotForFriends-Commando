import type { GetCommandWithoutPrefix } from '../../../types/types';

export const boopCommand: GetCommandWithoutPrefix = (message) => ({
  title: 'boop',
  run: () => message.channel.send('poop.pl dojebane i legitne źródło, polecam'),
});
