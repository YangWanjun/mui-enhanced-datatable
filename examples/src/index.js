import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './home';
import Detail from './detail';

const App = () => (
  <BrowserRouter>
    <div>
      <Route exact path='/' component={Home} />
      <Route path='/detail/:pk/' component={Detail} />
    </div>
  </BrowserRouter>
);

render(<App />, document.getElementById('root'));