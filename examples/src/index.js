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
        <li><Link to={'/mui-enhanced-datatable/'}>Home</Link></li>
        <li><Link to={'/mui-enhanced-datatable/simple-table/'}>SimpleTable</Link></li>
        <li><Link to={'/mui-enhanced-datatable/hierarchy-table/'}>HierarchyTable</Link></li>
        <li><Link to={'/mui-enhanced-datatable/enhanced-table/'}>EnhancedTable</Link></li>
      </ul>
      <Route path='/mui-enhanced-datatable/simple-table/' component={MySimpleTable} />
      <Route path='/mui-enhanced-datatable/hierarchy-table/' component={MyHierarchyTable} />
      <Route path='/mui-enhanced-datatable/enhanced-table/' component={MyEnhancedTable} />
      <Route path='/mui-enhanced-datatable/detail/:pk/' component={Detail} />
    </div>
  </Router>
);

render(<App />, document.getElementById('root'));