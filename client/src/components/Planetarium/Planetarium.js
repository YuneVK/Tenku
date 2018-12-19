import React, { Component } from 'react';

import axios from 'axios';

import './css/celestial.css'
import './css/Planetarium.css'

import config from './config'
import celestialUtils from './celestial-utils'
import Constellations from './constellations'
import PlanetariumControls from '../PlanetariumControls/PlanetariumControls';

import Aside from '../Aside/Aside'
import CultureSelector from '../CultureSelector/CultureSelector'
import Select from '../Select/Select'
import AsideConstellation from '../AsideConstellation/AsideConstellation'
import AsideChangeSection from '../AsideChangeSection/AsideChangeSection'
import CultureInfo from '../CultureInfo/CultureInfo'

export default class Planetarium extends Component {
  constructor() {
    super();

    this.state = {
      loaded: false,
      showConstellations: true,
      config: config.celestial,
      activeCulture: 'western',
      asideCultures: false
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

  componentWillUnmount = () => {
    let canvas = document.querySelector('canvas');
    document.querySelector('#celestial-map').removeChild(canvas);
  }

  getCoordinates = () => {
    var element = document.getElementById('here');
    var event = new Event('click');
    element.dispatchEvent(event);
  }

  changeCulture = culture => {
    console.log('new culture', culture)
    this.setState({ ...this.state, activeCulture: culture }, () => {
      console.log('active culture changed, new culture is ', this.state.activeCulture)
      window.Celestial.clear();
      window.Celestial.redraw();
      Constellations.paintConstellations(culture, this.state, config)
        .then(navigationOptions => {
          console.log('options changed', culture)
          this.setState({ ...this.state, constellationsOptions: navigationOptions, asideCultures: false, activeCulture: culture })
        })
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
    const { proper, names, desig } = config;

    const configCopy = { ...this.state.config };
    configCopy.stars.proper = proper;
    configCopy.stars.names = names;
    configCopy.stars.desig = desig;

    this.setState({ ...this.state, config: configCopy }, () => {
      window.Celestial.apply(this.state.config);
    })
  }

  navigateToConstellation = coordinates => {
    if (!coordinates.length) return;

    //const coordinates = e.target.value.split(',');
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

  setPlanetsAnimation = () => {
    let reqID,
      reqAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame,
      cncAnimFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame ||
        window.webkitCancelAnimationFrame || window.msCancelAnimationFrame ||
        window.oCancelAnimationFrame,
      dt = new Date(document.querySelector('#datetime').value);

    function animate() {
      reqID = reqAnimFrame(animate);
      dt.setDate(dt.getDate() + 1);
      window.Celestial.date(dt);
    }

    window.d3.select('#celestial-map').on('mousedown', function () { cncAnimFrame(reqID) })
    window.d3.select('#celestial-map').on('mouseup', function () { reqAnimFrame(animate) })
    window.d3.select('#planets-animation').on('click', function () {
      cncAnimFrame(reqID);
      window.d3.select('#celestial-map').on('mousedown', null)
      window.d3.select('#celestial-map').on('mouseup', null)
    })

    window.d3.select('.solar-system').on('click', function () {
      cncAnimFrame(reqID);
      window.d3.select('#celestial-map').on('mousedown', null)
      window.d3.select('#celestial-map').on('mouseup', null)
    })

    reqID = reqAnimFrame(animate);
  }

  changeAsideCultures = () => {
    //console.log(visibility)

    this.setState({ ...this.state, asideCultures: !this.state.asideCultures })
  }

  render() {
    let constellationSelect = [{ value: '', label: 'Select Constellation' }];
    if (this.state.constellationsOptions) {
      this.state.constellationsOptions.forEach(constellation => {
        constellationSelect.push({ value: constellation.center, label: constellation.name });
      })
    }

    console.log('culture to sends', this.state.activeCulture)

    return (
      <React.Fragment>
        <CultureInfo culture={this.state.activeCulture} />

        <Aside orientation="left" visible={this.state.asideCultures}>
          <CultureSelector
            constellationsOptions={this.state.constellationsOptions}
            changeCulture={this.changeCulture}
            //visible={this.state.asideCultures}
            changeVisibility={this.changeAsideCultures}
          />
        </Aside>

        <AsideConstellation culture={this.state.activeCulture}>
          <Select name="constellation" id="constellation-select" options={constellationSelect} navigateToConstellation={this.navigateToConstellation} />
        </AsideConstellation>

        <AsideChangeSection />

        {/* <Select name="constellation" id="constellation-select" options={constellationSelect} onChange={this.navigateToConstellation}/> */}

        <div id="Planetarium" style={{ overflow: 'hidden' }}><div id="celestial-map"></div></div>

        <PlanetariumControls
          toggleConstellations={this.toggleConstellations}
          toggleStars={this.toggleStars}
          changeCulture={this.changeCulture}
          navigateToConstellation={this.navigateToConstellation}
          constellationsOptions={this.state.constellationsOptions}
          setPlanetsAnimation={this.setPlanetsAnimation}
        />
      </React.Fragment>
    )
  }
}