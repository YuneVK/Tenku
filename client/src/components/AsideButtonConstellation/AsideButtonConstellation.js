import React, { Component } from 'react'
import './AsideButtonConstellation.scss'

export default class AsideButtonConstellation extends Component {
  render() {
    return (
      <div className="AsideButtonConstellation" onClick={this.props.onClick}>
        <div className="content">
          <div className={`arrow ${!this.props.active && 'turned'}`}></div>
        </div>
      </div>
    )
  }
}
