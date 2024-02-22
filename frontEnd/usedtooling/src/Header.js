import React from 'react';
import './App.css'
import logo from './logo.png';
import slogan from './Slogan.png';
import { Link, useNavigate } from 'react-router-dom';
import { red } from '@mui/material/colors';

const Header = () => {
  const navigate = useNavigate();
  const navigateToChild = () => {
    navigate("/");
  };
  return (
    <div className="Header">
      <img src={logo} onClick={navigateToChild}/>
      <img className='mobileHidden' src={slogan}/>
    </div>
  );
}

export default Header;