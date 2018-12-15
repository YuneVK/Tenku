import React, { Component } from 'react';

import axios from 'axios';

import './celestial.css'
import './css/Planetarium.css'



export default class Planetarium extends Component {
  constructor() {
    super();

    this.state = {
      loaded: false,
      showConstellations: true,
      actualConstellations: undefined,
      config: {
        projection: "airy",
        //projection: "equirectangular",
        form: true,
        width: window.innerWidth,
        center: [-65, 0],
        //center: [180, 90],
        background: { fill: "#160048", stroke: "#160048", opacity: 1, width: 1 },
        datapath: "./data/",
        adaptable: true, 
        stars: {
          colors: false,
          names: false,
          style: { fill: "#FEFFFF", opacity: 1 },
          limit: 6,
          size: 5
        },
        dsos: { show: false },
        mw: {
          style: { fill: "#2C0089", opacity: 0.1 }
        },
        constellations: {
          show: false,
          linestyle: { stroke: "transparent", width: 0, opacity: 0 },
        }, 
        lines: {
          graticule: { show: true, stroke: "#cccccc", width: 0.6, opacity: 0.1},
          equatorial: { show: false, stroke: "#cccccc", width: 0.6, opacity: 0.2 },
          ecliptic: { show: false}  
        }, 
        location: true,
        planets: {  //Show planet locations, if date-time is set
          show: true,
          // List of all objects to show
          which: ["sol", "mer", "ven", "ter", "lun", "mar", "jup", "sat", "ura", "nep"],
          // Font styles for planetary symbols
          style: { fill: "#00ccff", font: "bold 22px 'Lucida Sans Unicode', Consolas, sans-serif", 
                  align: "center", baseline: "middle" },
          symbols: {  // Character and color for each symbol in 'which', simple circle \u25cf
            "sol": {symbol: "\u2609", fill: "#ffff00"},
            "mer": {symbol: "\u263f", fill: "#cccccc"},
            "ven": {symbol: "\u2640", fill: "#eeeecc"},
            "ter": {symbol: "\u2295", fill: "#00ffff"},
            "lun": {symbol: "\u25cf", fill: "#ffffff"}, // overridden by generated cresent
            "mar": {symbol: "\u2642", fill: "#ff9999"},
            "cer": {symbol: "\u26b3", fill: "#cccccc"},
            "ves": {symbol: "\u26b6", fill: "#cccccc"},
            "jup": {symbol: "\u2643", fill: "#ff9966"},
            "sat": {symbol: "\u2644", fill: "#ffcc66"},
            "ura": {symbol: "\u2645", fill: "#66ccff"},
            "nep": {symbol: "\u2646", fill: "#6666ff"},
            "plu": {symbol: "\u2647", fill: "#aaaaaa"},
            "eri": {symbol: "\u25cf", fill: "#eeeeee"}
          }
        },
      }, 
      constellationsOptions: undefined
    }
  }

  componentDidMount() {
    this.paintConstellations('western')
      .then(() => {
        window.Celestial.display(this.state.config);
        console.log(this.state.config)
        window.Celestial.zoomBy(1.5);
      });
  }

