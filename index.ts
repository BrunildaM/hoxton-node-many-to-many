import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'


const app = express()
app.use(cors())
app.use(express.json())

const port = 4000

const db = new Database('./data.db', {verbose: console.log})

const getAllApplicants = db.prepare(`
SELECT * FROM applicants;
`)

const getAllInterviewers = db.prepare(`
SELECT * FROM interviewers;
`)

app.get('/applicants', (req, res) => {
    const applicants = getAllApplicants.all()
    res.send(applicants)
})

app.get('/interviewers', (req, res) => {
    const interviewers = getAllInterviewers.all()
    res.send(interviewers)
})

app.listen(port, () => {
   console.log(`Server running at: http://localhost:${port}`)
})