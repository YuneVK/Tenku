import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Planetarium from './components/Planetarium/Planetarium'
import SolarSystem from './components/SolarSystem/SolarSystem'

import { Switch, Route } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path='/' component={Planetarium}/>
          <Route path='/solar-system' component={SolarSystem}/>
        </Switch>
      </div>
    );
  }
}

export default App;