  paintConstellations = name => {
    return axios.get('http://127.0.0.1:5000/api/culture/' + name)
      .then(data => {
        // Asterisms canvas style properties for lines and text
        var lineStyle = {
          stroke: "#FEFFFF",
          opacity: ".5",
          fill: "transparent",
          width: 1
        },
          textStyle = {
            fill: "#fafafa",
            font: "bold 15px 'Open Sans', sans-serif",
            align: "center",
            baseline: "middle"
          };

        const constellationsData = data.data.culture.constellations;

        let selectOptions = [];

        let constellations = constellationsData.map(constellation => {
          //console.log(constellation)
          selectOptions.push({name: constellation.name, id: constellation.id, center: constellation.points[0][0]})  
          return {
            "type": "Feature",
            "id": constellation.name,
            "properties": {
              // Name
              "n": constellation.name,
              // Location of name text on the map
              "loc": constellation.points[0][0]
            }, "geometry": {
              // the line object as an array of point coordinates
              "type": "MultiLineString",
              "coordinates": constellation.points
            }
          }
        })

        this.setState({...this.state, constellationsOptions: selectOptions})

        var jsonLine = {
          "type": "FeatureCollection",
          // this is an array, add as many objects as you want
          "features": constellations
        };

        window.Celestial.clear();

        if (window.Celestial.redraw) {
          window.Celestial.redraw();
        }

        window.Celestial.add({
          type: "line", name:name, callback:  (error, json) => {
            if (error) return console.warn(error);
            // Load the geoJSON file and transform to correct coordinate system, if necessary
            console.log('changed to new culture')
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
              //window.Celestial.context.fill();
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
        if (window.Celestial.container)
          this.addConstellations(jsonLine);
      })
      
  }

  setCenter = (ctr, trans) => {
    var cx = window.document.querySelectorAll("centerx"), cy = window.document.querySelectorAll("centery"), cz = window.document.querySelectorAll("centerz");
    if (!cx || !cy) return;
    
    if (ctr === null) ctr = [0,0,0]; 
    if (ctr.length <= 2) ctr[2] = 0;
    //config.center = ctr; 
    if (trans !== "equatorial") cx.value = ctr[0].toFixed(1); 
    else cx.value = ctr[0] < 0 ? (ctr[0] / 15 + 24).toFixed(1) : (ctr[0] / 15).toFixed(1); 
    
    cy.value = ctr[1].toFixed(1);
    cz.value = ctr[2] !== null ? ctr[2].toFixed(1) : 0;
  }

  changeCulture = e => {
    window.Celestial.clear();
    window.Celestial.redraw();
    this.paintConstellations(e.target.value)
      .then(() => {
        console.log('time to repaint')
        //window.Celestial.display(this.state.config);
        //window.Celestial.zoomBy(1.5);
      });
  }

  addConstellations = jsonLine => {
    console.log(jsonLine)
    var asterism = window.Celestial.getData(jsonLine, this.state.config.transform);

    console.log(window.Celestial.container.selectAll(".asterisms"))

    document.querySelectorAll("path.ast").forEach(e => e.parentNode.removeChild(e));

    window.Celestial.container.selectAll(".asterisms")
      //.data([])
      .data(asterism.features)
      .enter().append("path")
      .attr("class", "ast");

    window.Celestial.redraw();    
    
  }

  toggleConstellations = () => {
    this.paintConstellations('chinese')
    .then(() => {
      window.Celestial.display(this.state.config);
      window.Celestial.zoomBy(1.5);
    });
  }

  changeConstellation = e => {
    if (!e.target.value.length) return;
    
    const coordinates = e.target.value.split(',');
    coordinates[0] = +coordinates[0];
    coordinates[1] = +coordinates[1];
    coordinates[2] = 0;
    
    let anims = [];

    let configCopy = {...this.state.config};
    configCopy.center = coordinates;

    this.state.config.transform = 'arya';

    this.setState({...this.state, config: configCopy}, () => {
      var z = window.Celestial.zoomBy();
      if (z !== 1) {
        anims.push({param:"zoom", value:1.55/z, duration:0})
      }
      anims.push({param:"center", value:this.state.config.center, duration:0});
      var sc = 2;
      anims.push({param:"zoom", value:sc, duration:0});
      window.Celestial.animate(anims, false);

    });
  }

  setCenter= (ctr, trans) => {
    var cx = document.querySelectorAll("centerx"), cy = document.querySelectorAll("centery"), cz = document.querySelectorAll("centerz");
    if (!cx || !cy) return;
    
    if (ctr === null) ctr = [0,0,0]; 
    if (ctr.length <= 2) ctr[2] = 0;
    //config.center = ctr; 
    if (trans !== "equatorial") cx.value = ctr[0].toFixed(1); 
    else cx.value = ctr[0] < 0 ? (ctr[0] / 15 + 24).toFixed(1) : (ctr[0] / 15).toFixed(1); 
    
    cy.value = ctr[1].toFixed(1);
    cz.value = ctr[2] !== null ? ctr[2].toFixed(1) : 0;
  }

  render() {
    let constellationsOptions = [];
    if (this.state.constellationsOptions) {
      constellationsOptions = this.state.constellationsOptions.map(constellation => {
        return <option value={constellation.center}>{constellation.name}</option>
      })
      constellationsOptions.unshift(<option value=''>Select Constellation</option>)
    }
    return (
      <React.Fragment>
        <p>Tests</p>
        <div id="Planetarium" style={{ overflow: 'hidden' }}><div id="celestial-map"></div></div>
        <div id="celestial-form"></div>
        <div class="options">
          <button onClick={this.toggleConstellations}>Toggle Constellations</button>

          <select name="culture" id="culture" onChange={this.changeCulture}>
            <option value="western">Western</option>
            <option value="chinese">Chinese</option>
            <option value="aztec">Aztec</option>
            <option value="romanian">Romanian</option>
            <option value="egyptian">Egyptian</option>
          </select>

          <select name="constellation" id="constellation" onChange={this.changeConstellation}>
            {constellationsOptions}
          </select>
        </div>
      </React.Fragment>
    )
  }
}
