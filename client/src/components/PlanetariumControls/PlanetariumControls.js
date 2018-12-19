import React, { Component } from 'react';

import './PlanetariumControls.scss'

import Utils from './Utils'

import { NavLink } from 'react-router-dom'

import Select from '../Select/Select'



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
    Utils.toggleClass(e.target, 'active');
  }

  toggleConstellations = (e, callback) => {
    let hasClass = Utils.toggleClass(e.target, 'on');

    e.target.innerHTML = hasClass ? 'Hide Constellations' : 'Show Constellations';

    callback(hasClass)
  }

  toggleStarsNames = (e, callback, option) => {
    let starsConfig = { ...this.state.stars };
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

      case 'designations':
        starsConfig.desig = !starsConfig.desig;
        starsConfig.names = !starsConfig.names;
        e.target.innerHTML = hasClass ? 'Hide Designations' : 'Show Designations';
        break;

      // case 'desig':
      //   e.target.innerHTML = hasClass ? 'Hide All Designations' : 'Show All Designations';
      //   break;
    }

    this.setState({ ...this.state, stars: starsConfig }, () => {
      callback(hasClass, this.state.stars)
    })
  }

  setPlanetsAnimation = e => {
    const activated = Utils.toggleClass(e.target, 'on');

    e.target.innerHTML = activated ? 'Stop Planets Animation' : 'Start Planets Animation';

    if (activated) this.props.setPlanetsAnimation();
  }

  render() {
    let constellationsOptions = [];
    let constellationSelect = [{ value: '', label: 'Select a Constellation' }];
    if (this.props.constellationsOptions) {
      constellationsOptions = this.props.constellationsOptions.map(constellation => {
        constellationSelect.push({ value: constellation.center, label: constellation.name });
        return <option value={constellation.center}>{constellation.name}</option>
      })
    }

    return (
      <div id="PlanetariumControls">
        <div className="stars-options">
          <button className="button" onClick={e => this.toggleStarsNames(e, this.props.toggleStars, 'proper')}>Show Proper Names</button>
          <button className="button" id="designations" onClick={e => this.toggleStarsNames(e, this.props.toggleStars, 'designations')}>Show Designations</button>
          <NavLink strict to="/solar-system/" className="solar-system">Go to Solar System</NavLink>
        </div>
        <div className="menu" style={{ display: 'none' }}>
          <section>
            <p>Constellations</p>
            <select name="culture" id="culture" onChange={this.props.changeCulture}>
              <option value="western">Western</option>
              <option value="chinese">Chinese</option>
              <option value="aztec">Aztec</option>
              <option value="romanian">Romanian</option>
              <option value="egyptian">Egyptian</option>
            </select>

            <Select name="constellation" id="constellation" options={constellationSelect} onChange={this.props.navigateToConstellation} />
            <select name="constellation" id="constellation" onChange={this.props.navigateToConstellation}>
              {constellationsOptions}
            </select>

            <button className="on button" onClick={e => this.toggleConstellations(e, this.props.toggleConstellations)}>Hide Constellations</button>
          </section>

          <section>
            <p>Stars</p>

            <button className="button" onClick={e => this.toggleStarsNames(e, this.props.toggleStars, 'proper')}>Show Proper Names</button>
            <button className="button" id="designations" onClick={e => this.toggleStarsNames(e, this.props.toggleStars, 'names')}>Show Designations</button>
            <span className="starInfo">Bayer, Flamsteed, Variable star, Gliese</span>
            <button className="button" id="all-designations" onClick={e => this.toggleStarsNames(e, this.props.toggleStars, 'desig')}>Show All Designations</button>
            <span className="starInfo">Including Draper and Hipparcos</span>
          </section>

          <section>
            <p>Date and Time</p>
            <div id="celestial-form"></div>

          </section>

          <section>
            <p>Animation</p>

            <button className="button" id="planets-animation" onClick={this.setPlanetsAnimation}>Start Planets Animation</button>
          </section>

          <NavLink strict to="/solar-system/" className="solar-system">Go to Solar System</NavLink>
        </div>
      </div>
    )
  }
}
