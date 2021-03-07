import type { GetCommandWithoutPrefix } from '../../../types/types';

export const gTwoCommand: GetCommandWithoutPrefix = (message) => ({
  title: 'g2',
  run: () => message.channel.send('https://www.youtube.com/watch?v=NwY_Ja585Ko'),
});
