const fs = require('fs');
const util = require('util');

var axios = require("axios");
var _ = require("lodash");

const readdir = util.promisify(fs.readdir);

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

const Constellations = {
  data: {},
  stars: {},
  newStars: [],

  init: () => {
    Star.find()
      .then(stars => {
        if (stars) {
          stars.forEach(star => {
            Constellations.stars[star['hip']] = star;
          })
        }
        Constellations.readConstellationsFiles();

      })
      .catch(err => console.log(err))
  }, 

  addCultureToDB: cultureName => {
    Culture.findOne({name: cultureName})
      .then(culture => {
        if (!culture) Culture.create({name: cultureName});
      })
    
  },

  readConstellationsFiles: () => {
    fs.readdir(`${__dirname}/constellations`, (err, folders) => {

      folders.forEach((folder, index) => {
        Constellations.addCultureToDB(folder);

        fs.readdir(`${__dirname}/constellations/${folder}`, (err, files) => {
          let names, relationship;
  
          fs.readFile(`${__dirname}/constellations/${folder}/constellation_names.eng.fab`, 'utf8', (err, data) => {
            names = data;
  
            fs.readFile(`${__dirname}/constellations/${folder}/constellationship.fab`, 'utf8', (err, data) => {
              relationship = data;

              Constellations.processFilesData(names, relationship, folder);
            })
          })
        })
      })
    })
  },

  processFilesData: (names, relationship, folder) => {
    console.log('ProcessFilesData of culture ', folder)
    Constellations.setNames(names, folder);
    Constellations.setRelationships(relationship);

    Constellations.saveConstellations();

    const allStars = Constellations.findAllStars();

    console.log(allStars)

    Constellations.addStarsData(allStars);

    
  },

  saveConstellations: () => {
    console.log('-- Saving Constellations');
    
    let constellationsArray = [];

    for(let key in Constellations.data) {
      //console.log('FOR', Constellations.data[key]);
      constellationsArray.push(Constellations.data[key])
    }

    ConstellationsModel.insertMany(constellationsArray, (err, res) => {
      console.log('Inserted');
      console.log(res)

      if (res) {
        let ids = [];

        res.forEach(constellation => {
          ids.push(constellation._id)
          //console.log(constellation._id)
        })

        console.log('updating cultures');

        console.log(res[0].culture)

        Culture.findOne({name: res[0].culture}, (err, res) => {
          console.log('ENCONTRADO', res)
        })

        Culture.findOneAndUpdate({name: res[0].culture}, { $set: { constellations: ids }}, { upsert: true }, (err, res) => {
          console.log('UPDATED', res)
        })

      }


    })


  },

  setStarsData: () => {
    console.log('Stars to insert: ', Constellations.newStars.length)

    Star.insertMany(Constellations.newStars, (err, res) => {
      console.log('--- Stars inserted');
      //Constellations.associateConstellations();
    })

    return;
  },

  // associateConstellations: () => {
  //   console.log('Associate Constellations');


  //   //console.log(Constellations.data);

  //   for (let key in Constellations.data) {
  //     let constellation = Constellations.data[key];

  //     constellation.points = constellation.points.map(point => {
  //       console.log(Constellations.stars[point[0]]);
  //       return [2,2]
  //     })
  //     console.log(Constellations.data[key])
  //   }

  // },

  setNames: (constellations, culture) => {
    constellations = constellations.split('\n');
    
    
    constellations.forEach(constellation => {
      
      constellation = constellation.split('\t');
      constellation[1] = constellation[1].slice(1, constellation[1].length-1);

      const id = constellation[0];
      const name = constellation[1];

      Constellations.data[id] = {id, name, culture}
    })
  },

  setRelationships: (relationship) => {
    relationship = relationship.split('\n');

    relationship.forEach(constellation => {
      constellation = constellation.replace('  ', ' ').split(' ');

      const id = constellation[0];
      const lines = constellation[1];
      const points = constellation.slice(2);

      Constellations.data[id].lines = lines;

      let pointsPairs = [];

      for (let i = 0; i < points.length; i+=2) {
        pointsPairs.push([points[i], points[i+1]])
      }
      
      Constellations.data[id].points = pointsPairs;
      console.log('TEST', Constellations.data[id].points)
    })
  },

  findAllStars: () => {
    let allStars = [];
    for (let id in Constellations.data) {
      const points = Constellations.data[id].points;
      points.forEach(point => allStars.push(point[0], point[1]))
    }
    return _.uniq(allStars);
  },

  

  addStarsData: allStars => {
    console.log('AddStarsData')
    let counter = allStars.length;
    console.log(counter)
    

    allStars.forEach(star => {
      console.log(star);
      if (Constellations.stars[star]) {
        if (--counter === 0) {Constellations.setStarsData()}
      } else {
        Constellations.getStarCoordinates(star)
        .then(starInfo => {
          console.log('------------ STAR INFO ----------------\n', starInfo);
          
          starInfo = {
            hip: starInfo.hip, 
            location: {
              coordinates: [starInfo.coordinates.ra, starInfo.coordinates.dec]
            }
          };

          Constellations.stars[star] = starInfo;
          Constellations.newStars.push(starInfo);

          //console.log(Constellations.newStars)
          
          console.log(counter);

          if (--counter === 0) {Constellations.setStarsData()}
        })
        .catch(err => {
          console.log(err);
          
          console.log(counter);

          if (--counter === 0) Constellations.setStarsData()
        })
        
      }
    })
  },

  getStarCoordinates: (hip, resolve) => {
    return axios.get(`https://hipparcos-tools.cosmos.esa.int/cgi-bin/HIPcatalogueSearch.pl?hipId=${hip}`)
    
    .then(function (starData) {
        var sss = starData.data
        var x = +sss.substring(sss.indexOf("H8"), sss.indexOf("H10")).trim().split("\n")[0].replace(/H8/, "").replace(" :", "").replace(/\s/gi, "").replace("alpha,degrees(J1991.25)", "")
        var y = +sss.substring(sss.indexOf("H9"), sss.indexOf("H10")).trim().split("\n")[0].replace(/H9/, "").replace(" :", "").replace(/\s/gi, "").replace("delta,degrees(J1991.25)", "")

        if (x > 180) x -= 360;

        return {
          hip,
          coordinates: {
            ra: x, 
            dec: y
          }
        }
    })
    .catch(error => { console.error(error); return Promise.reject(error); });
  }
}


module.exports = Constellations;