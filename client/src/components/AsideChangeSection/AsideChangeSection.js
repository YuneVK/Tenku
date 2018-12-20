import React, { Component } from 'react'

import './AsideChangeSection.scss'

import solarSystemImg from './img/space.svg'
import constellationImg from './img/constellation.svg'

import {Link} from 'react-router-dom'


export default class AsideChangeSection extends Component {
  constructor() {
    super();

    this.state = {
      active: true,
      offsetHeight: 0,
      link: '', 
      img: '',
      text: ''
    }

    this.aside = React.createRef()
  }

  componentDidMount() {
    const link = this.props.to === 'solarSystem' ? '/solar-system' : '/';
    const img = this.props.to === 'solarSystem' ? solarSystemImg : constellationImg;
    const text = this.props.to === 'solarSystem' ? 'Go to Solar System' : 'Go to Planetarium';

    this.setState({ ...this.state, offsetHeight: this.aside.current.offsetHeight, active: true, link, img, text })
  }

  toggleContent = e => {
    this.setState({ ...this.state, active: !this.state.active }, () => {
    })
  }

  show = e => {
    this.setState({ ...this.state, active: false })
  }

  hide = e => {
    this.setState({ ...this.state, active: true })
  }

  render() {
    const top = this.state.active ? this.state.offsetHeight : 0;
    return (
      <Link to={this.state.link}>
        <div className={`AsideChangeSection ${this.props.culture}`} style={{ bottom: -top }} onMouseOver={this.show} onMouseLeave={this.hide} onClick={() => {
        }}>
          <div className="aside-button" >
            <div className="content">
              <img src={this.state.img} alt="Solar System Icon" />
            </div>
          </div>

          <div className="main-content" >
            <p ref={this.aside}>{this.state.text}</p>
          </div>
        </div>
      </Link>
    )
  }
}