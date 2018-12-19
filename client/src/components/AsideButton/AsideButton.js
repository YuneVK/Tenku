import React, { Component } from 'react'

import './AsideButton.scss'

export default class AsideButton extends Component {
  render() {
    //console.log(this.props)
    return (
      <div class="AsideButton" onClick={this.props.onClick}>
        <div className="content">
          <div className="arrow"></div>
        </div>
      </div>
    )
  }
}
