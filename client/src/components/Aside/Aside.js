import React, { Component } from 'react'

import './Aside.scss'

import AsideButton from '../AsideButton/AsideButton'

export default class Aside extends Component {
  constructor() {
    super();

    this.state = {
      active: false,
      offsetWidth: 0
    }

    this.myInput = React.createRef()
  }

  componentDidMount () {
    console.log(this.myInput.current.offsetWidth)
    this.setState({...this.state, offsetWidth: this.myInput.current.offsetWidth})
  }

  toggleContent = e => {
    console.log('clicked', e.target)
    this.setState({...this.state, active: !this.state.active}, () => {
      console.log(this.state.active)

    })
  }

  render() {
    const left = this.state.active ? 0 : this.state.offsetWidth
    return (
      <div className="Aside" style={{left: -left}}>
        <div className="content" ref={this.myInput}>
          {this.props.children}
        </div>
        <AsideButton onClick={this.toggleContent} />
      </div>
    )
  }
}
