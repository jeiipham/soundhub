import React from 'react';
import logo from '../logo.svg';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Home from './Home'
import Search from './Scan'

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} exact />
      <Route path="/scan/:username" component={Search} />
    </Switch>
  )
}

export default App;
