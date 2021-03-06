import { client } from './index';
import { admin } from './firebase';
import logger from 'log4js';

const log = logger.getLogger('activity');
log.level = 'debug';

class UpdateActivity {
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
let activityBuffer: UpdateActivity[] = [];

//Debouncer
let timeout: NodeJS.Timeout | null = null;
const bouncingTimeInSeconds = 10;
const syncActivityFirestore = () => {
  //Clearing timeout
  if (timeout != null) {
    log.debug('Debouncing');
    clearTimeout(timeout);
  }

  //Setting the timeout function
  timeout = setTimeout(async () => {
    //Actual logic

    log.info('Activated firebase sync');
    for (const el of activityBuffer) {
      await firestoreUpdate(el);
    }

    activityBuffer = [];
  }, bouncingTimeInSeconds * 1000);
};

//Types of registered activity
export enum ActivityType {
  Message = 0,
  Voice = 1,
}

//Registering Activity
export const registerActivity = (type: ActivityType, userID: string, guildId: string): void => {
  //If the activity is voice based
  if (type === ActivityType.Voice) return;

  //If the activity is Message
  if (type === ActivityType.Message) {
    //Filter the array for given user
    log.debug('Registering message activity');
    const filtered = activityBuffer.filter((element: UpdateActivity) => {
      return element.userId === userID;
    });

    //User reference
    let userRef: UpdateActivity;

    //If not found
    if (filtered.length === 0) {
      userRef = new UpdateActivity(userID, guildId);
      userRef.incrementMessages();
      activityBuffer.push(userRef);
    } else {
      userRef = filtered[0];
      userRef.incrementMessages();
    }

    syncActivityFirestore();
  }
};

interface FirestoreActivity {
  userName: string;
  userId: string;
  sendMessages: number;
  xp: number;
}

const eventsToXP = { message: 10 };

const firestoreUpdate = async (data: UpdateActivity): Promise<void> => {
  const { guildId, userId } = data;

  log.debug(`Syncing activity for userID(${userId}) in guildID(${guildId}) with firestore`);

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
    const userName = (await client.users.fetch(`${userId}`)).username;

    //Old data that will be added to current local activity
    oldRecord = {
      userName,
      userId,
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

interface ActivityOverview extends FirestoreActivity {
  currLevel: number;
  levelFill: number;
  nextLevelXp: number;
}

export const activityFlashcard = async (userId: string, guildId: string): Promise<ActivityOverview> => {
  //Firestore client
  const db = admin.firestore();

  //Path in firestore to activity collecion
  const acitvityCollectionPath = `bot-root/${guildId}/activity`;

  //Activity collection reference (pointer)
  const activityCollectionReference = db.collection(acitvityCollectionPath);

  //Query for desired user
  const userQuery = await activityCollectionReference.where('userId', '==', userId).get();

  if (userQuery.empty) {
    const userName = (await client.users.fetch(`${userId}`)).username;
    const returnVal: ActivityOverview = {
      userName,
      userId,
      sendMessages: 0,
      xp: 0,
      currLevel: 0,
      levelFill: 0.0,
      nextLevelXp: 100,
    };

    return returnVal;
  }

  const record = userQuery.docs[0].data() as FirestoreActivity;
  const { userName, xp, sendMessages } = record;
  const multiplier = 2.2;
  /*
  Math stuff
  
  our series: {100, 220, 484}
  q = 2,2 - multiplayer
  n - the level
  
  a1 = 100
  A(N) - user xp: exp

  exp = a1*q^(n-1)

  n = logq(exp/a1)+1

  */

  let levelRaw = Math.log(xp / 100) / Math.log(multiplier) + 1;
  if (levelRaw < 0) levelRaw = 0;
  const currLevel = Math.floor(levelRaw);

  let currLevelXp: number;
  if (currLevel === 0) {
    currLevelXp = 0;
  } else {
    currLevelXp = 100 * Math.pow(multiplier, currLevel - 1);
  }
  const nextLevelXp = 100 * Math.pow(multiplier, currLevel);

  const levelFill = Math.round(((xp - currLevelXp) / (nextLevelXp - currLevelXp)) * 100) / 100;

  const userProfileInfo: ActivityOverview = {
    userName,
    userId,
    sendMessages,
    xp,
    currLevel,
    levelFill,
    nextLevelXp: Math.round(nextLevelXp),
  };

  return userProfileInfo;
};
