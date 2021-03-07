import type { GetCommandWithoutPrefix } from '../../../types/types';
import { admin } from '../../firebase';

const getPogImages = async () => {
  const bucket = admin.storage().bucket();
  const files = await bucket.getFiles();
  return Promise.all(
    files[0].map(async (file, i) => {
      if (i !== 0) {
        return await file.download();
      }
    }),
  );
};

export const pogCommand: GetCommandWithoutPrefix = (message) => ({
  title: 'pog',
  run: async () => {
    const pogs = await getPogImages();
    const images = pogs.filter((item) => item !== undefined).flat();
    const randomImage = images[Math.floor(Math.random() * images.length)] as Buffer;
    message.channel.send('POGGERS', { files: [randomImage] });
  },
});
