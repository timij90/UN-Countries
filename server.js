/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Jacobs Oluwatimilehin Uba Student ID: 148981228 Date: 05/02/2024
*
*  Online (Cyclic) Link: https://real-rose-cougar-tie.cyclic.app
*
********************************************************************************/

const express = require('express'); // "require" the Express module
const path = require('path');
const app = express(); // obtain the "app" object
app.set('view engine', 'ejs');

const HTTP_PORT = process.env.PORT || 8080; // assign a port


app.use(express.static('public')); 
const unCountryData = require("./modules/unCountries");

unCountryData.Initialize()
  .then(() => {

// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
    
  })
  .catch(error => console.error('Error initializing data:', error));

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
      .then(countries => res.render('countries',{countries}))
      .catch(message => res.status(404).render('404',{message}));
  } 
  else {
    unCountryData.getAllCountries()
      .then(countries => res.render('countries',{countries}))
      .catch(message => res.status(404).render('404',{message}));
  }
});

app.get('/un/countries/:a2Code', (req, res) => {
  const countryCode = req.params.a2Code; 

  if (!countryCode) {
    return res.status(404).render('404',{message: 'Invalid request. Missing a2Code parameter.'});
  }

  if(countryCode){
    unCountryData.getCountryByCode(countryCode)
    .then(country => res.render('country',{country: country}))
    .catch(message => res.status(404).render('404',{message}));
  }
});

app.use((req, res, next) => {
  res.status(404).render('404', {message: "I'm sorry, we're unable to find what you're looking for"});
});
