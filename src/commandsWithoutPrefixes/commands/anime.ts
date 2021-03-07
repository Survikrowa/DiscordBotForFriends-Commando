import type { GetCommandWithoutPrefix } from '../../../types/types';

export const animeCommand: GetCommandWithoutPrefix = (message) => ({
  title: 'anime',
  run: () => message.channel.send('Morda weebie'),
});
