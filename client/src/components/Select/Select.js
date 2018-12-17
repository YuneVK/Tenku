import React, { Component } from 'react'

import './Select.scss'

import Utils from './Utils'

export default class CustomSelect extends Component {
  constructor() {
    super();

    this.state = {
      optionsVisible: false
    }

  }
  
  componentDidMount() {
    console.log(this.props)
    
  }
  
  changeVisibility = e => {
    this.setState({...this.state, optionsVisible: !this.state.optionsVisible})
  }
  
  
  render() {
    return (
      <div className="Select" id={this.props.id}>
        <div className={`header ${this.state.optionsVisible ? 'active' : ''}`} onClick={this.changeVisibility}>
          <span>Select a Constellation</span><div></div>
        </div>
        <div className={`options ${this.state.optionsVisible ? 'visible' : ''}`}>
          {this.props.options.map(option => {
            return <div className="option" data-value={option.value}>{option.label}</div>
          })}
        </div>
      </div>
    )
  }
}
