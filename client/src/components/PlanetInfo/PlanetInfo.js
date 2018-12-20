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
          {
            planet.facts.map(fact => {
              return (
                <div class="fact">
                  <p class="date">{fact.name}</p>
                  <p class="number">{fact.value}</p>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}
