import React, { Component } from 'react'
import './AsideConstellation.scss'
import './themes.scss'

import AsideButtonConstellation from '../AsideButtonConstellation/AsideButtonConstellation'

export default class AsideConstellation extends Component {
  constructor() {
    super();

    this.state = {
      active: false,
      offsetHeight: 0
    }

    this.aside = React.createRef()
  }

  componentDidMount () {
    this.setState({...this.state, offsetHeight: this.aside.current.offsetHeight, active: this.props.visible})
  }

  toggleContent = e => {
    this.setState({...this.state, active: !this.state.active}, () => {
    })
  }

  render() {
    const top = this.state.active ? 0 : this.state.offsetHeight;

    console.log('active cultures', this.props.culture)

    return (
      <div className={`AsideConstellation ${this.props.culture}`} style={{top: -top}}>
        <div className="content" ref={this.aside}>
          {/* <p className="culture-name">Western</p> */}
          {this.props.children}
        </div>
        <AsideButtonConstellation onClick={this.toggleContent} active={top} />
      </div>
    )
  }
}
