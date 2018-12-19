import React, { Component } from 'react'
import './CultureInfo.scss'

import cultures from '../CultureSelector/cultures'

export default class CultureInfo extends Component {
  render() {
    console.log(cultures)
    return (
      <div className="CultureInfo western">
        <img src="/images/icons/sun.svg" alt="Western"/>
        <h1>Western</h1>        
      </div>
    )
  }
}
