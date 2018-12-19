import React, { Component } from 'react'

import './Select.scss'

import Utils from './Utils'

export default class CustomSelect extends Component {
  constructor() {
    super();

    this.state = {
      optionsVisible: false, 
      selected: 'Select a Constellation'
    }

  }
  
  componentDidMount() {
    console.log(this.props)
  }
  
  changeVisibility = e => {
    this.setState({...this.state, optionsVisible: !this.state.optionsVisible})
  }

  changeConstellation = (constellation, label) => {
    console.log('clicked', constellation)
    this.props.navigateToConstellation(constellation);
    this.setState({...this.state, optionsVisible: false, selected: label})
  }
  
  render() {
    return (
      <div className="Select" id={this.props.id} >
        <div className={`header ${this.state.optionsVisible ? 'active' : ''}`} onClick={this.changeVisibility}>
          <span>{this.state.selected}</span><div></div>
        </div>
        <div className={`options ${this.state.optionsVisible ? 'visible' : ''}`}>
          {this.props.options.map(option => {
            return <div className="option" data-value={option.value} onClick={e => this.changeConstellation(option.value, option.label)}>{option.label}</div>
          })}
        </div>
      </div>
    )
  }
}
