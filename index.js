const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const Models = require("./models.js");
const PORT = process.env.PORT || 8080;

require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let auth = require("./auth")(app);
let allowedOrigins = ["http://localhost:8080", "http://localhost:1234", "https://netfixmovies.netlify.app'" ];

const passport = require("passport");
require("./passport");

const Movies = Models.Movie;
const Users = Models.User;

const CONNECTION_URI =
  "mongodb+srv://L33thax420:L33thax420@clusterflix.xakkrlo.mongodb.net/myFlix?retryWrites=true&w=majority";

mongoose
  .connect(process.env.CONNECTION_URI)
  .then(() => console.log("connected to MongoDB"))
  .catch((err) =>
    console.error("Error connecting to MongoDB" + err + CONNECTION_URI)
  );
//git add . && git commit -m "update" && git push heroku master
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("origin first:", origin);
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        console.log(`Didnt find ${origin}`);
        //checking if specific origin is not found on allowed origins list
        let message =
          "The CORS policy of this application does not allow access from origin" +
          origin;
        return callback(new Error(message), false);
      }
      console.log(`found ${origin}`);
      return callback(null, true);
    },
  })
);

app.get("/", (request, response) => {
  //request route
  response.send("Hello!"); //response
});

//Read ALL movies
app.get("/movies", async (req, res) => {
  Movies.find() //read all movies
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Read data about movie by title
app.get("/movies/:title", (req, res) => {
  Movies.findOne({ title: req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Read users
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    Users.find() //read all users
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get a user by username
app.get(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOne({ username: req.params.username })
      .then((user) => {
        res.json(user);
        console.log(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Create new user
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  async (req, res) => {
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res
            .status(400)
            .send(req.body.Username + ":" + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            // Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

app.listen(PORT, () => {
  console.log("Listening on Port" + PORT);
});
