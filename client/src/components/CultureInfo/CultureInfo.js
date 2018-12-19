import React, { Component } from 'react'
import './CultureInfo.scss'

import cultures from './data'

export default class CultureInfo extends Component {
  render() {
    const culture = cultures[this.props.culture]

    console.log(culture);

    return (
      <div className={`CultureInfo ${culture.id}`} style={{color: culture.color}}>
        <img src={culture.img} alt={culture.name}/>
        <h1>{culture.name}</h1>        
      </div>
    )
  }
}
