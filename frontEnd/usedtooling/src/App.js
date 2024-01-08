import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home.js';
import Contact from './Contact.js';
import Store from './Store.js';
import Product from './Product';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/store' element={<Store />} />
        <Route path='/product' element={<Product />} />
      </Routes>
    </Router>
  );
}
