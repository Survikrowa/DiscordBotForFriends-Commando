import admin from 'firebase-admin';
import { config } from 'dotenv';

config();

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE as string)),
  storageBucket: 'gs://discordbot-44c37.appspot.com',
});

export { admin };
