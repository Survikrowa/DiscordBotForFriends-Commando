import { client } from './index';
import admin from 'firebase-admin';

export class UpdateActivity {
  userId: string;
  sendMessages: number;
  guildId: string;

  constructor(userId: string, guildId: string) {
    this.userId = userId;
    this.sendMessages = 0;
    this.guildId = guildId;
  }

  incrementMessages(): void {
    this.sendMessages++;
  }
}

//Where current activity will be stored until it is synced with firestore
const activityBuffer: UpdateActivity[] = [];

//Types of registered activity
export enum ActivityType {
  Message = 0,
  Voice = 1,
}

export const registerActivity = (type: ActivityType, userID: string, guildId: string): void => {
  //If the activity is voice based
  if (type === ActivityType.Voice) return;

  //If the activity
  if (type === ActivityType.Message) {
    //Filter the array for given user
    const filtered = activityBuffer.filter((element: UpdateActivity) => {
      return element.userId === userID;
    });

    //If not found
    if (filtered.length === 0) {
      const userReference = new UpdateActivity(userID, guildId);
      userReference.incrementMessages();
      activityBuffer.push(userReference);
    } else {
      filtered[0].incrementMessages();
    }

    //Debbuging TODO
    console.table(activityBuffer);
  }
};

interface FirestoreActivity {
  userName: string;
  userId: string;
  sendMessages: number;
  xp: number;
}

const eventsToXP = { message: 10 };

export const firestoreUpdate = async (data: UpdateActivity): Promise<void> => {
  //GuildId and User id
  const guildId = data.guildId;
  const userId = data.userId;

  //Firestore client
  const db = admin.firestore();

  //Path in firestore to activity collecion
  const acitvityCollectionPath = `bot-root/${guildId}/activity`;

  //Activity collection reference (pointer)
  const activityCollectionReference = db.collection(acitvityCollectionPath);

  //Query for desired user
  const userQuery = await activityCollectionReference.where('userId', '==', userId).get();

  //Testing
  //const user = await client.users.fetch('393123191159128085');

  let oldRecord: FirestoreActivity;
  let docRef;

  //Retriving old data record
  if (userQuery.empty) {
    //If the record was not found
    //Getting discord user name
    const userName = await (await client.users.fetch(`${userId}`)).username;

    //Old data that will be added to current local activity
    oldRecord = {
      userName: userName,
      userId: userId,
      sendMessages: 0,
      xp: 0,
    };

    //Retriving document reference to later update
    docRef = await activityCollectionReference.add(oldRecord);
  } else {
    //TODO data validation

    //Document reference to use as a pointer to writing data
    docRef = userQuery.docs[0].ref;

    //Old data that will be added to current local activity
    oldRecord = userQuery.docs[0].data() as FirestoreActivity;
  }

  const newSendMessages = oldRecord.sendMessages + data.sendMessages;
  const newXp = oldRecord.xp + data.sendMessages * eventsToXP['message'];

  docRef.update({ sendMessages: newSendMessages, xp: newXp });
};
