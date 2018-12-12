import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Planetarium from './components/Planetarium/Planetarium'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Planetarium />
      </div>
    );
  }
}

export default App;
