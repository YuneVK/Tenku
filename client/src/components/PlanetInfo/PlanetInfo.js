import React, { Component } from 'react'
import './PlanetInfo.scss'

import planets from '../AsidePlanets/planets'

export default class PlanetInfo extends Component {
  constructor() {
    super();

    this.state = {
      planet: {}
    }
  }

  componentDidMount() {
    this.setState({...this.state, planet: planets[this.props.info]})
  }


  render() {
    const planet = planets[this.props.info]

    return (
      <div className="PlanetInfo">
        <p className="title">{planet.name}</p>

        <div class="facts">
          <div class="fact">
            <p class="date">Radius</p>
            <p class="number">44km</p>
          </div>

          <div class="fact">
            <p class="date">Surface temperature</p>
            <p class="number">44km</p>
          </div>

          <div class="fact">
            <p class="date">Age</p>
            <p class="number">44km</p>
          </div>

          <div class="fact">
            <p class="date">Distance to Earth</p>
            <p class="number">44km</p>
          </div>
        </div>
      </div>
    )
  }
}
