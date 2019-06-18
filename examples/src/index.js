import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import MySimpleTable from './SingleTable';
import MyHierarchyTable from './HierarchyTable';
import MyEnhancedTable from './EnhancedTable';
import Detail from './detail';

const App = () => (
  <Router>
    <div>
      <ul>
        <li><Link to={'/'}>Home</Link></li>
        <li><Link to={'/simple-table/'}>SimpleTable</Link></li>
        <li><Link to={'/hierarchy-table/'}>HierarchyTable</Link></li>
        <li><Link to={'/enhanced-table/'}>EnhancedTable</Link></li>
      </ul>
      <Route path='/simple-table/' component={MySimpleTable} />
      <Route path='/hierarchy-table/' component={MyHierarchyTable} />
      <Route path='/enhanced-table/' component={MyEnhancedTable} />
      <Route path='/detail/:pk/' component={Detail} />
    </div>
  </Router>
);

render(<App />, document.getElementById('root'));