import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import AddProducts from './components/ManageProduct';
import AllProducts from './components/AllProducts';
import ManageProducts from './components/ManageProduct';

const App = () => {
  const [activeItem, setActiveItem] = useState('');

  const handleItemClick = (name) => setActiveItem(name);

  return (
    <Router>
      <div>
        <nav className="menu-bar">
          <Link 
            to="/home" 
            className={activeItem === 'Home' ? 'active' : ''} 
            onClick={() => handleItemClick('Home')}
          >
            Home
          </Link>

          <Link 
            to="/allproducts" 
            className={activeItem === 'View all products' ? 'active' : ''} 
            onClick={() => handleItemClick('View all products')}
          >
            View all products
          </Link>

          <Link 
            to="/addproduct" 
            className={activeItem === 'Add a new product' ? 'active' : ''} 
            onClick={() => handleItemClick('Add a new product')}
          >
            Manage Products
          </Link>

        </nav>

        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/addproduct" element={<ManageProducts />} />
          <Route path="/allproducts" element={<AllProducts />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
