import React, { Component } from 'react'

import Select from '../Select/Select'

import './CultureSelector.scss'

import cultures from './cultures.js'

console.log(cultures)

export default class CultureSelector extends Component {
  constructor() {
    super();

    this.state = {
      active: 'western',
      info: cultures.western
    }

    console.log(this.state)
  }

  changeCulture = culture => {
    console.log(culture);
    //console.log(cultures.indexOf(culture))
    this.setState({...this.state, active: culture, info: cultures[culture]}, () => {
      this.props.changeCulture(culture);
      this.props.changeVisibility();
    })
  }

  changeInfo = culture => {
    console.log(culture)
    this.setState({...this.state, info: cultures[culture]})
  }

  render() {
    let constellationSelect = [{ value: '', label: 'Select Constellation' }];
    if (this.props.constellationsOptions) {
      this.props.constellationsOptions.forEach(constellation => {
        constellationSelect.push({ value: constellation.center, label: constellation.name });
      })
    }

    return (
      <div className="CultureSelector">
        <div className="buttons">
          <h1>Select a Culture</h1>

          {Object.keys(cultures).map(id => {
            return (
              <button
                className={`${cultures[id].id} ${this.state.active == cultures[id].id && 'active'}`}
                onClick={e => this.changeCulture(cultures[id].id)}
                onMouseOver={e => this.changeInfo(cultures[id].id)}>
                {cultures[id].name}
              </button>)
          })}

          {/* {cultures.map(culture => {
            return (
              <button
                className={`${culture.id} ${this.state.active == culture.id && 'active'}`}
                onClick={e => this.changeCulture(culture.id)}>
                {culture.name}
              </button>)
          })} */}
        </div>

        <div className="info">
          <h2>{this.state.info.title}</h2>

          <div className="info-content">
            <p className="constellations"><span>{this.state.info.constellations}</span> constellations</p>
            {/* <p className="stars"><span>400</span> stars</p> */}

            <p className="text">{this.state.info.description}</p>
          </div>

          {/* <Select name="constellation" id="constellation-select" options={constellationSelect} onChange={this.props.navigateToConstellation} /> */}
        </div>
      </div>
    )
  }
}
