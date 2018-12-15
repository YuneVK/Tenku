import axios from 'axios';

const Constellation =  {
  paintConstellations: (name, state, config) => {
    return axios.get('http://127.0.0.1:5000/api/culture/' + name)
      .then(data => {
        const constellationsData = data.data.culture.constellations;

        let selectOptions = [];

        let constellations = constellationsData.map(constellation => {
          selectOptions.push({ name: constellation.name, id: constellation.id, center: constellation.points[0][0] })
          return {
            "type": "Feature",
            "id": constellation.name,
            "properties": {
              "n": constellation.name,
              "loc": constellation.points[0][0]
            }, "geometry": {
              "type": "MultiLineString",
              "coordinates": constellation.points
            }
          }
        })

        var jsonLine = {
          "type": "FeatureCollection",
          "features": constellations
        };

        window.Celestial.clear();

        if (window.Celestial.redraw) {
          window.Celestial.redraw();
        }

        window.Celestial.add({
          type: "line", name: name, callback: (error, json) => {
            if (error) return console.warn(error);
            Constellation.addConstellationsD3(jsonLine, state);
          }, redraw: function () {
            let pt;
            window.Celestial.container.selectAll(".ast").each(function (d) {
              window.Celestial.setStyle(config.lineStyle);
              window.Celestial.map(d);
              window.Celestial.context.stroke();

              if (window.Celestial.clip(d.properties.loc)) {
                pt = window.Celestial.mapProjection(d.properties.loc);
                window.Celestial.setTextStyle(config.textStyle);
                window.Celestial.context.fillText(d.properties.n, pt[0], pt[1]);
              }
            });
          }
        });
        if (window.Celestial.container)
          Constellation.addConstellationsD3(jsonLine, state);

        
        return selectOptions
      })
  }, 

  addConstellationsD3: (jsonLine, state) => {
    var asterism = window.Celestial.getData(jsonLine, state.config.transform);

    document.querySelectorAll("path.ast").forEach(e => e.parentNode.removeChild(e));

    window.Celestial.container.selectAll(".asterisms")
      .data(asterism.features)
      .enter().append("path")
      .attr("class", "ast");

    window.Celestial.redraw();
  }
}

export default Constellation;