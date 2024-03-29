//Endpoint for registered users to log in
// -authenticates login request using HTTP authentication
// -generates JWT for the user

const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport');

let generateJWTToken = (user) =>{
    return jwt.sign(user, jwtSecret, {
        subject : user.Username,
        expiresIn : '7d',
        algorithm : 'HS256'
    });
}

module.exports = (router) => {
    router.post('/login', (req, res) => {
      passport.authenticate('local', { session: false }, (error, user, info) => {
        if (error || !user) {
          return res.status(400).json({
            message: 'Failed to log in- Something is not right',
            user: user,
            error: error,
          });
        }
        req.login(user, { session: false }, (error) => {
          if (error) {
            res.send(error);
          }
          let token = generateJWTToken(user.toJSON());
          return res.json({user, token });
        });
      })(req, res);
    });
  }