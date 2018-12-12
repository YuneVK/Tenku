import React, { Component } from 'react';

// import './js/lib/d3.min.js';
// import './js/lib/d3.geo.projection.js';
//import './js/lib/celestial.min.js';
import axios from 'axios';

import './celestial.css'


console.log("test")

/*
<script type="text/javascript" src="./js/lib/d3.min.js"></script>
  <script type="text/javascript" src="./js/lib/d3.geo.projection.min.js"></script>
  <script type="text/javascript" src="./js/lib/celestial.min.js"></script>
  <script type="text/javascript" src="./node_modules/axios/dist/axios.js"></script>
  <link rel="stylesheet" href="./css/celestial.css">

*/

export default class Planetarium extends Component {
  constructor() {
    super();

    this.state = {
      loaded: false,
      showConstellations: true,
      actualConstellations: undefined,
      config: undefined
    }
  }

  componentDidMount() {
    axios.get('http://127.0.0.1:5000/api/culture/western')

      .then((data) => {
        this.setState({ ...this.state, loaded: true })

        this.state.config = {
          projection: "airy",
          //projection: "equirectangular",
          width: window.innerWidth,
          center: [-65, 0],
          background: { fill: "#fafafa", stroke: "#000", opacity: 1, width: 1 },
          datapath: "./data/",
          adaptable: true, 
          stars: {
            colors: false,
            names: false,
            style: { fill: "#000", opacity: 1 },
            limit: 6,
            size: 5
          },
          dsos: { show: false },
          mw: {
            style: { fill: "#996", opacity: 0.1 }
          },
          constellations: {
            show: false,
            linestyle: { stroke: "transparent", width: 0, opacity: 0 },
          }
        };
        // Asterisms canvas style properties for lines and text
        var lineStyle = {
          stroke: "#f00",
          fill: "transparent",
          width: 3
        },
          textStyle = {
            fill: "#f00",
            font: "bold 15px Helvetica, Arial, sans-serif",
            align: "center",
            baseline: "middle"
          };
        // JSON structure of the object to be displayed, in this case
        // the Summer Triangle between Vega, Deneb and Altair

        const constellationsData = data.data.culture.constellations;

        let constellations = constellationsData.map(constellation => {
          return {
            "type": "Feature",
            "id": constellation.name,
            "properties": {
              // Name
              "n": "",
              // Location of name text on the map
              "loc": [-67.5, 52]
            }, "geometry": {
              // the line object as an array of point coordinates
              "type": "MultiLineString",
              "coordinates": constellation.points
            }
          }
        })

        var jsonLine = {
          "type": "FeatureCollection",
          // this is an array, add as many objects as you want
          "features": constellations
        };

        window.Celestial.add({
          type: "line", callback:  (error, json) => {
            if (error) return console.warn(error);
            // Load the geoJSON file and transform to correct coordinate system, if necessary
            this.addConstellations(jsonLine);
          }, redraw: function () {
            let pt;
            // Select the added objects by class name as given previously
            window.Celestial.container.selectAll(".ast").each(function (d) {
              // Set line styles
              window.Celestial.setStyle(lineStyle);
              // Project objects on map
              window.Celestial.map(d);
              // draw on canvas
              window.Celestial.context.fill();
              window.Celestial.context.stroke();

              // If point is visible (this doesn't work automatically for points)
              if (window.Celestial.clip(d.properties.loc)) {
                // get point coordinates
                pt = window.Celestial.mapProjection(d.properties.loc);
                // Set text styles
                window.Celestial.setTextStyle(textStyle);
                // and draw text on canvas
                window.Celestial.context.fillText(d.properties.n, pt[0], pt[1]);
              }
            });
          }
        });

        window.Celestial.display(this.state.config);
        window.Celestial.zoomBy(1.5);

        //window.Celestial.clear();
      })

  }

  addConstellations = jsonLine => {
    var asterism = window.Celestial.getData(jsonLine, this.state.config.transform);
    // Add to celestiasl objects container in d3
    window.Celestial.container.selectAll(".asterisms")
      .data(asterism.features)
      .enter().append("path")
      .attr("class", "ast");
    // Trigger redraw to display changes
    window.Celestial.redraw();
  }

  toggleConstellations = () => {

  }

  render() {
    return (
      <React.Fragment>
        <p>Tests</p>
        <div id="Planetarium" style={{ overflow: 'hidden' }}><div id="celestial-map"></div></div>
        <div id="celestial-form"></div>
        <div class="options"><button onClick={this.toggleConstellations}>Toggle Constellations</button></div>
      </React.Fragment>
    )
  }
}
