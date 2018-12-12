const express = require('express');
const router  = express.Router();

const Star = require("../models/Star");
const Culture = require("../models/Culture");
const ConstellationsModel = require("../models/Constellation");

/* GET home page */
router.get('/', (req, res, next) => {
  res.json({test: 'test2'});
});

router.get('/culture/:name', (req, res, next) => {
  let culture;

  Culture.find({name: req.params.name}, {_id: 0, created_at: 0, updated_at: 0, __v: 0})
    .populate('constellations')
    .then(cultureData => {
      if (cultureData) {
        culture = cultureData[0];
        
        return Star.find();
      } else {
        res.json({error: 'Culture not found'});
      }
    })
    .then(starsObject => {
      let stars = {};

      for (let key in starsObject) {
        let star = starsObject[key];
        
        stars[star.hip] = {hip: star.hip, coordinates: star.location.coordinates}
      }

      culture.constellations.forEach((constellation, i) => {
        constellation.points = constellation.points.map(pair => {
          return [stars[pair[0]],stars[pair[1]]]
        })
        
        const {id, name, cultureName, points} = constellation;

        culture.constellations[i] = {
          id,
          name,
          culture: cultureName,
          points
        }
      })

      res.json({culture});
    })

  
})

module.exports = router;
