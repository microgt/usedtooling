import React, { useEffect } from 'react';
import './App.css'
import logo from './logo.png';
import slogan from './Slogan.png';
import { Link, useNavigate } from 'react-router-dom';
import { red } from '@mui/material/colors';
import { Helmet } from 'react-helmet';
import ReactGA from 'react-ga4';

ReactGA.initialize('G-BBMXTPZQL9');

const Header = () => {
  const navigate = useNavigate();
  const navigateToChild = () => {
    navigate("/");
  };
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);
  return (
    <div>
      <Helmet>
        <title>Anderson Tooling Inc</title>
      </Helmet>
      <div className="Header">
        <img src={logo} onClick={navigateToChild}/>
        <img className='mobileHidden' src={slogan}/>
      </div>
    </div>
    
  );
}

export default Header;