const express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');
const mongoose = require('mongoose');
const app = express();

const Models = require('./models.js')

const Movies = Models.Movie;
const Users = Models.Users;

mongoose.connect('mongodb://localhost:27017/myFlix', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.json());

app.get('/', (request, response)=>{ //request route
    response.send('Hello!') //response
});  

//Read movies
app.get('/movies', async (req, res) => {  
    Movies.find()  //read all movies
      .then((movies) => {res.status(201).json(movies)})
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

// Update user information
app.put('/movies/:director', (req, res) => {

  });

app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});

// app.get('/students/:name', (req, res) => { //request parameter (:name) will store inside of req.params
//     res.json(students.find((student) => //callback res.json then search thru students array
//       { return student.name === req.params.name })); //object sent back as response
//   });

// app.post('/students', (req, res) => { //add new student
//     let newStudent = req.body;
  
//     if (!newStudent.name) { //requires student name
//       const message = 'Missing name in request body';
//       res.status(400).send(message);
//     } else {
//       newStudent.id = uuid.v4();
//       students.push(newStudent); //adds new student to array
//       res.status(201).send(newStudent);
//     }
//   });

//   app.delete('/students/:id', (req, res) => {
//     let student = students.find((student) => { return student.id === req.params.id });
  
//     if (student) {
//       students = students.filter((obj) => { return obj.id !== req.params.id });
//       res.status(201).send('Student ' + req.params.id + ' was deleted.');
//     }
//   });
  
//   // Update the "grade" of a student by student name/class name
//   app.put('/students/:name/:class/:grade', (req, res) => {
//     let student = students.find((student) => { return student.name === req.params.name });
  
//     if (student) {
//       student.classes[req.params.class] = parseInt(req.params.grade);
//       res.status(201).send('Student ' + req.params.name + ' was assigned a grade of ' + req.params.grade + ' in ' + req.params.class);
//     } else {
//       res.status(404).send('Student with the name ' + req.params.name + ' was not found.');
//     }
//   });
  
//   // Gets the GPA of a student
//   app.get('/students/:name/gpa', (req, res) => {
//     let student = students.find((student) => { return student.name === req.params.name });
  
//     if (student) {
//       let classesGrades = Object.values(student.classes); // Object.values() filters out object's keys and keeps the values that are returned as a new array
//       let sumOfGrades = 0;
//       classesGrades.forEach(grade => {
//         sumOfGrades = sumOfGrades + grade;
//       });
  
//       let gpa = sumOfGrades / classesGrades.length;
//       console.log(sumOfGrades);
//       console.log(classesGrades.length);
//       console.log(gpa);
//       res.status(201).send('' + gpa);
//       //res.status(201).send(gpa);
//     } else {
//       res.status(404).send('Student with the name ' + req.params.name + ' was not found.');
//     }
//   });
