require('dotenv').config();
const Sequelize = require('sequelize');

// set up sequelize to point to our postgres database
let sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

const Region = sequelize.define(
  'Region',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    subs: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

const Country = sequelize.define(
  'Country',
  {
    a2code: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    official: Sequelize.STRING,
    nativeName: Sequelize.STRING,
    permanentUNSC: Sequelize.BOOLEAN,
    wikipediaURL: Sequelize.STRING,
    capital: Sequelize.STRING,
    regionId: Sequelize.INTEGER,
    languages: Sequelize.STRING,
    population: Sequelize.INTEGER,
    flag: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

Country.belongsTo(Region, { foreignKey: 'regionId' })

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });


function Initialize() {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(() => {
      resolve();
    })
      .catch(error => {
        reject(error);
      })
  });
}

function getAllCountries() {
  return new Promise((resolve, reject) => {
    Country.findAll({
      include: [Region]
    })
      .then(countries => {
        if (countries.length > 0) {
          const countriesWithoutMetadata = countries.map(country => {
            const { dataValues } = country;
            delete dataValues.metadata;
            return dataValues;
          });
          resolve(countriesWithoutMetadata);
        } else {
          reject(new Error("No countries available"));
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

function getCountryByCode(countryCode) {
  return new Promise((resolve, reject) => {
    Country.findAll({
      where: {
        a2code: countryCode
      },
      include: [Region]
    })
      .then(countries => {
        if (countries.length > 0) {
          const country = countries[0].dataValues;
          delete country.metadata;
          resolve(country);
        } else {
          reject(new Error("Unable to find requested country"));
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

function getCountriesByRegion(region) {
  return new Promise((resolve, reject) => {
    Country.findAll({
      include: [Region], where: {
        '$Region.name$': {
          [Sequelize.Op.iLike]: `%${region}%`
        }
      }
    })
      .then(filteredCountries => {
        if (filteredCountries.length > 0) {
          const countriesWithoutMetadata = filteredCountries.map(country => {
            const { dataValues } = country;
            delete dataValues.metadata;
            return dataValues;
          })
          resolve(countriesWithoutMetadata);
        } else {
          reject(new Error("Unable to find requested countries"));
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

function getAllRegions() {
  return new Promise((resolve, reject) => {
    Region.findAll().then((regions) => {
      if (regions.length > 0) {
        resolve(regions);
      } else {
        reject(new Error("Unable to find any regions"));
      }
    })
      .catch(error => {
        reject(error);
      });
  });
}

function addCountry(countryData) {
  return new Promise((resolve, reject) => {

    const permanentUNSC = countryData.permanentUNSC === 'on' ? true : false;

    Country.create(countryData).then(() => {
      resolve();
    })
      .catch((err) => {
        reject(err.errors[0].message);
      });
  });
}

function editCountry(countryCode, countryData) {
  return new Promise((resolve, reject) => {
    Country.update({
      countryData}, 
      { where: { 
          a2code: countryCode 
      } 
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err.errors[0].message);
      });
  });
}

function deleteCountry(countryCode) {
  return new Promise((resolve, reject) => {
    Country.delete({
      where: { 
        a2code: countryCode 
      }
     })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err.errors[0].message);
      });
  });
}

module.exports = {
  Initialize,
  getAllCountries,
  getCountryByCode,
  getCountriesByRegion,
  getAllRegions,
  addCountry,
  editCountry,
  deleteCountry
};
