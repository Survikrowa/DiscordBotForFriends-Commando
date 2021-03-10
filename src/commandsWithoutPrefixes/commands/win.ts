import type { GetCommandWithoutPrefix } from '../../../types/types';
import { distube } from '../../index';

export const winCommand: GetCommandWithoutPrefix = (message) => ({
  title: 'win',
  run: () => distube.play(message, 'https://www.youtube.com/watch?v=a3npXG2hh_I'),
});
