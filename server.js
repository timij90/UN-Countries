/*********************************************************************************
*  WEB322 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Jacobs Oluwatimilehin Uba Student ID: 148981228 Date: 02/04/2024
*
*  Online (Cyclic) Link: https://bewildered-leg-warmers-clam.cyclic.app
*
********************************************************************************/

const express = require('express');
//const path = require('path');
const app = express();
app.set('view engine', 'ejs');
const clientSessions = require('client-sessions');

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(
  clientSessions({
    cookieName: 'session',
    secret: 'o6LjQ5EVNC28ZgK64hDELM18ScpFQr',
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60,
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

const unCountryData = require("./modules/unCountries");
const authData = require("./modules/auth-service");

unCountryData.Initialize()
  .then(authData.initialize)
  .then(() => {
    app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
  })
  .catch(error => console.error('Error starting server:', error));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/un/countries', (req, res) => {
  const region = req.query.region;

  if (region) {
    unCountryData.getCountriesByRegion(region)
      .then(countries => res.render('countries', { countries }))
      .catch(message => res.status(404).render('404', { message }));
  }
  else {
    unCountryData.getAllCountries()
      .then(countries => res.render('countries', { countries }))
      .catch(message => res.status(404).render('404', { message }));
  }
});

app.get('/un/countries/:a2Code', (req, res) => {
  const countryCode = req.params.a2Code;

  if (!countryCode) {
    return res.status(404).render('404', { message: 'Invalid request. Missing a2Code parameter.' });
  }

  if (countryCode) {
    unCountryData.getCountryByCode(countryCode)
      .then(country => res.render('country', { country: country }))
      .catch(message => res.status(404).render('404', { message }));
  }
});

app.get('/un/addCountry', ensureLogin, (req, res) => {
  unCountryData.getAllRegions()
    .then(regions => res.render('addCountry', { regions: regions }))
    .catch(message => res.status(404).render('404', { message }));
});

app.post('/un/addCountry', ensureLogin, (req, res) => {

  unCountryData.addCountry(req.body)
    .then(() => res.redirect('/un/countries'))
    .catch(err => res.render('500', { message: `I'm sorry, but we have encountered the following error: ${err}` }));
});

app.get('/un/editCountry/:code', ensureLogin, (req, res) => {
  const countryCode = req.params.code;

  if (!countryCode) {
    return res.status(404).render('404', { message: 'Invalid request. Missing a2Code parameter.' });
  }

  Promise.all([
    unCountryData.getCountryByCode(countryCode),
    unCountryData.getAllRegions()
  ])
    .then(([countryData, regionsData]) => {
      res.render('editCountry', { regions: regionsData, country: countryData });
    })
    .catch(err => {
      res.status(404).render('404', { message: err });
    });
})

app.post('/un/editCountry', ensureLogin, (req, res) => {

  unCountryData.editCountry(req.body.a2code, req.body)
    .then(() => res.redirect('/un/countries'))
    .catch(err => res.render('500', { message: `I'm sorry, but we have encountered the following error: ${err}` }));
});

app.get('/un/deleteCountry/:code', ensureLogin, (req, res) => {
  const countryCode = req.params.code;

  if (!countryCode) {
    return res.status(404).render('404', { message: 'Invalid request. Missing a2Code parameter.' });
  }

  if (countryCode) {
    unCountryData.deleteCountry(countryCode)
      .then(() => res.redirect('/un/countries'))
      .catch(err => res.render('500', { message: `I'm sorry, but we have encountered the following error: ${err}` }));
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  authData.registerUser(req.body)
    .then(() => res.render('register', {successMessage: "User created"}))
    .catch(err => res.render('register', {errorMessage: err, userName: req.body.userName}))
});

app.post('/login', (req, res) => {
  req.body.userAgent = req.get('User-Agent');
  authData.checkUser(req.body).then((user) => {
    req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory,
    };

    res.redirect('/un/countries');
  })
  .catch(err => res.render('login', {errorMessage: err, userName: req.body.userName}));
});

app.get('/logout', (req, res) => {
  req.session.reset();
  res.redirect('/');
});

app.get('/userHistory', ensureLogin, (req, res) => {
  res.render('userHistory');
});

app.use((req, res, next) => {
  res.status(404).render('404', { message: "I'm sorry, we're unable to find what you're looking for" });
});

