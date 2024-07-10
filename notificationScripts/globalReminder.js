// Script to be run by Heroku Scheduler 3 times per day - 9am, 1pm, 5pm
// Process:
// - MySQL query to pull list of expo tokens for users that have not answered yet today - using date check, responses table, and joining with expopushtokens table
// - Push batches of notifications to expo server, one for each user that matches the above query
// - each time it runs, it rechecks all those variables to make sure a respondee for the day isn't renudged

import mysql from 'mysql2';
import dotenv from 'dotenv';
import { Expo } from 'expo-server-sdk';

dotenv.config();

console.log("globalReminders.js has been run with: node globalreminder.js")

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

async function listNotResponded() {
    const date = '2024-05-11'
    // const date = new Date().toISOString().slice(0,10)
    const [output] = await pool.query(`
    SELECT GROUP_CONCAT(expo_push_token) AS expo_push_tokens_list
    FROM expo_push_tokens
    LEFT JOIN responses 
    ON responses.user_id = expo_push_tokens.user_id
    AND DATE(responses.date_created) = curdate()
    WHERE responses.user_id IS NULL`,[date])
        // console.log(output[0].expo_push_tokens_list)
        return output[0].expo_push_tokens_list  
}

const list = listNotResponded()
.then(console.log)

//UNABLE TO RETRIEVE FCM SERVER KEY - MAKE SURE YOU HAVE PROVIDED A SERVER KEY!!!!!

// Create a new Expo SDK client
// optionally providing an access token if you have enabled push security
let expo = new Expo({
  // accessToken: process.env.EXPO_ACCESS_TOKEN,
  useFcmV1: true // this can be set to true in order to use the FCM v1 API
});

console.log("expo access token set")

const pushtokenlist = ['ExponentPushToken[w3ShgtB9AVx5KByVT4MwrC]']

// Create the messages that you want to send to clients
let messages = [];
for (let pushToken of pushtokenlist) {
  // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

  // Check that all your push tokens appear to be valid Expo push tokens
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    continue;
  }

  // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
  messages.push({
    to: pushToken,
    sound: 'default',
    body: 'Open the app to answer todays question',
    // data: { withSome: 'data' },
  })
}

// The Expo push notification service accepts batches of notifications so
// that you don't need to send 1000 requests to send 1000 notifications. We
// recommend you batch your notifications to reduce the number of requests
// and to compress them (notifications with similar content will get
// compressed).

let chunks = expo.chunkPushNotifications(messages);
let tickets = [];
(async () => {
  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error) {
      console.error(error);
    }
  }
})();
