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
      config: config.celestial
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
    window.Celestial.clear();
    window.Celestial.redraw();
    Constellations.paintConstellations(e.target.value, this.state, config)
      .then(navigationOptions => {
        this.setState({ ...this.state, constellationsOptions: navigationOptions })
      })
  }


  toggleConstellations = () => {
    console.log('toggle constellation')
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
          changeCulture={this.changeCulture}
          navigateToConstellation={this.navigateToConstellation}
          constellationsOptions={this.state.constellationsOptions}
        />
      </React.Fragment>
    )
  }
}
