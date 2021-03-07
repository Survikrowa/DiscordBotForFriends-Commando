import type { GetCommandWithoutPrefix } from '../../../types/types';

export const lolCommand: GetCommandWithoutPrefix = (message) => ({
  title: 'lol',
  run: () => message.react('637709913145212928').catch(() => message.channel.send('Nie mam tutaj takiej emotki palo')),
});
