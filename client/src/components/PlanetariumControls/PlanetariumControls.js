import React, { Component } from 'react';

import './PlanetariumControls.scss'

import Utils from './Utils'

export default class PlanetariumControls extends Component {
  constructor() {
    super();

    let date = new Date();

    this.state = {
      stars: {
        proper: false,
        names: false,
        desig: false
      },
      dtFormat: window.d3.time.format("%Y-%m-%d %H:%M:%S"),
      zenith: [0, 0],
      geopos: [0, 0],
      date,
      zone: date.getTimezoneOffset()
    }
  }

  toggleMenu = e => {
    let hasClass = Utils.toggleClass(document.querySelector('#PlanetariumControls'), 'visible');

    e.target.innerHTML = hasClass ? 'Close Controls' : 'Open Controls';
  }

  toggleConstellations = (e, callback) => {
    let hasClass = Utils.toggleClass(e.target, 'on');

    e.target.innerHTML = hasClass ? 'Hide Constellations' : 'Show Constellations';

    callback(hasClass)
  }

  toggleStarsNames = (e, callback, option) => {
    let starsConfig = {...this.state.stars};
    let hasClass = Utils.toggleClass(e.target, 'on');

    starsConfig[option] = hasClass; 

    if (!starsConfig.names) {
      starsConfig.desig = false;
      document.querySelector('#all-designations').innerHTML = 'Show All Designations';
      Utils.removeClass(document.querySelector('#all-designations'), 'on');
    }

    if (starsConfig.desig) {
      starsConfig.names = true
      document.querySelector('#designations').innerHTML = 'Hide Designations';
    }

    switch (option) {
      case 'proper':
        e.target.innerHTML = hasClass ? 'Hide Proper Names' : 'Show Proper Names';
        break;

      case 'names':
        if (!hasClass) {
          starsConfig.desig = false;
          starsConfig.names = false;
          document.querySelector('#all-designations').innerHTML = 'Show All Designations';
        }
        e.target.innerHTML = hasClass ? 'Hide Designations' : 'Show Designations';
        break;

      case 'desig':
        e.target.innerHTML = hasClass ? 'Hide All Designations' : 'Show All Designations';
        break;
    }

    this.setState({...this.state, stars: starsConfig}, () => {
      callback(hasClass, this.state.stars)
    })
  }

  setPlanetsAnimation = e => {
    const activated = Utils.toggleClass(e.target, 'on');

    e.target.innerHTML = activated ? 'Stop Planets Animation' : 'Start Planets Animation';

    console.log(activated)
    if (activated) this.props.setPlanetsAnimation();
  }

  render() {
    let constellationsOptions = [];
    if (this.props.constellationsOptions) {
      constellationsOptions = this.props.constellationsOptions.map(constellation => {
        return <option value={constellation.center}>{constellation.name}</option>
      })
      constellationsOptions.unshift(<option value=''>Select Constellation</option>)
    }

    return (
      <div id="PlanetariumControls">
        <button class="toggleMenu" onClick={this.toggleMenu}>Open Controls</button>

        <div class="menu">
          <section>
            <p>Constellations</p>
            <select name="culture" id="culture" onChange={this.props.changeCulture}>
              <option value="western">Western</option>
              <option value="chinese">Chinese</option>
              <option value="aztec">Aztec</option>
              <option value="romanian">Romanian</option>
              <option value="egyptian">Egyptian</option>
            </select>

            <select name="constellation" id="constellation" onChange={this.props.navigateToConstellation}>
              {constellationsOptions}
            </select>

            <button className="on" onClick={e => this.toggleConstellations(e, this.props.toggleConstellations)}>Hide Constellations</button>
          </section>

          <section>
            <p>Stars</p>

            <button onClick={e => this.toggleStarsNames(e, this.props.toggleStars, 'proper')}>Show Proper Names</button>
            <button id="designations" onClick={e => this.toggleStarsNames(e, this.props.toggleStars, 'names')}>Show Designations</button>
            <span>Bayer, Flamsteed, Variable star, Gliese</span>
            <button id="all-designations" onClick={e => this.toggleStarsNames(e, this.props.toggleStars, 'desig')}>Show All Designations</button>
            <span>Including Draper and Hipparcos</span>
          </section>

          <section>
            <p>Date and Time</p>
            {/* <div id="date"></div> */}
            <div id="celestial-form"></div>

          </section>

          <section>
            <p>Animation</p>

            <button id="planets-animation" onClick={this.setPlanetsAnimation}>Start Planets Animation</button>
          </section>
        </div>
      </div>
    )
  }
}
