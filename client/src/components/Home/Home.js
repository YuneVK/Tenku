import React, { Component } from 'react'

import {Link} from 'react-router-dom'

import './Home.scss'

import EarthHome from '../EarthHome/EarthHome'
import AsideChangeSection from '../AsideChangeSection/AsideChangeSection'
import HomeTopButton from '../HomeTopButton/HomeTopButton'

export default class Home extends Component {
  render() {
    return (
      <div className="Home">

        <EarthHome />

        <div className="content">
          <h1>Tenku</h1>

          <AsideChangeSection to="planetarium" />
          <HomeTopButton to="solarSystem" />
        </div>

      </div>
    )
  }
}
