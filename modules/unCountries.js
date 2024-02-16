const countryData = require("../data/countryData.json");
const regionData = require("../data/regionData.json");

let countries = [];

function Initialize() {
    return new Promise((resolve, reject) => {
        // Iterate through each countryData object
        countryData.forEach(country => {
            // Find the corresponding region object
            const region = regionData.find(region => region.id === country.regionId);

            // Create a new country object with the additional "region" property
            const newCountry = {
                ...country,
                region
            };

            // Push the new country object into the countries array
            countries.push(newCountry);
        });
        resolve();
    });
}

function getAllCountries() {
    return new Promise((resolve, reject) => {
        if(countries.length > 0){
            resolve(countries);
        }
        else{
            reject(new Error("No countries available"));
        }
         
    });
}

function getCountryByCode(countryCode) {
    return new Promise((resolve, reject) => {
        const country = countries.find(country => country.a2code.toLowerCase() === countryCode.toLowerCase());

        if (country) {
            resolve(country);
        } else {
            reject(new Error("unable to find requested country"));
        }
    });
}

function getCountriesByRegion(region) {
    return new Promise((resolve, reject) => {
        const filteredCountries = countries.filter(country => country.region.name.toLowerCase().includes(region.toLowerCase()));

        if (filteredCountries.length > 0) {
            resolve(filteredCountries);
        } else {
            reject(new Error("unable to find requested countries"));
        }
    });
}

module.exports = {
    Initialize,
    getAllCountries,
    getCountryByCode,
    getCountriesByRegion
};
