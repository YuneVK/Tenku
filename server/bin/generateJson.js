const Star = require("../models/Star");
const Culture = require("../models/Culture");
const ConstellationsModel = require("../models/Constellation");

const mongoose = require("mongoose");

mongoose
  .connect('mongodb://localhost/server', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const GenerateJson = {
  data: {}, 
  stars: {}, 

  searchStars: () => {
    return Star.find()
  },

  searchData: () => {
    return ConstellationsModel.find()
  }, 

  init: () => {
    console.log('init');

    GenerateJson.searchStars()
      .then(stars => {
        stars.forEach(star => {
          GenerateJson.stars[star['hip']] = star;
        })
        console.log(GenerateJson.stars);

        return GenerateJson.searchData();
      })
      .then(constellations => {
        //console.log(constellations);
        constellations = constellations.map(constellation => {
          //console.log('--- constellation', constellation)
          console.log(constellation.points);
          
        })
      })
  }
}

GenerateJson.init();