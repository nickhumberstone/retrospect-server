import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

// Adds response to database, or updates if that user has already answered that day.
export async function addAnswer(user_id, text_content) {
    const dayOfWeek = new Date().getDay();
    const d = new Date()
    const date = d.toISOString().slice(0,10)
    const userdate = date.concat(user_id)
    const [output] = await pool.query(
        // Attempt to insert, but if not then update instead
        `INSERT INTO responses (text_content, user_id, dayOfWeek, date_created, userdate)
        VALUES ( ? , ? , ? , ? , ?)
        ON DUPLICATE KEY UPDATE
        text_content = ?
        ;`
        , [text_content, user_id, dayOfWeek, date, userdate, text_content])
        console.log("New Response Submitted: ",text_content," - ",user_id)
    return output[0]
}

export async function getDailyAnswers(user) {
    const date = new Date().toISOString().slice(0,10)
    const [output] = await pool.query(`
    SELECT response_id, given_name, text_content 
    FROM responses 
    INNER JOIN user_profile ON responses.user_id=user_profile.user_id
    WHERE DATE(date_created) = ?
    AND responses.user_id != ?
    ORDER BY RAND() LIMIT 5`
    , [date, user])
        return output
}

export async function getMyAnswers(user) {
    const dayOfWeek = new Date().getDay();
    const [output] = await pool.query(`
    SELECT response_id, text_content, DATE_FORMAT(date_created, '%a %D %M') as date_created
    FROM responses 
    WHERE user_id = ?
    AND dayOfWeek = ?
    ORDER BY response_id DESC
    LIMIT 4`, [user, dayOfWeek])
        return output
}

export async function didTheyAnswerToday(user){
    console.log("/didTheyAnswerToday triggered")
    const date = new Date().toISOString().slice(0,10)
    const [output] = await pool.query(`
    SELECT date_created, text_content
    FROM responses
    WHERE user_id = ?
    AND date_created = ?`
    , [user, date])
    console.log("output: ",output)
    console.log("didtheyanswetoday !output: ",!output)
    if (output.length === 0) {
        return false
    } else {
        return true
    }
}

export async function getDailyQuestion() {
    //getDay starts with Sunday (index 0)
    const dayOfWeek = new Date().getDay();
    const [output] = await pool.query(`
    SELECT dailyQuestion 
    FROM questions 
    WHERE dayOfWeek = ? 
    LIMIT 1`, [dayOfWeek])
    console.log("Daily Question generated: ",output)
        return output
}

export async function createUserProfile(user_id, email, given_name, family_name, latitude, longitude) {
    console.log("attempting to create user profile")
    const [output] = await pool.query(`
    INSERT into user_profile (user_id, email, given_name, family_name, latitude, longitude)
    VALUES (?,?,?,?,?,?)`, [user_id, email, given_name, family_name, latitude, longitude])
    console.log('New User created with info: ',given_name,' ',family_name,' - ',email,' - ',user_id)
    return output[0]
}