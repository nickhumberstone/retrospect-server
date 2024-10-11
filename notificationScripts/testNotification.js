// Nick H expo push token is:
// ExponentPushToken[ZEJLSAG4QZdJi1w2_0Y1vG]

import { Expo } from "expo-server-sdk";

// Create a new Expo SDK client
let expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
  useFcmV1: true,
});

// Create the messages that you want to send to clients
const somePushTokens = [
  "ExponentPushToken[tbdP9JHDoHYZPEScz3L-Uh]",
  "ExponentPushToken[tbdP9JHDoHYZPEScz3L-Uh]",
];
let messages = [];
for (let pushToken of somePushTokens) {
  console.log("1 - pushToken:", pushToken);
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    continue;
  }

  messages.push({
    to: pushToken,
    sound: "default",
    body: "Today's question is waiting for you!",
    //data: {},
  });
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
    console.log("2 - chunk:", chunk);
    try {
      console.log("x:", chunk);
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
    //   console.log("TICKET CHUNK:", ticketChunk);
      tickets.push(...ticketChunk);
    //   console.log("TICKETSSSSS", tickets);

      for (let ticket of ticketChunk) {
        console.log("let ticket of ticketChunk");
        if (
          ticket.status === "error" &&
          ticket.details &&
          ticket.details.error
        ) {
          console.error(`Push notification error: ${ticket.details.error}`);
        }
        console.log("Ticket of ticketchunk is good:", ticket);
      }
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error) {
      console.error(error);
    }
  }
})();
console.log("TICKETS:", tickets);

// Later, after the Expo push notification service has delivered the
// notifications to Apple or Google (usually quickly, but allow the service
// up to 30 minutes when under load), a "receipt" for each notification is
// created. The receipts will be available for at least a day; stale receipts
// are deleted.

// The ID of each receipt is sent back in the response "ticket" for each
// notification. In summary, sending a notification produces a ticket, which
// contains a receipt ID you later use to get the receipt.

// The receipts may contain error codes to which you must respond. In
// particular, Apple or Google may block apps that continue to send
// notifications to devices that have blocked notifications or have uninstalled
// your app. Expo does not control this policy and sends back the feedback from
// Apple and Google so you can handle it appropriately.

let receiptIds = [];
console.log("3 - tickets:", tickets);
for (let ticket of tickets) {
  // NOTE: Not all tickets have IDs; for example, tickets for notifications
  // that could not be enqueued will have error information and no receipt ID.
  console.log("3 - ticket:", ticket);
  if (ticket.status === "ok") {
    receiptIds.push(ticket.id);
  }
}
console.log("receiptIds = ", receiptIds);

let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
(async () => {
  // Like sending notifications, there are different strategies you could use
  // to retrieve batches of receipts from the Expo service.
  for (let chunk of receiptIdChunks) {
    try {
      let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
      console.log("Receipts:", receipts);

      // The receipts specify whether Apple or Google successfully received the
      // notification and information about an error, if one occurred.
      for (let receiptId in receipts) {
        let { status, message, details } = receipts[receiptId];
        if (status === "ok") {
          continue;
        } else if (status === "error") {
          console.error(
            `There was an error sending a notification: ${message}`
          );
          if (details && details.error) {
            // The error codes are listed in the Expo documentation:
            // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
            // You must handle the errors appropriately.
            console.error(`The error code is ${details.error}`);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  console.log("done");
})();

console.log("script reached end");
