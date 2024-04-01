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

export async function getAnswers() {
    const [output] = await pool.query("SELECT user_id, text_content FROM responses ORDER BY RAND() LIMIT 5")
        return output
    }

    export async function getAllAnswers() {
        const [output] = await pool.query("SELECT * FROM responses")
        return output
    }

export async function addAnswer(user_id, text_content) {
    const [output] = await pool.query(`
    INSERT into responses (user_id, text_content)
    VALUES (?, ?)`, [user_id, text_content])
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
    SELECT response_id, user_id, text_content 
    FROM responses 
    WHERE DATE(created_datetime) = ?
    AND user_id != ?
    ORDER BY RAND() LIMIT 5`, [datetoday, user])
        return output
}

export async function getMyAnswers(user) {
    const [output] = await pool.query(`
    SELECT response_id, user_id, text_content 
    FROM responses 
    WHERE user_id = ?`, [user])
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