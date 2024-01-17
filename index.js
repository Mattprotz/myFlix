const express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const Models = require('./models.js')

cors = require('cors');
app.use(cors());
let auth= require('./auth')(app);
let allowedOrigins = ['http://localhost:8080/']

const passport = require('passport');
require('./passport');

const { check, validationResult } = require('express-validator');

const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb+srv://L33thax420:L33thax420@clusterflix.xakkrlo.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('process.env.CONNECTION_URI', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

app.use(cors({
  origin: (origin, callback)=>{
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ //checking if specific origin is not found on allowed origins list
      let message = 'The CORS policy of this application does not allow access from origin' + origin;
      return callback(new Error (message), false);
    }
    return callback (null, true);
  }
}));

app.get('/', (request, response)=>{ //request route
    response.send('Hello!') //response
});  

//Read ALL movies
app.get('/movies', passport.authenticate('jwt', {session: false}), async (req, res) => {  
    Movies.find()  //read all movies
      .then((movies) => {res.status(201).json(movies)})
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

//Read data about movie by title 
app.get('/movies/:title', passport.authenticate('jwt', {session: false}), (req, res) => {
   Movies.findOne({ title: req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Read users
app.get('/users', passport.authenticate('jwt', {session: false}), async(req, res) => {  
  Users.find()  //read all users
    .then((users) => {res.status(201).json(users)})
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:username', passport.authenticate('jwt', {session: false}), async(req, res) => {
  await Users.findOne({ username: req.params.username })
    .then((user) => {
      res.json(user);
      console.log(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Create new user
app.post('/users',[ check('Username', 'Username is required').isLength({min: 5}),
check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
check('Password', 'Password is required').not().isEmpty(),
check('Email', 'Email does not appear to be valid').isEmail()], async (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ':' + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
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
