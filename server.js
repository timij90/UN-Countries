/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Jacobs Oluwatimilehin Uba Student ID: 148981228 Date: 15/02/2024
*
*  Online (Cyclic) Link: https://real-rose-cougar-tie.cyclic.app
*
********************************************************************************/

const express = require('express'); // "require" the Express module
const path = require('path');
const app = express(); // obtain the "app" object

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
  res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get('/un/countries', (req, res) => {
  const region = req.query.region;

  if (region) {
    unCountryData.getCountriesByRegion(region)
      .then(countries => res.json(countries))
      .catch(error => res.status(404).send('Error: ' + error.message));
  } 
  else {
    unCountryData.getAllCountries()
      .then(countries => res.json(countries))
      .catch(error => res.status(404).send('Error: ' + error.message));
  }
});

app.get('/un/countries/:a2Code', (req, res) => {
  const countryCode = req.params.a2Code; 

  if (!countryCode) {
    return res.status(404).send('Invalid request. Missing a2Code parameter.');
  }

  if(countryCode){
    unCountryData.getCountryByCode(countryCode)
    .then(country => res.json(country))
    .catch(error => res.status(404).send('Error: ' + error.message));
  }
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "/views/404.html" ));
});
