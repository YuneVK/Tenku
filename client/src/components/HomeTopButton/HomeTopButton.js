import React, { Component } from 'react'

import './HomeTopButton.scss'

import solarSystemImg from './img/space.svg'
import constellationImg from './img/constellation.svg'

import {Link} from 'react-router-dom'


export default class HomeTopButton extends Component {
  constructor() {
    super();

    this.state = {
      active: false,
      offsetHeight: 0,
      link: '', 
      img: '',
      text: ''
    }

    this.aside = React.createRef()
  }

  componentDidMount() {
    const link = this.props.to === 'solarSystem' ? '/solar-system' : '/planetarium';
    const img = this.props.to === 'solarSystem' ? solarSystemImg : constellationImg;
    const text = this.props.to === 'solarSystem' ? 'Go to Solar System' : 'Go to Planetarium';

    this.setState({ ...this.state, offsetHeight: this.aside.current.offsetHeight, active: false, link, img, text })
  }

  toggleContent = e => {
    this.setState({ ...this.state, active: !this.state.active }, () => {
    })
  }

  show = e => {
    this.setState({ ...this.state, active: true })
  }

  hide = e => {
    this.setState({ ...this.state, active: false })
  }

  render() {
    const top = this.state.active ? 0 : this.state.offsetHeight;
    return (
      <Link to={this.state.link}>
        <div className={`HomeTopButton ${this.props.culture}`} style={{ top: -top }} onMouseOver={this.show} onMouseLeave={this.hide} onClick={() => {
        }}>
          <div className="main-content" >
            <p ref={this.aside}>{this.state.text}</p>
          </div>

          <div className="aside-button" >
            <div className="content">
              <img src={this.state.img} alt="Solar System Icon" />
            </div>
          </div>
        </div>
      </Link>
    )
  }
}