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

export async function addAnswer(user_id, text_content) {
    const dayOfWeek = new Date().getDay();
    const [output] = await pool.query(`
    INSERT into responses (user_id, text_content, dayOfWeek)
    VALUES (?, ?, ?)`, [user_id, text_content, dayOfWeek])
    return output[0]
}

export async function getDailyAnswers(user) {
    const d = new Date();
    let year = d.getFullYear()
    //month is zero index, so we must +1 the value
    let month = d.getMonth() + 1
    let day = d.getDate()
    let datetoday = year + "-" + month + "-" + day;
    const [output] = await pool.query(`
    SELECT response_id, given_name, text_content 
    FROM responses 
    INNER JOIN user_profile ON responses.user_id=user_profile.user_id
    WHERE DATE(created_datetime) = ?
    AND responses.user_id != ?
    ORDER BY RAND() LIMIT 5`
    , [datetoday, user])
        return output
}

export async function getMyAnswers(user) {
    const dayOfWeek = new Date().getDay();
    const [output] = await pool.query(`
    SELECT response_id, text_content, created_datetime, 
    DATE_FORMAT(created_datetime, '%a %D %M') as created_datetime
    FROM responses 
    WHERE user_id = ?
    AND dayOfWeek = ?`, [user, dayOfWeek])
        return output
}

export async function myLatestResponse(user){
    console.log("/myLatestResponse triggered")
    const [output] = await pool.query(`
    SELECT created_datetime, text_content
    FROM responses
    WHERE user_id = ?
    ORDER BY created_datetime DESC
    LIMIT 1`
    , [user])
    return output
}

export async function getDailyQuestion() {
    //getDay starts with Sunday (index 0)
    const dayOfWeek = new Date().getDay();
    const [output] = await pool.query(`
    SELECT dailyQuestion 
    FROM questions 
    WHERE dayOfWeek = ? 
    LIMIT 1`, [dayOfWeek])
        return output
}

export async function createUserProfile(user_id, email, given_name, family_name, latitude, longitude) {
    const [output] = await pool.query(`
    INSERT into user_profile (user_id, email, given_name, family_name, latitude, longitude)
    VALUES (?,?,?,?,?,?)`, [user_id, email, given_name, family_name, latitude, longitude])
    return output[0]
}