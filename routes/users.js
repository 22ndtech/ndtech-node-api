const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const passport = require('passport')

router.post('/register', async (req, res, next) => {
  try {
    const user = await (new User({
      username: req.body.username,
      password: req.body.password
    }).save())
    res.json({
      _id: user._id,
      username: user.username,
      token: user.getToken()
    })
  } catch (err) {
    if (err.code === 11000) {
      next({
        status: 409,
        message: 'This username already exists!'
      })
    }
    next()
  }
})

router.get('/signin/callback', async (req, res) => {
  const { query } = req;
  const { code } = query;

  if (!code) {
    return res.send({
      success: false,
      message: 'Error: no code'
    })
  }

  const axios = require('axios').default;
  axios
    .post('https://github.com/login/oauth/access_token', {
      client_id: process.env.JAACKD_REALITY_GITHUB_OAUTH_CLIENT_ID,
      client_secret: process.env.JAACKD_REALITY_GITHUB_OAUTH_CLIENT_SECRET,
      code: code,
      redirect_uri: "http://localhost:3000/signin/callback/logged-in"
    })
    .then(async (response) => {
      const data = response.data;

      const querystring = require('querystring');
      const queryData = querystring.parse(data);

      const { Octokit } = require("@octokit/core");
      const { access_token } = queryData;
      const octokit = new Octokit({ auth: access_token });
      const getUserResponse = await octokit.request('GET /user');

      const { data: githubData } = getUserResponse;
      const { login: userName } = githubData;

      // check for an existing user
      const user = await User.findOne({ username: userName })

      if (!user) {
        // create a new user
        try {
          const user = await (new User({
            username: userName,
            access_token: access_token,
            githubData: githubData
          }).save())

        } catch (err) {
          if (err.code === 11000) {
            next({
              status: 409,
              message: 'This username already exists!'
            })
          }
          next()
        }
      }

      // s = body.exp.toUTCString();
      // res.cookie('id_token' ,user.getToken(), {expires: s});
      let expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1);
      res.cookie('id_token', user.getToken(), { expires: expirationDate });
      res.redirect("http://localhost:3000/logged-in?userName=" + userName + "&_id=" + user._id);
    })
    .catch((error) => {
      return res.send({
        success: false,
        message: error.message
      })
    })

})


router.get('/GetLoggedInUser',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log("req.user = " + req.user);
    res.json({
      user: req.user
    })
  })

module.exports = router
