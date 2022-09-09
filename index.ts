import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'


const app = express()
app.use(cors())
app.use(express.json())

const port = 4000

const db = new Database('./data.db', {verbose: console.log})

// applicants queries

const getAllApplicants = db.prepare(`
SELECT * FROM applicants;
`)

const getApplicantById = db.prepare(`
SELECT * FROM applicants WHERE id = ?;
`)

const getInterviewersForApplicant = db.prepare(`
 SELECT interviewers.* FROM interviewers
 JOIN interviews ON interviewers.id = interviews.interviewerId 
 WHERE interviews.applicantId = @applicantId;
`)

const getInterviewsForApplicant = db.prepare(`
SELECT * FROM interviews WHERE applicantId = @applicantId;
`)


const createNewApplicant = db.prepare(`
INSERT INTO applicants (name, email) VALUES (@name, @email);
`)


// interviewers queries
const getAllInterviewers = db.prepare(`
SELECT * FROM interviewers;
`)

const getInterviewerById = db.prepare(`
SELECT * FROM interviewers WHERE id = ?;
`)

const getApplicantsForInterviewer = db.prepare(`
SELECT applicants.* FROM applicants
JOIN interviews ON applicants.id = interviews.applicantId
WHERE interviews.interviewerId = @interviewerId;
`)

const getInterviewsForInterviewer = db.prepare(`
SELECT * FROM interviews WHERE interviewerId = @interviewerId
`)

const createNewInterviewer = db.prepare(`
INSERT INTO interviewers (name, email) VALUES (@name, @email);
`)


// interviews queries
const getAllInterviews = db.prepare(`
SELECT * FROM interviews;
`)

const createNewInterview = db.prepare(`
INSERT INTO interviews (date, score, applicantId, interviewerId)
VALUES (@date, @score, @applicantId, @interviewerId);
`)

const getInterviewById = db.prepare(`
    SELECT * FROM interviews WHERE id = @id;
`)



// applicants

app.get('/applicants', (req, res) => {
    const applicants = getAllApplicants.all()

    for (const applicant of applicants) {
        applicant.interviews = getInterviewsForApplicant.all({applicantId: applicant.id})
        applicant.interviewers = getInterviewersForApplicant.all({ applicantId: applicant.id})
    }   
    res.send(applicants)
})

app.get('/applicants/:id', (req, res) => {
    const id = req.params.id

    const applicant = getApplicantById.get(id)

    if (applicant) {
        applicant.interviewers = getInterviewersForApplicant.all({applicantId: applicant.id})
        applicant.interviews = getInterviewersForApplicant.all({applicantId: applicant.id})
        res.send(applicant)
    } else {
        res.status(404).send({error: 'Applicant not found.'})
    }
})

app.post('/applicants', (req, res) => {
    const name = req.body.name
    const email = req.body.email

    const errors: string[] = []

    if(typeof name !== 'string'){
        errors.push("Name not provided or is not a string");
    }
    if(typeof email !== 'string'){
        errors.push("Email not provided or is not a string");
    }

    if(errors.length === 0){
        const info = createNewApplicant.run(name, email);
        const applicant = getApplicantById.get(info.lastInsertRowid);
        applicant.interviews = getInterviewsForApplicant.all(applicant.id);
        applicant.interviewers = getInterviewersForApplicant.all(applicant.id);
        res.send(applicant);
    } else{
        res.status(400).send({  error: errors   });
    }
})

// interviewers

app.get('/interviewers', (req, res) => {
    const interviewers = getAllInterviewers.all()

    for (const interviewer of interviewers) {
         interviewer.interviews = getInterviewsForInterviewer.all({interviewerId: interviewer.id})
        interviewer.applicants = getApplicantsForInterviewer.all({interviewerId: interviewer.id})
    }
    res.send(interviewers)
})


app.get('/interviewers/:id', (req, res) => {
    const id = req.params.id

    const interviewer = getInterviewerById.get(id)

    if (interviewer) {
        interviewer.interviews = getInterviewsForInterviewer.all({interviewerId: interviewer.id})
        interviewer.applicants = getApplicantsForInterviewer.all({interviewerId: interviewer.id})
        res.send(interviewer)
    } else {
        res.status(404).send({error: 'Interviewer not found.'})
    }
})


app.post('/interviewers', (req, res) => {
    const name = req.body.name
    const email = req.body.email

    const errors: string[] = []

    if(typeof name !== 'string'){
        errors.push("Name not provided or not a string");
    }
    if(typeof email !== 'string'){
        errors.push("Email not provided or not a string");
    }

    if(errors.length === 0){
        const info = createNewInterviewer.run(name, email);
        const interviewer = getInterviewerById.get(info.lastInsertRowid);
        interviewer.interviews = getInterviewsForInterviewer.all(interviewer.id);
        interviewer.applicants = getApplicantsForInterviewer.all(interviewer.id);
        res.send(interviewer);
    } else{
        res.status(400).send({  error: errors   });
    }
})


// interviews 

app.get('/interviews/:id', (req, res) => {

    const interview = getInterviewById.get(req.params);

    if(interview){
        interview.applicant = getApplicantById.get({applicantId: interview.applicantId});
        interview.interviewer = getInterviewerById.get({interviewerId: interview.interviewerId});
        res.send(interview);
    } else{
        res.status(400).send("Interview not found");
    }
})


app.post('/interviews', (req, res) => {

    const date = req.body.date
    const score = req.body.score
    const applicantId = req.body.applicantId
    const interviewerId = req.body.interviewerId

    const errors: string[] = []

    
    if(typeof date !== 'string'){
        errors.push("The date is not provided or is not a string");
    }

    if(typeof score !== 'number'){
        errors.push("The score is not provided or is not a number");
    }

    if(typeof applicantId !== 'number'){
        errors.push("The applicantId is not provided or is not a number");
    }

    if(typeof interviewerId !== 'number'){
        errors.push("The interviewerId is not provided or is not a number");
    }

    if(errors.length === 0){
        const info = createNewInterview.run(applicantId, interviewerId, date, score);
        const interview = getInterviewById.get(info.lastInsertRowid);
        res.send(interview);
    } else{
        res.status(400).send({  error: errors   });
    }
})



app.listen(port, () => {
   console.log(`Server running at: http://localhost:${port}`)
})