import React, { Component } from 'react'

import Select from '../Select/Select'

import './CultureSelector.scss'

export default class CultureSelector extends Component {
  
  render() {
    let constellationSelect = [{value: '', label: 'Select Constellation'}];
    if (this.props.constellationsOptions) {
      this.props.constellationsOptions.forEach(constellation => {
        constellationSelect.push({ value: constellation.center, label: constellation.name });
      })
    }

    return (
      <div className="CultureSelector">
        <div className="buttons">
          <h1>Select a Culture</h1>        
          <button className="western">Western</button>
          <button className="chinese">Chinese</button>
          <button className="aztec">Aztec</button>
          <button className="romanian">Romanian</button>
          <button className="egyptian">Egyptian</button>
        </div>

        <div className="info">
          <h2>Western (Modern)</h2>
          <p>In contemporary astronomy, a constellation is one of 88 regions of the sky generally based on the asterisms (which are also called "constellations") of Greek and Roman mythology. The number 88, along with the contemporary scientific concept of "constellation" as regions of the sky, bordered by arcs of right ascensions and declinations, that together cover the entire celestial sphere, was established in 1922 by the International Astronomical Union.</p>

          <Select name="constellation" id="constellation-select" options={constellationSelect} onChange={this.props.navigateToConstellation}/>
        </div>
      </div>
    )
  }
}
