import express from 'express';
import cors from 'cors';
import { addAnswer, getDailyAnswers, getMyAnswers, getDailyQuestion, createUserProfile, hasAnswered } from './databaselogic.js';

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

//display your previous responses
// queries are added by appending ?user_id=[id] to the endpoint
app.use("/myanswers", async (req, res) => {
    console.log("/myanswers triggered") 
    const user = req.query.user_id
    const answers = await getMyAnswers(user)
   res.send(answers);
})

// for creating new response
app.post("/add", async (req, res) => {
    const {user_id, text_content} = req.body
    const output = await addAnswer(user_id, text_content)
    res.status(201).send(output)
    
})

// for creating new profiles (automated when registered with Auth0)
app.post("/newuser", async (req, res) => {
    console.log("/new triggered with values:", req.body)
    const {user_id, email, given_name, family_name, latitude, longitude} = req.body
    const output = await createUserProfile(user_id, email, given_name, family_name, latitude, longitude)
    res.status(201).send(output)
    
})

//for checking if the user has a response for today on the server (so that it can be limited 1 response per day)
app.use("/hasanswered", async (req, res) => {
    console.log("/myanswertoday triggered")
    const user = req.query.user_id
    const answer = await hasAnswered(user)
    res.send(answer)
})

//for getting the question of the day (7 day rotation currently)
app.use("/dailyquestion", async (req,res) => {
    console.log("/dailyquestion triggered")
    const output = await getDailyQuestion()
    res.send(output);
})

//error responses
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })


app.listen(process.env.PORT || 3030, ()=>{
    console.log("Node JS Server started on 3030. Make sure Docker is running on 3306, and localtunnel is exposing port 3306 to retrospect subdomain")
})