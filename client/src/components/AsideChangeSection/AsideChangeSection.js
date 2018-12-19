import React, { Component } from 'react'

import './AsideChangeSection.scss'

import solarSystemImg from './img/space.svg'

export default class AsideChangeSection extends Component {
  constructor() {
    super();

    this.state = {
      active: false
    }
  }

  render() {
    console.log(solarSystemImg)
    return (
      <div className="AsideChangeSection">
        <div className="aside-button" onClick={this.props.onClick}>
          <div className="content">
            <img src={solarSystemImg} alt="Solar System Icon"/>
            {/* <div className={`arrow ${!this.props.active && 'turned'}`}></div> */}
          </div>
        </div>

        <div className="content">
        
        </div>

      </div>
    )
  }
}
