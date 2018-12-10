const fs = require('fs');
const util = require('util');

var axios = require("axios");
var _ = require("lodash");

const readdir = util.promisify(fs.readdir);

const Constellations = {
  data: {},
  stars: {},

  init: () => {
    Constellations.readConstellationsFiles();
  }, 

  readConstellationsFiles: () => {
    fs.readdir(`${__dirname}/constellations`, (err, folders) => {
      folders.forEach((folder, index) => {
        fs.readdir(`${__dirname}/constellations/${folder}`, (err, files) => {
          files.forEach((file, index) => {
            let names, relationship;
    
            fs.readFile(`${__dirname}/constellations/${folder}/constellation_names.eng.fab`, 'utf8', (err, data) => {
              names = data;
    
              fs.readFile(`${__dirname}/constellations/${folder}/constellationship.fab`, 'utf8', (err, data) => {
                relationship = data;

                Constellations.processFilesData(names, relationship);
              })
            })
          })
        })
      })
    })
  },

  processFilesData: (names, relationship) => {
    Constellations.setNames(names);
    Constellations.setRelationships(relationship);

    const allStars = Constellations.findAllStars();

    Constellations.addStarsData(allStars);
  },

  setStarsData: () => {
    console.log('setting stars data')
    return;
  },

  setNames: constellations => {
    constellations = constellations.split('\n');
    
    
    constellations.forEach(constellation => {
      
      constellation = constellation.split('\t');
      constellation[1] = constellation[1].slice(1, constellation[1].length-1);

      const id = constellation[0];
      const name = constellation[1];

      Constellations.data[id] = {id, name}
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
    let counter = allStars.length;

    allStars.forEach(star => {
      if (Constellations.stars[star]) {
        counter--;
      } else {
        Constellations.getStarCoordinates(star)
        .then(starInfo => {
          console.log('RESULT', starInfo);
          Constellations.stars[star] = starInfo;
          counter--;
          console.log(counter);
          if (counter === 0) {
            console.log('FINISHED');
            Constellations.setStarsData();
          }
        })
        .catch(err => {
          console.log(err);
          counter--;
          console.log(counter);
          if (counter === 0) {
            console.log('FINISHED');
            Constellations.setStarsData();
          }
        })
        
      }
    })
    //console.log(Constellations.stars)
  },

  getStarCoordinates: (hip, resolve) => {
    return axios.get(`https://hipparcos-tools.cosmos.esa.int/cgi-bin/HIPcatalogueSearch.pl?hipId=${hip}`)
    
    .then(function (starData) {
        console.log("-".repeat(50))
        var sss = starData.data
        var x = +sss.substring(sss.indexOf("H8"), sss.indexOf("H10")).trim().split("\n")[0].replace(/H8/, "").replace(" :", "").replace(/\s/gi, "").replace("alpha,degrees(J1991.25)", "")
        var y = +sss.substring(sss.indexOf("H9"), sss.indexOf("H10")).trim().split("\n")[0].replace(/H9/, "").replace(" :", "").replace(/\s/gi, "").replace("delta,degrees(J1991.25)", "")

        if (x > 180)    x -= 360;

        //resolve({hip, coordinates: {ra: x, dec: y}});

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