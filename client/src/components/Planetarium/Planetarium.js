import React, { Component } from 'react';

import axios from 'axios';

import './css/celestial.css'
import './css/Planetarium.css'

import config from './config'
import celestialUtils from './celestial-utils'
import Constellations from './constellations'
import PlanetariumControls from '../PlanetariumControls/PlanetariumControls';

export default class Planetarium extends Component {
  constructor() {
    super();

    this.state = {
      loaded: false,
      showConstellations: true,
      config: config.celestial, 
      activeCulture: 'western'
    }
  }

  componentDidMount() {
    Constellations.paintConstellations('western', this.state, config)
      .then(navigationOptions => {
        this.setState({ ...this.state, constellationsOptions: navigationOptions })
        window.Celestial.display(this.state.config);
        window.Celestial.zoomBy(1.5);
      });
  }

  changeCulture = e => {
    this.setState({...this.state, activeCulture: e.target.value})
    window.Celestial.clear();
    window.Celestial.redraw();
    Constellations.paintConstellations(e.target.value, this.state, config)
      .then(navigationOptions => {
        this.setState({ ...this.state, constellationsOptions: navigationOptions })
      })
  }


  toggleConstellations = show => {
    if (show) {
      Constellations.paintConstellations(this.state.activeCulture, this.state, config)
    } else {
      document.querySelectorAll("path.ast").forEach(e => e.parentNode.removeChild(e));
      window.Celestial.redraw();
    }
  }

  toggleStars = (show, config) => {
    console.log(config);
    const {proper, names, desig} = config;

    console.log(proper, names, desig)

    const configCopy = {...this.state.config};
    configCopy.stars.proper = proper;
    configCopy.stars.names = names;
    configCopy.stars.desig = desig;

    console.log(configCopy)

    this.setState({...this.state, config: configCopy}, () => {
      console.log(this.state)
      window.Celestial.apply(this.state.config);
    })

  }

  navigateToConstellation = e => {
    if (!e.target.value.length) return;

    const coordinates = e.target.value.split(',');
    coordinates[0] = +coordinates[0];
    coordinates[1] = +coordinates[1];
    coordinates[2] = 0;

    let anims = [];

    let configCopy = { ...this.state.config };
    configCopy.center = coordinates;

    this.state.config.transform = 'arya';

    this.setState({ ...this.state, config: configCopy }, () => {
      var z = window.Celestial.zoomBy();
      if (z !== 1) {
        anims.push({ param: "zoom", value: 1.55 / z, duration: 0 })
      }
      anims.push({ param: "center", value: this.state.config.center, duration: 0 });
      var sc = 2;
      anims.push({ param: "zoom", value: sc, duration: 0 });
      window.Celestial.animate(anims, false);
    });
  }



  render() {
    return (
      <React.Fragment>
        <div id="Planetarium" style={{ overflow: 'hidden' }}><div id="celestial-map"></div></div>

        <PlanetariumControls 
          toggleConstellations={this.toggleConstellations}
          toggleStars={this.toggleStars} 
          changeCulture={this.changeCulture}
          navigateToConstellation={this.navigateToConstellation}
          constellationsOptions={this.state.constellationsOptions}
        />
      </React.Fragment>
    )
  }
}
