// Script to be run by Heroku Scheduler 3 times per day - 9am, 1pm, 5pm
// Process:
// - MySQL query to pull list of expo tokens for users that have not answered yet today - using date check, responses table, and joining with expopushtokens table
// - Push batches of notifications to expo server, one for each user that matches the above query
// - each time it runs, it rechecks all those variables to make sure a respondee for the day isn't renudged


import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

console.log("globalReminders.js has been run with node globalreminder.js")

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
    SELECT expo_push_token
    FROM expo_push_tokens
    LEFT JOIN responses
    ON responses.user_id = expo_push_tokens.user_id
    WHERE date_created = ?`,[date])
        console.log(output)
        return output
        
}

listNotResponded();
