import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import MySimpleTable from './SingleTable';
import MyHierarchyTable from './HierarchyTable';
import MyEnhancedTable from './EnhancedTable';
import Detail from './detail';

const App = () => (
  <BrowserRouter>
    <div>
      <ul>
        <li><Link to={'/simple-table/'}>SimpleTable</Link></li>
        <li><Link to={'/hierarchy-table/'}>HierarchyTable</Link></li>
        <li><Link to={'/enhanced-table/'}>EnhancedTable</Link></li>
      </ul>
      <Route path='/simple-table/' component={MySimpleTable} />
      <Route path='/hierarchy-table/' component={MyHierarchyTable} />
      <Route path='/enhanced-table/' component={MyEnhancedTable} />
      <Route path='/detail/:pk/' component={Detail} />
    </div>
  </BrowserRouter>
);

render(<App />, document.getElementById('root'));