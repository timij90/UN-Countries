/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Jacobs Oluwatimilehin Uba Student ID: 148981228 Date: 01/02/2024
*
*  Online (Cyclic) Link: https://odd-plum-blackbuck-wrap.cyclic.app
*
********************************************************************************/

const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port


const unCountryData = require("./modules/unCountries");

unCountryData.Initialize()
  .then(() => {

// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
    
  })
  .catch(error => console.error('Error initializing data:', error));

app.get('/', (req, res) => {
  res.send("Assignment 2:  Jacobs Oluwatimilehin Uba - 148981228");
});

app.get('/un/countries', (req, res) => {
  res.json(unCountryData.getAllCountries());
});

app.get('/un/countries/code-demo', (req, res) => {
  const countryCode = 'ca'; // Replace with the desired country code
  unCountryData.getCountryByCode(countryCode)
    .then(country => res.json(country))
    .catch(error => res.status(500).send('Error: ' + error.message));
});

app.get('/un/countries/region-demo', (req, res) => {
  const region = 'oceania'; // Replace with the desired region
  unCountryData.getCountriesByRegion(region)
    .then(countries => res.json(countries))
    .catch(error => res.status(500).send('Error: ' + error.message));
});
