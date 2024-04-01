Commands for setup

Run NPM RUN DEV from /server

Run YARN START from /client

Ensure Docker is running

Open up Pixel Device in Android Studio

Press 'a' in client terminal to open in Android Emulator

When running locally, you need to expose your server port with localtunnel:

lt --port 3030 --subdomain questionanswer


npm run dev --prefix server
yarn start --prefix client
lt --port 3030 --subdomain questionanswer (for testing using browser to access the server)

When using the Expo Dev app on device, you need to start the client with --tunnel flag to make it work
 npx expo start --dev-client --tunnel

 https://questionanswer.loca.lt/answers is how to access answers via the browser

 How the app and sign in is set up:
 We have our central app.js which is the app itself. Within it is a condition that checks if the user is logged in, and shows them either the app, or the login/register screens. This had the added benefit of continuing to show someone the logged in experience if the login token persists, saving them from having to log in or to view the log-in screen each time.