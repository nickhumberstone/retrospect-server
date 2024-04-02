Commands for setup

[npm run dev]
This will get the app running on port 3030

Run your docker instance on port 3306

lt --port 3030 --subdomain retrospect
This will expose port 3030 so that you can test with Android devices. Without it you can only test in the browser at localhost:3030

You will need to use the schema.sql file to get your MySQL instance set up. This is currently not included for security.

Visit [https://retrospect.loca.lt/dailyquestion](https://retrospect.loca.lt/dailyquestion) to check if it's all working. You should see a single line json file