import React, { Component } from 'react'

import './AsidePlanets.scss'

import planets from './planets.js'

export default class AsidePlanets extends Component {
  constructor() {
    super();

    this.state = {
      active: 'Earth',
      info: planets.Earth, 
      active: false,
      offsetWidth: 0
    }

  }

  render() {
    return (
      <div className="AsidePlanets">
        <div className="buttons">
          <h1>Select a Planet</h1>
          <div className="buttonsContainer">
          {Object.keys(planets).map(id => {
            return (
              <button
                className={`${planets[id].id} ${this.state.active == planets[id].id && 'active'}`}
                onClick={e => this.props.switchPlanet(id)}
                //onMouseOver={e => this.changeInfo(planets[id].id)}
                >
                {planets[id].name}
              </button>)
          })}
          </div>
        </div>

        {/* <div className={`info ${this.state.info.id}`}>
          <h2>{this.state.info.title}</h2>

          <div className="info-content">
            <p className="constellations"><span>{this.state.info.constellations}</span> constellations</p>
            <p className="text">{this.state.info.description}</p>
          </div>

        </div> */}
      </div>
    )
  }
}
