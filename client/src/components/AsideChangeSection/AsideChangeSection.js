import React, { Component } from 'react'

import './AsideChangeSection.scss'

import solarSystemImg from './img/space.svg'

import {Link} from 'react-router-dom'


export default class AsideChangeSection extends Component {
  constructor() {
    super();

    this.state = {
      active: true,
      offsetHeight: 0
    }

    this.aside = React.createRef()
  }

  componentDidMount() {
    this.setState({ ...this.state, offsetHeight: this.aside.current.offsetHeight, active: true })
  }

  toggleContent = e => {
    this.setState({ ...this.state, active: !this.state.active }, () => {
    })
  }

  show = e => {
    console.log('mouse over')
    this.setState({ ...this.state, active: false })
  }

  hide = e => {
    this.setState({ ...this.state, active: true })
  }

  render() {
    const top = this.state.active ? this.state.offsetHeight : 0;
    console.log('test')
    return (
      <Link to="/solar-system">
        <div className={`AsideChangeSection ${this.props.culture}`} style={{ bottom: -top }} onMouseOver={this.show} onMouseLeave={this.hide} onClick={() => {
          // context.history.push === history.push
        }}>
          <div className="aside-button" >
            <div className="content">
              <img src={solarSystemImg} alt="Solar System Icon" />
              {/* <div className={`arrow ${!this.props.active && 'turned'}`}></div> */}
            </div>
          </div>

          <div className="main-content" >
            <p ref={this.aside}>Go to Solar System</p>
          </div>

        </div>
      </Link>
    )
  }
}
