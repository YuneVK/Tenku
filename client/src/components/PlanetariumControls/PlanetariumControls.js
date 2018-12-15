import React, { Component } from 'react';

import './PlanetariumControls.scss'

import Utils from './Utils'

export default class PlanetariumControls extends Component {


  toggleMenu = e => {
    let hasClass = Utils.toggleClass(document.querySelector('#PlanetariumControls'), 'visible');

    e.target.innerHTML = hasClass ? 'Close Controls' : 'Open Controls' ;
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
          <button onClick={this.props.toggleConstellations}>Toggle Constellations</button>

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


          <div id="celestial-form"></div>
        </div>
      </div>
    )
  }
}
