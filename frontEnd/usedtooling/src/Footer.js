import React, { useEffect } from 'react';
import fbIcon from './facebook.png';
import ytIcon from './youtube.png';
import './App.css'

const Footer = () => {

  function registerview() {
    let longitude;
    let latitude;
  
    const getLocation = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            longitude = position.coords.latitude;
            latitude = position.coords.longitude;
            resolve();
          },
          (error) => {
            //console.error('Error getting location:', error.message);
            reject();
          }
        );
      });
    };
  
    getLocation()
      .then(() => {  
        const formData = new FormData();
        formData.append('lon', longitude ? longitude : null);
        formData.append('lat', latitude ? latitude : null);
        formData.append('url', window.location.href);
        formData.append('agent', navigator.userAgent);
        formData.append('user', getUser() ? getUser().userName : null);
  
        fetch('http://69.18.26.126:8080/registerview', { method: 'post', body: formData });
      })
      .catch(() => {
        const formData = new FormData();
        formData.append('lon', longitude ? longitude : null);
        formData.append('lat', latitude ? latitude : null);
        formData.append('url', window.location.href);
        formData.append('agent', navigator.userAgent);
        formData.append('user', getUser() ? getUser().userName : null);
      });
  }
    
    useEffect(()=>{registerview();}, []);
    
  const getUser = () => {
    return JSON.parse(window.localStorage.getItem('auth_user'));
  };

  return (
    <div className="Footer">
      <div className='footerLinks'>
        <a href="/">Home</a>
        <a href='/store'>Store</a>
        <a href='/equipment'>Equipment</a>
        {
          (getUser() && (getUser().role == 'OWNER' || getUser().role == 'EDITOR'))? <a href='/users'>Users</a> : ''
        }
        {
          (getUser() && (getUser().role == 'OWNER'))? <a href='/views'>Views</a> : ''
        }
        <a href='/#rigging'>Rigging Services</a>
        <a href='/#about'>About Us</a>
        <a href='/#contact'>Contact Us</a>
      </div>
      <div className='flavor'><p>Welcome to Anderson Tooling, your premier destination for professional services and top-tier parts tailored for trade and industry professionals. Renowned as a regional leader in rigging, logistics, tools, and parts, Anderson Tooling thrives on its commitment to innovative strength and a relentless pace of innovation.

As a seasoned professional, the expectations placed upon you demand qualities such as speed, reliability, competence, and endurance – qualities that mirror the excellence you strive to achieve in your work. In this regard, we believe it is only equitable to expect the same level of performance from your tools.

Enter Anderson Tooling's professional services and parts, meticulously designed to ensure tasks are executed flawlessly, adhering to the highest standards of speed, precision, and robustness. Our commitment is to empower you with the tools and services that embody the ethos of Revitalize, Reuse, and Revamp, enabling you to consistently achieve outstanding professional results.</p></div>
      <div className='copyrights'>&#169; Anderson Tooling 2023, all rights reserved</div>
      <div className='socialMedia'>
          <a href='https://www.facebook.com/Andersontoolinginc/'>
            <img src={fbIcon}/>
          </a>
          <a href='https://www.youtube.com/@usedtooling'>
            <img src={ytIcon}/> 
          </a>
      </div>
    </div>
  );
}

export default Footer;