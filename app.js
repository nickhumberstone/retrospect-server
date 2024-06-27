import express from 'express';
import cors from 'cors';
import { addAnswer, getDailyAnswers, getMyAnswers, getDailyQuestion, createUserProfile, didTheyAnswerToday } from './databaselogic.js';

const app = express();
app.use(cors());
app.use(express.json());

//set favicon 
app.use('/favicon.ico', express.static('favicon.ico'));

//display daily responses
// queries are added by appending ?user_id=[id] to the endpoint
app.use("/dailyanswers", async (req, res) => {
    console.log("/dailyanswers triggered")
    const user = req.query.user_id
    const answers = await getDailyAnswers(user)
   res.send(answers);
})

//display 4 previous responses for the day's question
// queries are added by appending ?user_id=[id] to the endpoint
app.use("/myanswers", async (req, res) => {
    console.log("/myanswers triggered") 
    const user = req.query.user_id
    const answers = await getMyAnswers(user)
   res.send(answers);
})

// creates new response
app.post("/add", async (req, res) => {
    const {user_id, text_content} = req.body
    const output = await addAnswer(user_id, text_content)
    res.status(201).send(output)
})

// creates new profile (triggered by post-reg action in Auth0)
app.post("/newuser", async (req, res) => {
    console.log("/newuser triggered with values:", req.body)
    const {user_id, email, given_name, family_name, latitude, longitude} = req.body
    const output = await createUserProfile(user_id, email, given_name, family_name, latitude, longitude)
    res.status(201).send(output)
    
})

// fetches users most recent response, to see if they need to answer daily question
app.use("/didtheyanswertoday", async (req, res) => {
    console.log("/didtheyanswertoday triggered - attempting to fetch users most recent response")
    const user = req.query.user_id
    const answer = await didTheyAnswerToday(user)
    console.log(answer)
    res.send(answer)
})

//fetched today's question (7 day rotation currently)
app.use("/dailyquestion", async (req,res) => {
    console.log("/dailyquestion triggered")
    const output = await getDailyQuestion()
    res.send(output);
})

//send push notification to server
app.post("/registerpushnotifications", async (req, res) => {
    const {user_id, expo_push_token} = req.body
    const output = await addExpoPushToken(user_id, expo_push_token)
    res.status(201).send(output)
})

//error responses
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })


app.listen(process.env.PORT || 3030, ()=>{
    console.log("Node JS Server started on 3030.  ----  If running locally, make sure Docker is running on 3306, an localtunnel is exposing 3306.")
})