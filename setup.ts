import Database from "better-sqlite3";

const db = new Database("./data.db", { verbose: console.log });

const applicants = [
  {
    name: "Ana",
    email: "ana@emai.com",
  },
  {
    name: "Mira",
    email: "mira@email.com",
  },
  {
    name: "Beni",
    email: "beni@email.com",
  },
  {
    name: "Teuta",
    email: "teuta@email.com",
  },
  {
    name: "Agim",
    email: "agim@email.com",
  },
  {
    name: "Lori",
    email: "lori@email.com",
  },
  {
    name: "Nora",
    email: "nora@email.com",
  },
];

const interviewers = [
  {
    name: "John",
    email: "john@email.com",
  },
  {
    name: "Leo",
    email: "leo@email.com",
  },
  {
    name: "Sam",
    email: "sam@email.com",
  },
  {
    name: "Ina",
    email: "ina@email.com",
  },
  {
    name: "Henry",
    email: "henry@email.com",
  },
  {
    name: "Emmy",
    email: "emmy@email.com",
  },
];

const interviews = [
  {
    date: "5/09/2022",
    score: 3,
    applicantId: 1,
    interviewerId: 1,
  },
  {
    date: "6/09/2022",
    score: 9,
    applicantId: 1,
    interviewerId: 3,
  },
  {
    date: "12/06/2022",
    score: 5,
    applicantId: 3,
    interviewerId: 6,
  },
  {
    date: "15/06/2022",
    score: 7,
    applicantId: 3,
    interviewerId: 5,
  },
  {
    date: "21/05/2022",
    score: 10,
    applicantId: 7,
    interviewerId: 2,
  },
  {
    date: "17/01/2022",
    score: 8,
    applicantId: 2,
    interviewerId: 4,
  },
  {
    date: "24/05/2022",
    score: 4,
    applicantId: 4,
    interviewerId: 1,
  },
  {
    date: "6/10/2021",
    score: 10,
    applicantId: 6,
    interviewerId: 3,
  },
  {
    date: "12/08/2022",
    score: 6,
    applicantId: 3,
    interviewerId: 4,
  },
  {
    date: "15/07/2022",
    score: 4,
    applicantId: 4,
    interviewerId: 6,
  },
];


// Applicants 

const dropApplicantsTable = db.prepare(`
DROP TABLE IF EXISTS applicants;
`)
dropApplicantsTable.run()

const createApplicantsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS applicants (
    id INTEGER,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    PRIMARY KEY(id)
);`)
createApplicantsTable.run()

const createApplicant = db.prepare(`
INSERT INTO applicants (name, email) VALUES (@name, @email);
`)

for (let applicant of applicants) createApplicant.run(applicant)


// interviewers

const dropInterviewersTable = db.prepare(`
DROP TABLE IF EXISTS interviewers;
`)
dropInterviewersTable.run()

const createInterviewersTable = db.prepare(`
CREATE TABLE IF NOT EXISTS interviewers (
    id INTEGER,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    PRIMARY KEY(id)
);`)
createInterviewersTable.run()


const createInterviewer = db.prepare(`
INSERT INTO interviewers (name, email) VALUES (@name, @email)
`)

for (let interviewer of interviewers) createInterviewer.run(interviewer)


// interviews that will link these two together

const dropInterviewsTable = db.prepare(`
DROP TABLE IF EXISTS interviews;
`)
dropInterviewsTable.run()


const createInterviewsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS interviews (
    id INTEGER,
    date TEXT NOT NULL,
    score INTEGER NOT NULL,
    applicantId INTEGER NOT NULL,
    interviewerId INTEGER NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (applicantId) REFERENCES applicants(id),
    FOREIGN KEY (interviewerId) REFERENCES interviewers(id)
);`)
createInterviewsTable.run()

const createInterview = db.prepare(`
INSERT INTO interviews (date, score, applicantId, interviewerId) 
VALUES (@date, @score, @applicantId, @interviewerId)
`)

for (let interview of interviews) createInterview.run(interview)




















