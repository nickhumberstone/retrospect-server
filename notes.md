Notes for Nick:

Changes to table. Added userdate, a unique col in responses to contain concat user_id + date. Updated created_datetime to be date_created and changed type to Date (00-00-0000), never needed timestamps anyway.

########################

Supporting push notifications
Need to store the expo notifi token with a users record, in an object so that I can account for multiple devices per user in future

Look into https://github.com/expo/expo-server-sdk-node for setup, and check about how it processes multiple notifications at once

Add a 9am (or convenient time) notification that includes the question of the day

Once number of community answers is 6 or more, send push notification to those first 6 users that there are now answers to view (before there are 6 responses (for 5 non-self responses) the page should say 'check back later' only)

How often should the check for 6 current answers run? Every 5 mins? And disabled for the next X hours once it is complete

When sending push notifications, consider fail responses and manage retiring the stored token to prevent pointless token sends

The rest of the notification stuff is server side, so I can go ahead with getting the app sorted and test the notifications on a preview release! `:)`
